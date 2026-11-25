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
  });

  public enqueueJob(
    tenantSlug: string,
    moduleKey: ModuleKey,
    inputPayload: any,
    metadata?: {
      tenantName?: string;
      locale?: SupportedLocale;
      sensitivity?: string;
    }
  ): AgentJob {
    const job = this.queue.enqueueJob(tenantSlug, moduleKey, inputPayload, {
      tenantName: metadata?.tenantName,
      locale: metadata?.locale,
      metadata: metadata?.sensitivity ? { sensitivity: metadata.sensitivity } : undefined,
    });
    return toSpecOSJob(job);
  }

  public getJob(jobId: string): AgentJob | null {
    const job = this.queue.getJob(jobId);
    return job ? toSpecOSJob(job) : null;
  }

  public listJobsForTenant(tenantSlug: string): AgentJob[] {
    return this.queue.listJobsForTenant(tenantSlug).map(toSpecOSJob);
  }
}

export const agentQueueService = new SpecOSAgentQueueService();
