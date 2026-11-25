import { describe, it, expect } from 'vitest';
import { geminiAgentService } from '../src/lib/services/gemini-agent-service';
import { agentQueueService } from '../src/lib/services/agent-queue';

describe('Gemini Agent Service & Worker Queue (ARCH-002, ARCH-003, DEV-001)', () => {
  it('executes docIntel with localized fallback when no API key is provided', async () => {
    const result = await geminiAgentService.execute({
      moduleKey: 'docIntel',
      tenantSlug: 'lexis-legal',
      tenantName: 'LexisAI Legal Suite',
      locale: 'ja',
      payload: {
        title: '国際業務提携契約書 (Cross-Border Alliance SLA)',
      },
      sensitivity: 'Strict',
    });

    expect(result.tokensUsed).toBeGreaterThan(0);
    expect(result.resultPayload).toBeDefined();
    expect(result.resultPayload.riskLevel).toBe('Critical');
    expect(result.resultPayload.summary).toContain('自律型法務監査が完了しました');
    expect(Array.isArray(result.resultPayload.clauses)).toBe(true);
  });

  it('executes supportSwarm with localized Spanish response', async () => {
    const result = await geminiAgentService.execute({
      moduleKey: 'supportSwarm',
      tenantSlug: 'atencion-global',
      tenantName: 'AtenciónGlobal Support',
      locale: 'es',
      payload: {
        customerName: 'Banco Bilbao Vizcaya',
        subject: 'Fallo crítico en sincronización de pagos',
      },
    });

    expect(result.resultPayload.sentiment).toBe('Urgent');
    expect(result.resultPayload.draftReply).toContain('AtenciónGlobal Support');
    expect(result.resultPayload.draftReply).toContain('Banco Bilbao Vizcaya');
  });

  it('executes codeAudit and checks compliance against ARCH-001 and ARCH-002', async () => {
    const result = await geminiAgentService.execute({
      moduleKey: 'codeAudit',
      tenantSlug: 'devshield-ops',
      tenantName: 'DevShield Sentinel',
      locale: 'en',
      payload: {
        repo: 'specos/core-runtime',
        branch: 'feature/tenant-isolation',
      },
    });

    expect(result.resultPayload.score).toBeGreaterThanOrEqual(90);
    expect(result.resultPayload.violations).toBe(0);
    expect(result.resultPayload.findings.some((f: any) => f.ruleId === 'ARCH-001')).toBe(true);
  });

  it('enqueues and processes asynchronous agent jobs via worker queue', async () => {
    const job = await agentQueueService.enqueueJob('lexis-legal', 'docIntel', { title: 'Test SLA' }, {
      tenantName: 'LexisAI',
      locale: 'en',
    });

    expect(job.id).toMatch(/^job_/);
    expect(job.status).toBe('QUEUED');

    // Wait for worker processing
    await new Promise((resolve) => setTimeout(resolve, 150));

    const finishedJob = await agentQueueService.getJob(job.id);
    expect(finishedJob?.status).toBe('COMPLETED');
    expect(finishedJob?.resultPayload).toBeDefined();
    expect(finishedJob?.tokensUsed).toBeGreaterThan(0);
  });
});
