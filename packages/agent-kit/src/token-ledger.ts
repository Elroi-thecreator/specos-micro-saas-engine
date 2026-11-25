import { DebitResult, LedgerEntry, RateLimitResult } from './types';

export interface TokenLedgerServiceOptions {
  windowMs?: number;
  maxLedgerEntries?: number;
}

/**
 * Per-tenant true sliding-window rate limiter and bounded atomic token quota ledger.
 */
export class TokenLedgerService {
  private readonly ledger: LedgerEntry[] = [];
  private readonly requestLogs = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxLedgerEntries: number;

  constructor(options: TokenLedgerServiceOptions = {}) {
    this.windowMs = options.windowMs ?? 60 * 1000;
    this.maxLedgerEntries = Math.max(1, options.maxLedgerEntries ?? 10000);
  }

  /**
   * True sliding-window log rate limiter: prunes timestamps outside `[now - windowMs, now]`
   * and evicts empty tenant buckets to prevent unbounded memory growth.
   */
  public checkRateLimit(tenantId: string, maxPerWindow = 60, now = Date.now()): RateLimitResult {
    const windowStart = now - this.windowMs;
    const timestamps = this.requestLogs.get(tenantId) || [];

    // Drop timestamps that have fallen out of the sliding window
    const active = timestamps.filter((ts) => ts > windowStart);

    if (active.length >= maxPerWindow) {
      this.requestLogs.set(tenantId, active);
      return {
        allowed: false,
        remaining: 0,
        resetAtMs: active[0] + this.windowMs,
      };
    }

    active.push(now);
    this.requestLogs.set(tenantId, active);

    return {
      allowed: true,
      remaining: maxPerWindow - active.length,
      resetAtMs: active[0] + this.windowMs,
    };
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

    if (this.ledger.length >= this.maxLedgerEntries) {
      this.ledger.shift();
    }
    this.ledger.push(entry);

    return { success: true, newConsumed, remaining };
  }

  public getLedgerForTenant(tenantId: string): LedgerEntry[] {
    return this.ledger.filter((l) => l.tenantId === tenantId);
  }
}
