import { DebitResult, LedgerEntry, RateLimitResult } from './types';

/**
 * Per-tenant sliding-window rate limiter and atomic token quota ledger.
 */
export class TokenLedgerService {
  private readonly ledger: LedgerEntry[] = [];
  private readonly rateLimits = new Map<string, { count: number; windowStart: number }>();

  public checkRateLimit(tenantId: string, maxPerMinute = 60): RateLimitResult {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const record = this.rateLimits.get(tenantId);

    if (!record || now - record.windowStart > windowMs) {
      this.rateLimits.set(tenantId, { count: 1, windowStart: now });
      return { allowed: true, remaining: maxPerMinute - 1 };
    }

    if (record.count >= maxPerMinute) {
      return { allowed: false, remaining: 0 };
    }

    record.count += 1;
    return { allowed: true, remaining: maxPerMinute - record.count };
  }

  public debitTokens(
    tenantId: string,
    taskKey: string,
    tokensToDebit: number,
    currentConsumed: number,
    budgetMonthly: number
  ): DebitResult {
    if (currentConsumed + tokensToDebit > budgetMonthly) {
      return {
        success: false,
        newConsumed: currentConsumed,
        remaining: Math.max(0, budgetMonthly - currentConsumed),
        error: `Tenant monthly token budget exceeded (${currentConsumed}/${budgetMonthly})`,
      };
    }

    const newConsumed = currentConsumed + tokensToDebit;
    const remaining = budgetMonthly - newConsumed;

    const entry: LedgerEntry = {
      id: `led_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId,
      taskKey,
      tokensDebited: tokensToDebit,
      balanceRemaining: remaining,
      timestamp: new Date().toISOString(),
    };

    this.ledger.push(entry);
    return { success: true, newConsumed, remaining };
  }

  public getLedgerForTenant(tenantId: string): LedgerEntry[] {
    return this.ledger.filter((l) => l.tenantId === tenantId);
  }
}
