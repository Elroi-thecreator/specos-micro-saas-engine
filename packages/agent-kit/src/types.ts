export interface AgentTaskContext<TPayload = any> {
  taskKey: string;
  tenantSlug: string;
  tenantName: string;
  locale: string;
  payload: TPayload;
  metadata?: Record<string, any>;
  signal?: AbortSignal;
}

export interface AgentPromptSpec {
  systemInstruction: string;
  prompt: string;
  model?: string;
  responseMimeType?: string;
}

export interface AgentFallbackResult<TResult = any> {
  result: TResult;
  tokens: number;
}

export interface AgentTaskHandler<TPayload = any, TResult = any> {
  buildPrompt: (ctx: AgentTaskContext<TPayload>) => AgentPromptSpec;
  fallback: (ctx: AgentTaskContext<TPayload>) => AgentFallbackResult<TResult>;
}

export interface AgentExecutionOptions<TPayload = any> {
  taskKey: string;
  tenantSlug: string;
  tenantName?: string;
  locale?: string;
  payload: TPayload;
  metadata?: Record<string, any>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface AgentExecutionResult<TResult = any> {
  resultPayload: TResult;
  tokensUsed: number;
  modelUsed: string;
  isLive: boolean;
  latencyMs: number;
}

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AgentJob<TPayload = any, TResult = any> {
  id: string;
  tenantSlug: string;
  tenantName?: string;
  locale?: string;
  taskKey: string;
  status: JobStatus;
  attempts: number;
  inputPayload: TPayload;
  resultPayload: TResult | null;
  tokensUsed: number;
  latencyMs: number;
  modelUsed?: string;
  isLive?: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  error?: string;
}

export type MaybePromise<T> = T | Promise<T>;

/**
 * Storage interface for AgentQueueService. Supports both synchronous (in-memory)
 * and asynchronous (Redis, Postgres, etc.) implementations.
 */
export interface JobStore {
  get(jobId: string): MaybePromise<AgentJob | null>;
  set(jobId: string, job: AgentJob): MaybePromise<void>;
  listByTenant(tenantSlug: string): MaybePromise<AgentJob[]>;
  listByStatus?(status: JobStatus): MaybePromise<AgentJob[]>;
}

export interface LedgerEntry {
  id: string;
  tenantId: string;
  taskKey: string;
  tokensDebited: number;
  balanceRemaining: number;
  timestamp: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

/**
 * Pluggable sliding-window rate-limit store (supports sync in-memory or async Redis/DB).
 */
export interface RateLimitStore {
  checkAndRecord(
    tenantId: string,
    maxPerWindow: number,
    windowMs: number,
    now: number
  ): MaybePromise<RateLimitResult>;
}

/**
 * Pluggable atomic token ledger store (supports sync in-memory or async Postgres/Redis).
 * `tryDebit` MUST atomically check `consumed + tokensToDebit <= budgetMonthly` and persist the debit.
 */
export interface LedgerStore {
  tryDebit(
    tenantId: string,
    taskKey: string,
    tokensToDebit: number,
    budgetMonthly: number,
    entryId: string
  ): MaybePromise<DebitResult>;
  getConsumed(tenantId: string): MaybePromise<number>;
  listByTenant(tenantId: string): MaybePromise<LedgerEntry[]>;
}

export interface DebitResult {
  success: boolean;
  newConsumed: number;
  remaining: number;
  error?: string;
}
