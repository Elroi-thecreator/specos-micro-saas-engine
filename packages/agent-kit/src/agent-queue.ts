import { HybridAgentRuntime } from './agent-runtime';
import { AgentJob, JobStore } from './types';

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
}

export interface AgentQueueServiceOptions {
  runtime: HybridAgentRuntime;
  store?: JobStore;
  dispatchDelayMs?: number;
  concurrency?: number;
  maxRetries?: number;
  retryBaseDelayMs?: number;
}

export interface EnqueueJobMetadata {
  tenantName?: string;
  locale?: string;
  metadata?: Record<string, any>;
}

/**
 * Asynchronous tenant-scoped worker queue with bounded concurrency,
 * exponential-backoff retries, and an async-capable JobStore interface.
 */
export class AgentQueueService {
  private readonly runtime: HybridAgentRuntime;
  private readonly store: JobStore;
  private readonly dispatchDelayMs: number;
  private readonly concurrency: number;
  private readonly maxRetries: number;
  private readonly retryBaseDelayMs: number;
  private activeCount = 0;
  private readonly pendingQueue: Array<{ jobId: string; metadata?: Record<string, any> }> = [];

  constructor(options: AgentQueueServiceOptions) {
    this.runtime = options.runtime;
    this.store = options.store || new InMemoryJobStore();
    this.dispatchDelayMs = options.dispatchDelayMs ?? 10;
    this.concurrency = Math.max(1, options.concurrency ?? 5);
    this.maxRetries = Math.max(0, options.maxRetries ?? 2);
    this.retryBaseDelayMs = Math.max(10, options.retryBaseDelayMs ?? 50);
  }

  public async enqueueJob<TPayload = any>(
    tenantSlug: string,
    taskKey: string,
    inputPayload: TPayload,
    options?: EnqueueJobMetadata
  ): Promise<AgentJob<TPayload>> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
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
      createdAt: new Date().toISOString(),
    };

    await this.store.set(jobId, job);

    setTimeout(() => {
      this.pendingQueue.push({ jobId, metadata: options?.metadata });
      this.drainQueue();
    }, this.dispatchDelayMs);

    return job;
  }

  private drainQueue(): void {
    while (this.activeCount < this.concurrency && this.pendingQueue.length > 0) {
      const next = this.pendingQueue.shift();
      if (!next) break;
      this.activeCount += 1;
      void this.processJob(next.jobId, next.metadata).finally(() => {
        this.activeCount -= 1;
        this.drainQueue();
      });
    }
  }

  private async processJob(jobId: string, metadata?: Record<string, any>): Promise<void> {
    const job = await this.store.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    await this.store.set(jobId, job);

    let lastError: any;
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      job.attempts = attempt;
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
        await this.store.set(jobId, job);
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
    await this.store.set(jobId, job);
  }

  public async getJob(jobId: string): Promise<AgentJob | null> {
    return this.store.get(jobId);
  }

  public async listJobsForTenant(tenantSlug: string): Promise<AgentJob[]> {
    return this.store.listByTenant(tenantSlug);
  }
}
