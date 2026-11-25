# specos-agent-kit

Multi-tenant hybrid Gemini agent runtime, asynchronous worker queue, and atomic token ledger & sliding-window rate limiter.

## Features

- **Hybrid Gemini Runtime (`HybridAgentRuntime`)**: Executes tasks via `@google/genai` when `GEMINI_API_KEY` is configured and automatically falls back to deterministic, localized handlers when offline or unauthenticated.
- **Pluggable Task Registry**: Register custom agent tasks via `runtime.registerTask(key, { buildPrompt, fallback })`.
- **Async Worker Queue (`AgentQueueService`)**: Dispatches background jobs (`QUEUED` → `PROCESSING` → `COMPLETED` / `FAILED`) with a pluggable `JobStore` interface (defaults to `InMemoryJobStore`).
- **Token Ledger & Rate Limiter (`TokenLedgerService`)**: Per-tenant sliding-window rate limiting and atomic monthly token quota debits.

## Usage

```ts
import {
  HybridAgentRuntime,
  AgentQueueService,
  TokenLedgerService,
} from 'specos-agent-kit';

const runtime = new HybridAgentRuntime();
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

const queue = new AgentQueueService({ runtime });
const ledger = new TokenLedgerService();

const rate = ledger.checkRateLimit('tenant-1', 60);
if (rate.allowed) {
  const job = queue.enqueueJob('tenant-1', 'summarize', { text: 'Hello' });
  console.log(job.id);
}
```
