import { DebitResult, LedgerEntry, LedgerStore, RateLimitResult, RateLimitStore } from './types';

export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly requestLogs = new Map<string, number[]>();

  public checkAndRecord(
    tenantId: string,
    maxPerWindow: number,
    windowMs: number,
    now: number
  ): RateLimitResult {
    const windowStart = now - windowMs;
    const timestamps = this.requestLogs.get(tenantId) || [];
    const active = timestamps.filter((ts) => ts > windowStart);

    if (active.length >= maxPerWindow) {
      this.requestLogs.set(tenantId, active);
      return {
        allowed: false,
        remaining: 0,
        resetAtMs: active[0] + windowMs,
      };
    }

    active.push(now);
    this.requestLogs.set(tenantId, active);

    return {
      allowed: true,
      remaining: maxPerWindow - active.length,
      resetAtMs: active[0] + windowMs,
    };
  }
}

export class InMemoryLedgerStore implements LedgerStore {
  private readonly entries: LedgerEntry[] = [];
  private readonly maxEntries: number;

  constructor(maxEntries = 10000) {
    this.maxEntries = Math.max(1, maxEntries);
  }

  public append(entry: LedgerEntry): void {
    if (this.entries.length >= this.maxEntries) {
      this.entries.shift();
    }
    this.entries.push(entry);
  }

  public listByTenant(tenantId: string): LedgerEntry[] {
    return this.entries.filter((e) => e.tenantId === tenantId);
  }
}

export interface TokenLedgerServiceOptions {
  windowMs?: number;
  maxLedgerEntries?: number;
  rateLimitStore?: RateLimitStore;
  ledgerStore?: LedgerStore;
}

/**
 * Per-tenant true sliding-window rate limiter and atomic token quota ledger
 * with pluggable async-capable RateLimitStore and LedgerStore interfaces.
 */
export class TokenLedgerService {
  private readonly rateLimitStore: RateLimitStore;
  private readonly ledgerStore: LedgerStore;
  private readonly windowMs: number;

  constructor(options: TokenLedgerServiceOptions = {}) {
    this.windowMs = options.windowMs ?? 60 * 1000;
    this.rateLimitStore = options.rateLimitStore || new InMemoryRateLimitStore();
    this.ledgerStore =
      options.ledgerStore || new InMemoryLedgerStore(options.maxLedgerEntries ?? 10000);
  }

  public async checkRateLimit(
    tenantId: string,
    maxPerWindow = 60,
    now = Date.now()
  ): Promise<RateLimitResult> {
    return this.rateLimitStore.checkAndRecord(tenantId, maxPerWindow, this.windowMs, now);
  }

  public async debitTokens(
    tenantId: string,
    taskKey: string,
    tokensToDebit: number,
    currentConsumed: number,
    budgetMonthly: number
  ): Promise<DebitResult> {
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

    await this.ledgerStore.append(entry);

    return { success: true, newConsumed, remaining };
  }

  public async getLedgerForTenant(tenantId: string): Promise<LedgerEntry[]> {
    return this.ledgerStore.listByTenant(tenantId);
  }
}
