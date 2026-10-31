export interface LedgerEntry {
  id: string;
  tenantId: string;
  moduleKey: string;
  tokensDebited: number;
  balanceRemaining: number;
  timestamp: string;
}

class TokenLedgerService {
  private ledger: LedgerEntry[] = [];
  private rateLimits: Map<string, { count: number; windowStart: number }> = new Map();

  // Sliding window rate limiter: Max 60 requests per minute per tenant
  public checkRateLimit(tenantId: string, maxPerMinute: number = 60): { allowed: boolean; remaining: number } {
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

  // Atomic token balance check & debit
  public debitTokens(
    tenantId: string,
    moduleKey: string,
    tokensToDebit: number,
    currentConsumed: number,
    budgetMonthly: number
  ): { success: boolean; newConsumed: number; remaining: number; error?: string } {
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
      moduleKey,
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

export const tokenLedgerService = new TokenLedgerService();
