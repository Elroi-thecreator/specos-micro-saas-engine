export interface AgentTaskContext<TPayload = any> {
  taskKey: string;
  tenantSlug: string;
  tenantName: string;
  locale: string;
  payload: TPayload;
  metadata?: Record<string, any>;
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
  inputPayload: TPayload;
  resultPayload: TResult | null;
  tokensUsed: number;
  latencyMs: number;
  modelUsed?: string;
  isLive?: boolean;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface JobStore {
  get(jobId: string): AgentJob | null;
  set(jobId: string, job: AgentJob): void;
  listByTenant(tenantSlug: string): AgentJob[];
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
}

export interface DebitResult {
  success: boolean;
  newConsumed: number;
  remaining: number;
  error?: string;
}
