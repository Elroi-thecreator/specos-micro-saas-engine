import {
  AgentJob as KitAgentJob,
  AgentQueueService as KitAgentQueueService,
  JobStatus,
} from 'specos-agent-kit';
import { geminiAgentRuntime } from './gemini-agent-service';
import { ModuleKey, SupportedLocale } from '../types';

export type { JobStatus };

export interface AgentJob extends Omit<KitAgentJob, 'taskKey' | 'locale'> {
  locale?: SupportedLocale;
  moduleKey: ModuleKey;
}

function toSpecOSJob(job: KitAgentJob): AgentJob {
  const { taskKey, locale, ...rest } = job;
  return {
    ...rest,
    locale: locale as SupportedLocale | undefined,
    moduleKey: taskKey as ModuleKey,
  };
}

class SpecOSAgentQueueService {
  private readonly queue = new KitAgentQueueService({
    runtime: geminiAgentRuntime,
    concurrency: 5,
    maxRetries: 2,
  });

  public async enqueueJob(
    tenantSlug: string,
    moduleKey: ModuleKey,
    inputPayload: any,
    metadata?: {
      tenantName?: string;
      locale?: SupportedLocale;
      sensitivity?: string;
    }
  ): Promise<AgentJob> {
    const job = await this.queue.enqueueJob(tenantSlug, moduleKey, inputPayload, {
      tenantName: metadata?.tenantName,
      locale: metadata?.locale,
      metadata: metadata?.sensitivity ? { sensitivity: metadata.sensitivity } : undefined,
    });
    return toSpecOSJob(job);
  }

  public async getJob(jobId: string): Promise<AgentJob | null> {
    const job = await this.queue.getJob(jobId);
    return job ? toSpecOSJob(job) : null;
  }

  public async listJobsForTenant(tenantSlug: string): Promise<AgentJob[]> {
    const jobs = await this.queue.listJobsForTenant(tenantSlug);
    return jobs.map(toSpecOSJob);
  }
}

export const agentQueueService = new SpecOSAgentQueueService();
