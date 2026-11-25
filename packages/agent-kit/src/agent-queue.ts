import { randomUUID } from 'crypto';
import { HybridAgentRuntime } from './agent-runtime';
import { AgentJob, JobStatus, JobStore, MaybePromise } from './types';

function createJobId(): string {
  try {
    return `job_${randomUUID()}`;
  } catch {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

export class InMemoryJobStore implements JobStore {
  private readonly jobs = new Map<string, AgentJob>();
  private readonly maxJobs: number;

  constructor(maxJobs = 5000) {
    this.maxJobs = maxJobs;
  }

  public get(jobId: string): AgentJob | null {
    return this.jobs.get(jobId) || null;
  }

  public set(jobId: string, job: AgentJob): void {
    if (!this.jobs.has(jobId) && this.jobs.size >= this.maxJobs) {
      const oldestKey = this.jobs.keys().next().value;
      if (oldestKey !== undefined) {
        this.jobs.delete(oldestKey);
      }
    }
    this.jobs.set(jobId, job);
  }

  public listByTenant(tenantSlug: string): AgentJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.tenantSlug === tenantSlug);
  }

  public listByStatus(status: JobStatus): AgentJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === status);
  }
}

export interface AgentQueueServiceOptions {
  runtime: HybridAgentRuntime;
  store?: JobStore;
  dispatchDelayMs?: number;
  concurrency?: number;
  maxRetries?: number;
  retryBaseDelayMs?: number;
  onJobCompleted?: (job: AgentJob) => MaybePromise<void>;
  onJobFailed?: (job: AgentJob) => MaybePromise<void>;
}

export interface EnqueueJobMetadata {
  tenantName?: string;
  locale?: string;
  metadata?: Record<string, any>;
}

/**
 * Asynchronous tenant-scoped worker queue with bounded concurrency,
 * exponential-backoff retries, crash-recovery (`recoverJobs`), lifecycle hooks,
 * and an async-capable JobStore interface.
 */
export class AgentQueueService {
  private readonly runtime: HybridAgentRuntime;
  private readonly store: JobStore;
  private readonly dispatchDelayMs: number;
  private readonly concurrency: number;
  private readonly maxRetries: number;
  private readonly retryBaseDelayMs: number;
  private readonly onJobCompleted?: (job: AgentJob) => MaybePromise<void>;
  private readonly onJobFailed?: (job: AgentJob) => MaybePromise<void>;
  private activeCount = 0;
  private readonly pendingQueue: Array<{ jobId: string; metadata?: Record<string, any> }> = [];
  private readonly queuedOrActiveIds = new Set<string>();

  constructor(options: AgentQueueServiceOptions) {
    this.runtime = options.runtime;
    this.store = options.store || new InMemoryJobStore();
    this.dispatchDelayMs = options.dispatchDelayMs ?? 10;
    this.concurrency = Math.max(1, options.concurrency ?? 5);
    this.maxRetries = Math.max(0, options.maxRetries ?? 2);
    this.retryBaseDelayMs = Math.max(10, options.retryBaseDelayMs ?? 50);
    this.onJobCompleted = options.onJobCompleted;
    this.onJobFailed = options.onJobFailed;
  }

  public async enqueueJob<TPayload = any>(
    tenantSlug: string,
    taskKey: string,
    inputPayload: TPayload,
    options?: EnqueueJobMetadata
  ): Promise<AgentJob<TPayload>> {
    const jobId = createJobId();
    const nowIso = new Date().toISOString();
    const job: AgentJob<TPayload> = {
      id: jobId,
      tenantSlug,
      tenantName: options?.tenantName,
      locale: options?.locale,
      taskKey,
      status: 'QUEUED',
      attempts: 0,
      inputPayload,
      resultPayload: null,
      tokensUsed: 0,
      latencyMs: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await this.store.set(jobId, job);

    setTimeout(() => {
      this.enqueueLocal(jobId, options?.metadata);
    }, this.dispatchDelayMs);

    return job;
  }

  /**
   * Recover `QUEUED` jobs (and optionally stale `PROCESSING` jobs) from the JobStore
   * after a process restart so external stores do not leave jobs stranded.
   */
  public async recoverJobs(options: { staleProcessingMs?: number } = {}): Promise<number> {
    if (!this.store.listByStatus) {
      return 0;
    }

    let recovered = 0;
    const queued = await this.store.listByStatus('QUEUED');
    for (const job of queued) {
      if (!this.queuedOrActiveIds.has(job.id)) {
        this.enqueueLocal(job.id);
        recovered += 1;
      }
    }

    if (options.staleProcessingMs !== undefined && options.staleProcessingMs >= 0) {
      const cutoff = Date.now() - options.staleProcessingMs;
      const processing = await this.store.listByStatus('PROCESSING');
      for (const job of processing) {
        const updatedMs = Date.parse(job.updatedAt || job.createdAt);
        if (!this.queuedOrActiveIds.has(job.id) && updatedMs <= cutoff) {
          job.status = 'QUEUED';
          job.updatedAt = new Date().toISOString();
          await this.store.set(job.id, job);
          this.enqueueLocal(job.id);
          recovered += 1;
        }
      }
    }

    return recovered;
  }

  private enqueueLocal(jobId: string, metadata?: Record<string, any>): void {
    if (this.queuedOrActiveIds.has(jobId)) return;
    this.queuedOrActiveIds.add(jobId);
    this.pendingQueue.push({ jobId, metadata });
    this.drainQueue();
  }

  private drainQueue(): void {
    while (this.activeCount < this.concurrency && this.pendingQueue.length > 0) {
      const next = this.pendingQueue.shift();
      if (!next) break;
      this.activeCount += 1;
      void this.processJob(next.jobId, next.metadata).finally(() => {
        this.activeCount -= 1;
        this.queuedOrActiveIds.delete(next.jobId);
        this.drainQueue();
      });
    }
  }

  private async processJob(jobId: string, metadata?: Record<string, any>): Promise<void> {
    const job = await this.store.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    job.updatedAt = new Date().toISOString();
    await this.store.set(jobId, job);

    let lastError: any;
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      job.attempts = attempt;
      job.updatedAt = new Date().toISOString();
      try {
        const executionResult = await this.runtime.execute({
          taskKey: job.taskKey,
          tenantSlug: job.tenantSlug,
          tenantName: job.tenantName || job.tenantSlug,
          locale: job.locale || 'en',
          payload: job.inputPayload,
          metadata,
        });

        job.status = 'COMPLETED';
        job.resultPayload = executionResult.resultPayload;
        job.tokensUsed = executionResult.tokensUsed;
        job.modelUsed = executionResult.modelUsed;
        job.isLive = executionResult.isLive;
        job.latencyMs = executionResult.latencyMs;
        job.completedAt = new Date().toISOString();
        job.updatedAt = job.completedAt;
        await this.store.set(jobId, job);
        if (this.onJobCompleted) {
          await this.onJobCompleted(job);
        }
        return;
      } catch (err: any) {
        lastError = err;
        if (attempt <= this.maxRetries) {
          const backoffMs = this.retryBaseDelayMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    job.status = 'FAILED';
    job.error = lastError?.message || 'Agent execution failed';
    job.completedAt = new Date().toISOString();
    job.updatedAt = job.completedAt;
    await this.store.set(jobId, job);
    if (this.onJobFailed) {
      await this.onJobFailed(job);
    }
  }

  public async getJob(jobId: string): Promise<AgentJob | null> {
    return this.store.get(jobId);
  }

  public async listJobsForTenant(tenantSlug: string): Promise<AgentJob[]> {
    return this.store.listByTenant(tenantSlug);
  }
}
