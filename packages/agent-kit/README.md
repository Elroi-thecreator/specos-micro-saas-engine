# specos-agent-kit

Multi-tenant hybrid Gemini agent runtime, crash-resilient async worker queue, and pluggable atomic token ledger & sliding-window rate limiter.

## Features

- **Hybrid Gemini Runtime (`HybridAgentRuntime`)**: Lazily imports `@google/genai` (optional `peerDependency`) only when an API key is configured, enforces `AbortSignal` + `timeoutMs` timeouts, and falls back deterministically when offline or unauthenticated.
- **Crash-Resilient Worker Queue (`AgentQueueService`)**: Bounded `concurrency`, exponential-backoff `maxRetries` / `retryBaseDelayMs`, lifecycle hooks (`onJobCompleted`, `onJobFailed`), `recoverJobs()` for restarting stranded jobs from an external `JobStore`, and async-capable `JobStore` (`InMemoryJobStore` by default).
- **Atomic Token Ledger & Sliding-Window Rate Limiter (`TokenLedgerService`)**: True sliding-window timestamp log (`RateLimitStore`) and atomic `tryDebit(...)` quota enforcement (`LedgerStore`) with `InMemoryRateLimitStore` and `InMemoryLedgerStore` defaults.
- **Integrated Orchestrator (`AgentOrchestrator`)**: Wires `checkRateLimit` -> atomic `debitTokens` -> `enqueueJob` in one call.

## Quick Start

```ts
import {
  AgentOrchestrator,
  AgentQueueService,
  HybridAgentRuntime,
  TokenLedgerService,
} from 'specos-agent-kit';

const runtime = new HybridAgentRuntime({ timeoutMs: 15000 });
runtime.registerTask('summarize', {
  buildPrompt: (ctx) => ({
    systemInstruction: `Summarize for ${ctx.tenantName} in ${ctx.locale}. Return JSON.`,
    prompt: JSON.stringify(ctx.payload),
  }),
  fallback: (ctx) => ({
    result: { summary: `Offline summary for ${ctx.tenantName}` },
    tokens: 150,
  }),
});

const queue = new AgentQueueService({
  runtime,
  concurrency: 5,
  maxRetries: 2,
  retryBaseDelayMs: 50,
  onJobCompleted: async (job) => {
    console.log('Completed', job.id, job.tokensUsed);
  },
});

const ledger = new TokenLedgerService({ windowMs: 60_000, maxLedgerEntries: 10_000 });
const orchestrator = new AgentOrchestrator({ ledger, queue });

const result = await orchestrator.dispatch({
  tenantId: 'tenant-1',
  tenantSlug: 'acme',
  tenantName: 'Acme Corp',
  locale: 'en',
  taskKey: 'summarize',
  payload: { text: 'Hello' },
  estimatedTokens: 200,
  budgetMonthly: 100_000,
});

if (result.accepted) {
  console.log('Queued job:', result.job.id);
}

// On startup with an external JobStore, recover any stranded QUEUED or stale PROCESSING jobs:
await queue.recoverJobs({ staleProcessingMs: 60_000 });
```

## Production Store Adapters (Reference Examples)

### Postgres `LedgerStore` (atomic `tryDebit`)

```ts
import type { LedgerStore } from 'specos-agent-kit';

export class PostgresLedgerStore implements LedgerStore {
  constructor(private readonly db: { query: (sql: string, params: any[]) => Promise<{ rows: any[] }> }) {}

  async tryDebit(tenantId: string, taskKey: string, tokensToDebit: number, budgetMonthly: number, entryId: string) {
    const res = await this.db.query(
      `UPDATE tenant_quotas
       SET consumed = consumed + $2
       WHERE tenant_id = $1 AND consumed + $2 <= $3
       RETURNING consumed`,
      [tenantId, tokensToDebit, budgetMonthly]
    );
    if (res.rows.length === 0) {
      const current = await this.getConsumed(tenantId);
      return { success: false, newConsumed: current, remaining: Math.max(0, budgetMonthly - current), error: 'Budget exceeded' };
    }
    const newConsumed = res.rows[0].consumed;
    await this.db.query(
      `INSERT INTO token_ledger (id, tenant_id, task_key, tokens_debited, balance_remaining) VALUES ($1, $2, $3, $4, $5)`,
      [entryId, tenantId, taskKey, tokensToDebit, budgetMonthly - newConsumed]
    );
    return { success: true, newConsumed, remaining: budgetMonthly - newConsumed };
  }

  async getConsumed(tenantId: string) {
    const res = await this.db.query(`SELECT consumed FROM tenant_quotas WHERE tenant_id = $1`, [tenantId]);
    return res.rows[0]?.consumed ?? 0;
  }

  async listByTenant(tenantId: string) {
    const res = await this.db.query(`SELECT * FROM token_ledger WHERE tenant_id = $1 ORDER BY timestamp DESC`, [tenantId]);
    return res.rows;
  }
}
```

### Redis `RateLimitStore` (sliding-window sorted set)

```ts
import type { RateLimitStore } from 'specos-agent-kit';

export class RedisRateLimitStore implements RateLimitStore {
  constructor(private readonly redis: { eval: (script: string, keys: string[], args: (string | number)[]) => Promise<[number, number]> }) {}

  async checkAndRecord(tenantId: string, maxPerWindow: number, windowMs: number, now: number) {
    if (maxPerWindow <= 0) return { allowed: false, remaining: 0, resetAtMs: now + windowMs };
    const lua = `
      redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
      local count = redis.call('ZCARD', KEYS[1])
      if count >= tonumber(ARGV[2]) then return {0, 0} end
      redis.call('ZADD', KEYS[1], ARGV[3], ARGV[3] .. '-' .. math.random())
      redis.call('PEXPIRE', KEYS[1], ARGV[4])
      return {1, tonumber(ARGV[2]) - count - 1}
    `;
    const [allowed, remaining] = await this.redis.eval(lua, [`rl:${tenantId}`], [now - windowMs, maxPerWindow, now, windowMs]);
    return { allowed: allowed === 1, remaining, resetAtMs: now + windowMs };
  }
}
```
