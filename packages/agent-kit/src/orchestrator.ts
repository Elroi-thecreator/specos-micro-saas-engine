import { AgentQueueService } from './agent-queue';
import { TokenLedgerService } from './token-ledger';
import { AgentJob, DebitResult, RateLimitResult } from './types';

export interface AgentOrchestratorOptions {
  ledger: TokenLedgerService;
  queue: AgentQueueService;
  defaultRateLimitPerWindow?: number;
}

export interface DispatchAgentTaskOptions<TPayload = any> {
  tenantId: string;
  tenantSlug: string;
  tenantName?: string;
  locale?: string;
  taskKey: string;
  payload: TPayload;
  estimatedTokens: number;
  budgetMonthly: number;
  maxPerWindow?: number;
  metadata?: Record<string, any>;
}

export type DispatchAgentTaskResult<TPayload = any> =
  | {
      accepted: true;
      job: AgentJob<TPayload>;
      rateLimit: RateLimitResult;
      debit: DebitResult;
    }
  | {
      accepted: false;
      reason: 'RATE_LIMITED';
      rateLimit: RateLimitResult;
    }
  | {
      accepted: false;
      reason: 'BUDGET_EXCEEDED';
      rateLimit: RateLimitResult;
      debit: DebitResult;
    };

/**
 * Integrated orchestrator wiring rate-limit check -> atomic token debit -> async job enqueue.
 */
export class AgentOrchestrator {
  private readonly ledger: TokenLedgerService;
  private readonly queue: AgentQueueService;
  private readonly defaultRateLimitPerWindow: number;

  constructor(options: AgentOrchestratorOptions) {
    this.ledger = options.ledger;
    this.queue = options.queue;
    this.defaultRateLimitPerWindow = options.defaultRateLimitPerWindow ?? 60;
  }

  public async dispatch<TPayload = any>(
    options: DispatchAgentTaskOptions<TPayload>
  ): Promise<DispatchAgentTaskResult<TPayload>> {
    const rateLimit = await this.ledger.checkRateLimit(
      options.tenantId,
      options.maxPerWindow ?? this.defaultRateLimitPerWindow
    );

    if (!rateLimit.allowed) {
      return {
        accepted: false,
        reason: 'RATE_LIMITED',
        rateLimit,
      };
    }

    const debit = await this.ledger.debitTokens(
      options.tenantId,
      options.taskKey,
      options.estimatedTokens,
      options.budgetMonthly
    );

    if (!debit.success) {
      return {
        accepted: false,
        reason: 'BUDGET_EXCEEDED',
        rateLimit,
        debit,
      };
    }

    const job = await this.queue.enqueueJob(
      options.tenantSlug,
      options.taskKey,
      options.payload,
      {
        tenantName: options.tenantName,
        locale: options.locale,
        metadata: options.metadata,
      }
    );

    return {
      accepted: true,
      job,
      rateLimit,
      debit,
    };
  }
}
