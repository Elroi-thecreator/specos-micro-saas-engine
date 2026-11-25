import { HybridAgentRuntime } from './agent-runtime';
import { AgentJob, JobStore } from './types';

export class InMemoryJobStore implements JobStore {
  private readonly jobs = new Map<string, AgentJob>();

  public get(jobId: string): AgentJob | null {
    return this.jobs.get(jobId) || null;
  }

  public set(jobId: string, job: AgentJob): void {
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
}

export interface EnqueueJobMetadata {
  tenantName?: string;
  locale?: string;
  metadata?: Record<string, any>;
}

/**
 * Asynchronous tenant-scoped worker queue for executing agent tasks without blocking HTTP handlers.
 */
export class AgentQueueService {
  private readonly runtime: HybridAgentRuntime;
  private readonly store: JobStore;
  private readonly dispatchDelayMs: number;

  constructor(options: AgentQueueServiceOptions) {
    this.runtime = options.runtime;
    this.store = options.store || new InMemoryJobStore();
    this.dispatchDelayMs = options.dispatchDelayMs ?? 50;
  }

  public enqueueJob<TPayload = any>(
    tenantSlug: string,
    taskKey: string,
    inputPayload: TPayload,
    options?: EnqueueJobMetadata
  ): AgentJob<TPayload> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job: AgentJob<TPayload> = {
      id: jobId,
      tenantSlug,
      tenantName: options?.tenantName,
      locale: options?.locale,
      taskKey,
      status: 'QUEUED',
      inputPayload,
      resultPayload: null,
      tokensUsed: 0,
      latencyMs: 0,
      createdAt: new Date().toISOString(),
    };

    this.store.set(jobId, job);

    setTimeout(() => {
      void this.processJob(jobId, options?.metadata);
    }, this.dispatchDelayMs);

    return job;
  }

  private async processJob(jobId: string, metadata?: Record<string, any>): Promise<void> {
    const job = this.store.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    this.store.set(jobId, job);

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
      this.store.set(jobId, job);
    } catch (err: any) {
      job.status = 'FAILED';
      job.error = err?.message || 'Agent execution failed';
      job.completedAt = new Date().toISOString();
      this.store.set(jobId, job);
    }
  }

  public getJob(jobId: string): AgentJob | null {
    return this.store.get(jobId);
  }

  public listJobsForTenant(tenantSlug: string): AgentJob[] {
    return this.store.listByTenant(tenantSlug);
  }
}
