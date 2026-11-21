import { describe, it, expect, beforeEach } from 'vitest';
import { tokenLedgerService } from '../src/lib/services/token-ledger';

describe('TokenLedgerService & Rate Limiting (ARCH-003)', () => {
  it('allows requests within the sliding window limit', () => {
    const tenantId = `test-tenant-${Date.now()}`;
    const result = tokenLedgerService.checkRateLimit(tenantId, 60);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it('blocks requests when exceeding 60 requests per minute', () => {
    const tenantId = `flood-tenant-${Date.now()}`;

    // Exhaust 60 requests
    for (let i = 0; i < 60; i++) {
      const res = tokenLedgerService.checkRateLimit(tenantId, 60);
      expect(res.allowed).toBe(true);
    }

    // 61st request must be denied
    const denied = tokenLedgerService.checkRateLimit(tenantId, 60);
    expect(denied.allowed).toBe(false);
    expect(denied.remaining).toBe(0);
  });

  it('atomically debits tokens when balance is sufficient', () => {
    const tenantId = `budget-tenant-${Date.now()}`;
    const budget = 10000;
    const consumed = 2000;
    const debit = 500;

    const res = tokenLedgerService.debitTokens(tenantId, 'docIntel', debit, consumed, budget);

    expect(res.success).toBe(true);
    expect(res.newConsumed).toBe(2500);
    expect(res.remaining).toBe(7500);
  });

  it('rejects debit and prevents negative balances when exceeding monthly quota', () => {
    const tenantId = `overdraft-tenant-${Date.now()}`;
    const budget = 10000;
    const consumed = 9800;
    const debit = 500;

    const res = tokenLedgerService.debitTokens(tenantId, 'docIntel', debit, consumed, budget);

    expect(res.success).toBe(false);
    expect(res.newConsumed).toBe(9800);
    expect(res.remaining).toBe(200);
    expect(res.error).toContain('budget exceeded');
  });
});
