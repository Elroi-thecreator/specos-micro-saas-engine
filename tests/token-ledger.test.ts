import { describe, it, expect } from 'vitest';
import { tokenLedgerService } from '../src/lib/services/token-ledger';

describe('TokenLedgerService & Rate Limiting (ARCH-003)', () => {
  it('allows requests within the sliding window limit', async () => {
    const tenantId = `test-tenant-${Date.now()}`;
    const result = await tokenLedgerService.checkRateLimit(tenantId, 60);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it('blocks requests when exceeding 60 requests per minute', async () => {
    const tenantId = `flood-tenant-${Date.now()}`;

    // Exhaust 60 requests
    for (let i = 0; i < 60; i++) {
      const res = await tokenLedgerService.checkRateLimit(tenantId, 60);
      expect(res.allowed).toBe(true);
    }

    // 61st request must be denied
    const denied = await tokenLedgerService.checkRateLimit(tenantId, 60);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  it('atomically debits tokens when balance is sufficient', async () => {
    const tenantId = `budget-tenant-${Date.now()}`;
    const budget = 10000;

    await tokenLedgerService.debitTokens(tenantId, 'docIntel', 2000, budget);
    const res = await tokenLedgerService.debitTokens(tenantId, 'docIntel', 500, budget);

    expect(res.success).toBe(true);
    expect(res.newConsumed).toBe(2500);
    expect(res.remaining).toBe(7500);
  });

  it('rejects debit and prevents negative balances when exceeding monthly quota', async () => {
    const tenantId = `overdraft-tenant-${Date.now()}`;
    const budget = 10000;

    await tokenLedgerService.debitTokens(tenantId, 'docIntel', 9800, budget);
    const res = await tokenLedgerService.debitTokens(tenantId, 'docIntel', 500, budget);

    expect(res.success).toBe(false);
    expect(res.newConsumed).toBe(9800);
    expect(res.remaining).toBe(200);
    expect(res.error).toContain('budget exceeded');
  });
});
