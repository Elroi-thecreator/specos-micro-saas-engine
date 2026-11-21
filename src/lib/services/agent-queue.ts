import { geminiAgentService } from './gemini-agent-service';
import { SupportedLocale } from '../types';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AgentJob {
  id: string;
  tenantSlug: string;
  tenantName?: string;
  locale?: SupportedLocale;
  moduleKey: 'docIntel' | 'supportSwarm' | 'codeAudit';
  status: JobStatus;
  inputPayload: any;
  resultPayload: any;
  tokensUsed: number;
  latencyMs: number;
  modelUsed?: string;
  isLive?: boolean;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

class AgentQueueService {
  private jobs: Map<string, AgentJob> = new Map();

  public enqueueJob(
    tenantSlug: string,
    moduleKey: 'docIntel' | 'supportSwarm' | 'codeAudit',
    inputPayload: any,
    metadata?: {
      tenantName?: string;
      locale?: SupportedLocale;
      sensitivity?: string;
    }
  ): AgentJob {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const job: AgentJob = {
      id: jobId,
      tenantSlug,
      tenantName: metadata?.tenantName,
      locale: metadata?.locale,
      moduleKey,
      status: 'QUEUED',
      inputPayload,
      resultPayload: null,
      tokensUsed: 0,
      latencyMs: 0,
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(jobId, job);

    // Asynchronously dispatch worker execution
    setTimeout(() => {
      this.processJob(jobId, metadata?.sensitivity);
    }, 50);

    return job;
  }

  private async processJob(jobId: string, sensitivity?: string) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';

    try {
      const executionResult = await geminiAgentService.execute({
        moduleKey: job.moduleKey,
        tenantSlug: job.tenantSlug,
        tenantName: job.tenantName || job.tenantSlug,
        locale: job.locale || 'en',
        payload: job.inputPayload,
        sensitivity,
      });

      job.status = 'COMPLETED';
      job.resultPayload = executionResult.resultPayload;
      job.tokensUsed = executionResult.tokensUsed;
      job.modelUsed = executionResult.modelUsed;
      job.isLive = executionResult.isLive;
      job.latencyMs = executionResult.latencyMs;
      job.completedAt = new Date().toISOString();
    } catch (err: any) {
      job.status = 'FAILED';
      job.error = err?.message || 'Agent execution failed';
      job.completedAt = new Date().toISOString();
    }
  }

  public getJob(jobId: string): AgentJob | null {
    return this.jobs.get(jobId) || null;
  }

  public listJobsForTenant(tenantSlug: string): AgentJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.tenantSlug === tenantSlug);
  }
}

export const agentQueueService = new AgentQueueService();
