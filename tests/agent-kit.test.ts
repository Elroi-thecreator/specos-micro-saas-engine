import { describe, it, expect } from 'vitest';
import {
  AgentJob,
  AgentOrchestrator,
  AgentQueueService,
  HybridAgentRuntime,
  JobStatus,
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

  it('rejects immediately when AbortSignal is already aborted or taskKey is missing', async () => {
    const runtime = new HybridAgentRuntime({ apiKey: '' });
    const controller = new AbortController();
    controller.abort();

    await expect(
      runtime.execute({
        taskKey: 'missingTask',
        tenantSlug: 'acme',
        payload: {},
        signal: controller.signal,
      })
    ).rejects.toThrow('Agent execution aborted');

    await expect(
      runtime.execute({
        taskKey: 'missingTask',
        tenantSlug: 'acme',
        payload: {},
      })
    ).rejects.toThrow("No agent task handler registered for taskKey 'missingTask'");
  });

  it('supports async JobStore, retries, lifecycle hooks, and crash recovery', async () => {
    const backing = new Map<string, AgentJob>();
    const asyncStore: JobStore = {
      get: async (id) => backing.get(id) || null,
      set: async (id, job) => {
        backing.set(id, { ...job });
      },
      listByTenant: async (slug) =>
        Array.from(backing.values()).filter((j) => j.tenantSlug === slug),
      listByStatus: async (status: JobStatus) =>
        Array.from(backing.values()).filter((j) => j.status === status),
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

    const completedIds: string[] = [];
    const queue = new AgentQueueService({
      runtime,
      store: asyncStore,
      dispatchDelayMs: 10,
      concurrency: 2,
      maxRetries: 2,
      retryBaseDelayMs: 15,
      onJobCompleted: (job) => {
        completedIds.push(job.id);
      },
    });

    const job = await queue.enqueueJob('tenant-a', 'flaky', { hello: 'world' });
    expect(job.status).toBe('QUEUED');

    await new Promise((r) => setTimeout(r, 120));

    const completed = await queue.getJob(job.id);
    expect(completed?.status).toBe('COMPLETED');
    expect(completed?.attempts).toBe(2);
    expect(completed?.resultPayload).toEqual({ ok: true, attempt: 2 });
    expect(completedIds).toContain(job.id);
    expect(await queue.listJobsForTenant('tenant-a')).toHaveLength(1);

    // Simulate stranded QUEUED job left in external store after process restart
    backing.set('job_stranded_1', {
      id: 'job_stranded_1',
      tenantSlug: 'tenant-a',
      taskKey: 'flaky',
      status: 'QUEUED',
      attempts: 0,
      inputPayload: {},
      resultPayload: null,
      tokensUsed: 0,
      latencyMs: 0,
      createdAt: new Date().toISOString(),
    });

    const recoveredCount = await queue.recoverJobs();
    expect(recoveredCount).toBe(1);
    await new Promise((r) => setTimeout(r, 80));
    expect((await queue.getJob('job_stranded_1'))?.status).toBe('COMPLETED');
  });

  it('enforces true sliding-window rate limiting, maxPerWindow<=0 guard, and atomic ledger', async () => {
    const ledger = new TokenLedgerService({ windowMs: 1000, maxLedgerEntries: 2 });

    // Guard against maxPerWindow <= 0 (must not return NaN resetAtMs)
    const zeroLimit = await ledger.checkRateLimit('t0', 0, 500);
    expect(zeroLimit.allowed).toBe(false);
    expect(Number.isNaN(zeroLimit.resetAtMs)).toBe(false);

    // 2 requests at t=100 and t=600 -> limit 2 reached
    expect((await ledger.checkRateLimit('t1', 2, 100)).allowed).toBe(true);
    expect((await ledger.checkRateLimit('t1', 2, 600)).allowed).toBe(true);
    expect((await ledger.checkRateLimit('t1', 2, 900)).allowed).toBe(false);

    // At t=1150, t=100 has slid out of the 1000ms window while t=600 remains
    const slid = await ledger.checkRateLimit('t1', 2, 1150);
    expect(slid.allowed).toBe(true);
    expect(slid.remaining).toBe(0);

    // Atomic debit enforces budget inside the store and evicts oldest beyond maxLedgerEntries=2
    expect((await ledger.debitTokens('t1', 'ping', 400, 1000)).newConsumed).toBe(400);
    expect((await ledger.debitTokens('t1', 'ping', 400, 1000)).newConsumed).toBe(800);
    expect((await ledger.debitTokens('t1', 'ping', 300, 1000)).success).toBe(false);
    expect((await ledger.debitTokens('t1', 'ping', 200, 1000)).newConsumed).toBe(1000);
    expect(await ledger.getConsumed('t1')).toBe(1000);
    expect(await ledger.getLedgerForTenant('t1')).toHaveLength(2);
  });

  it('wires rate-limit -> atomic debit -> enqueue via AgentOrchestrator', async () => {
    const runtime = new HybridAgentRuntime({ apiKey: '' });
    runtime.registerTask('echo', {
      buildPrompt: () => ({ systemInstruction: 'Echo', prompt: 'Echo' }),
      fallback: (ctx) => ({ result: ctx.payload, tokens: 50 }),
    });

    const queue = new AgentQueueService({ runtime, dispatchDelayMs: 5 });
    const ledger = new TokenLedgerService();
    const orchestrator = new AgentOrchestrator({ ledger, queue });

    const ok = await orchestrator.dispatch({
      tenantId: 't-orch',
      tenantSlug: 'orch',
      taskKey: 'echo',
      payload: { msg: 'hi' },
      estimatedTokens: 300,
      budgetMonthly: 500,
      maxPerWindow: 2,
    });
    expect(ok.accepted).toBe(true);

    const overBudget = await orchestrator.dispatch({
      tenantId: 't-orch',
      tenantSlug: 'orch',
      taskKey: 'echo',
      payload: { msg: 'hi2' },
      estimatedTokens: 300,
      budgetMonthly: 500,
      maxPerWindow: 2,
    });
    expect(overBudget.accepted).toBe(false);
    if (!overBudget.accepted) {
      expect(overBudget.reason).toBe('BUDGET_EXCEEDED');
    }

    const rateLimited = await orchestrator.dispatch({
      tenantId: 't-orch',
      tenantSlug: 'orch',
      taskKey: 'echo',
      payload: { msg: 'hi3' },
      estimatedTokens: 100,
      budgetMonthly: 500,
      maxPerWindow: 2,
    });
    expect(rateLimited.accepted).toBe(false);
    if (!rateLimited.accepted) {
      expect(rateLimited.reason).toBe('RATE_LIMITED');
    }
  });
});
