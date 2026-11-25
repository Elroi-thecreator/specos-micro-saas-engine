import { describe, it, expect } from 'vitest';
import {
  AgentJob,
  AgentQueueService,
  HybridAgentRuntime,
  JobStore,
  TokenLedgerService,
} from '@specos/agent-kit';

describe('@specos/agent-kit package', () => {
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

  it('supports custom JobStore in AgentQueueService', async () => {
    const backing = new Map<string, AgentJob>();
    const customStore: JobStore = {
      get: (id) => backing.get(id) || null,
      set: (id, job) => backing.set(id, job),
      listByTenant: (slug) => Array.from(backing.values()).filter((j) => j.tenantSlug === slug),
    };

    const runtime = new HybridAgentRuntime({ apiKey: '' });
    runtime.registerTask('ping', {
      buildPrompt: () => ({ systemInstruction: 'Return JSON', prompt: 'ping' }),
      fallback: () => ({ result: { pong: true }, tokens: 10 }),
    });

    const queue = new AgentQueueService({
      runtime,
      store: customStore,
      dispatchDelayMs: 10,
    });

    const job = queue.enqueueJob('tenant-a', 'ping', { hello: 'world' });
    expect(job.status).toBe('QUEUED');

    await new Promise((r) => setTimeout(r, 60));

    const completed = queue.getJob(job.id);
    expect(completed?.status).toBe('COMPLETED');
    expect(completed?.resultPayload).toEqual({ pong: true });
    expect(queue.listJobsForTenant('tenant-a')).toHaveLength(1);
  });

  it('enforces per-tenant rate limits and token quotas via TokenLedgerService', () => {
    const ledger = new TokenLedgerService();

    expect(ledger.checkRateLimit('t1', 2)).toEqual({ allowed: true, remaining: 1 });
    expect(ledger.checkRateLimit('t1', 2)).toEqual({ allowed: true, remaining: 0 });
    expect(ledger.checkRateLimit('t1', 2)).toEqual({ allowed: false, remaining: 0 });

    const ok = ledger.debitTokens('t1', 'ping', 100, 400, 1000);
    expect(ok.success).toBe(true);
    expect(ok.newConsumed).toBe(500);
    expect(ledger.getLedgerForTenant('t1')).toHaveLength(1);

    const fail = ledger.debitTokens('t1', 'ping', 600, 500, 1000);
    expect(fail.success).toBe(false);
    expect(fail.remaining).toBe(500);
  });
});
