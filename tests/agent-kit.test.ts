import { describe, it, expect } from 'vitest';
import {
  AgentJob,
  AgentQueueService,
  HybridAgentRuntime,
  JobStore,
  TokenLedgerService,
} from 'specos-agent-kit';

describe('specos-agent-kit package', () => {
  it('supports registering and executing custom pluggable tasks with fallback', async () => {
    const runtime = new HybridAgentRuntime({ apiKey: '' });
    runtime.registerTask<{ text: string }, { summary: string }>('customSummarize', {
      buildPrompt: (ctx) => ({
        systemInstruction: `Summarize for ${ctx.tenantName}`,
        prompt: ctx.payload.text,
      }),
      fallback: (ctx) => ({
        result: { summary: `Offline summary (${ctx.locale}): ${ctx.payload.text}` },
        tokens: 120,
      }),
    });

    expect(runtime.hasTask('customSummarize')).toBe(true);

    const res = await runtime.execute({
      taskKey: 'customSummarize',
      tenantSlug: 'acme',
      tenantName: 'Acme Corp',
      locale: 'fr',
      payload: { text: 'Contract clause' },
    });

    expect(res.isLive).toBe(false);
    expect(res.tokensUsed).toBe(120);
    expect(res.resultPayload.summary).toBe('Offline summary (fr): Contract clause');
  });

  it('throws when executing an unregistered taskKey', async () => {
    const runtime = new HybridAgentRuntime({ apiKey: '' });
    await expect(
      runtime.execute({
        taskKey: 'missingTask',
        tenantSlug: 'acme',
        payload: {},
      })
    ).rejects.toThrow("No agent task handler registered for taskKey 'missingTask'");
  });

  it('supports async JobStore in AgentQueueService with bounded concurrency and retries', async () => {
    const backing = new Map<string, AgentJob>();
    const asyncStore: JobStore = {
      get: async (id) => backing.get(id) || null,
      set: async (id, job) => {
        backing.set(id, { ...job });
      },
      listByTenant: async (slug) =>
        Array.from(backing.values()).filter((j) => j.tenantSlug === slug),
    };

    const runtime = new HybridAgentRuntime({ apiKey: '' });
    let callCount = 0;
    runtime.registerTask('flaky', {
      buildPrompt: () => ({ systemInstruction: 'Return JSON', prompt: 'flaky' }),
      fallback: () => {
        callCount += 1;
        if (callCount === 1) {
          throw new Error('Transient error');
        }
        return { result: { ok: true, attempt: callCount }, tokens: 10 };
      },
    });

    const queue = new AgentQueueService({
      runtime,
      store: asyncStore,
      dispatchDelayMs: 10,
      concurrency: 2,
      maxRetries: 2,
      retryBaseDelayMs: 15,
    });

    const job = await queue.enqueueJob('tenant-a', 'flaky', { hello: 'world' });
    expect(job.status).toBe('QUEUED');

    await new Promise((r) => setTimeout(r, 120));

    const completed = await queue.getJob(job.id);
    expect(completed?.status).toBe('COMPLETED');
    expect(completed?.attempts).toBe(2);
    expect(completed?.resultPayload).toEqual({ ok: true, attempt: 2 });
    expect(await queue.listJobsForTenant('tenant-a')).toHaveLength(1);
  });

  it('enforces true sliding-window rate limiting and bounded token ledger', async () => {
    const ledger = new TokenLedgerService({ windowMs: 1000, maxLedgerEntries: 2 });

    // 2 requests at t=100 and t=600 -> limit 2 reached
    expect((await ledger.checkRateLimit('t1', 2, 100)).allowed).toBe(true);
    expect((await ledger.checkRateLimit('t1', 2, 600)).allowed).toBe(true);
    expect((await ledger.checkRateLimit('t1', 2, 900)).allowed).toBe(false);

    // At t=1150, t=100 has slid out of the 1000ms window while t=600 remains
    const slid = await ledger.checkRateLimit('t1', 2, 1150);
    expect(slid.allowed).toBe(true);
    expect(slid.remaining).toBe(0);

    // Bounded ledger evicts oldest when maxLedgerEntries=2
    await ledger.debitTokens('t1', 'ping', 100, 0, 1000);
    await ledger.debitTokens('t1', 'ping', 100, 100, 1000);
    await ledger.debitTokens('t1', 'ping', 100, 200, 1000);
    expect(await ledger.getLedgerForTenant('t1')).toHaveLength(2);
  });

  it('supports pluggable async RateLimitStore and LedgerStore', async () => {
    const entries: any[] = [];
    const ledger = new TokenLedgerService({
      rateLimitStore: {
        checkAndRecord: async (_id, max) => ({
          allowed: true,
          remaining: max - 1,
          resetAtMs: Date.now() + 60000,
        }),
      },
      ledgerStore: {
        append: async (entry) => {
          entries.push(entry);
        },
        listByTenant: async (tenantId) => entries.filter((e) => e.tenantId === tenantId),
      },
    });

    const rate = await ledger.checkRateLimit('remote-tenant', 10);
    expect(rate.allowed).toBe(true);
    await ledger.debitTokens('remote-tenant', 'ping', 50, 0, 500);
    expect(await ledger.getLedgerForTenant('remote-tenant')).toHaveLength(1);
  });
});
