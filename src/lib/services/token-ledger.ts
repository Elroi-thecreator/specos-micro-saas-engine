import { TokenLedgerService } from '@specos/agent-kit';

export type { LedgerEntry, RateLimitResult, DebitResult } from '@specos/agent-kit';
export { TokenLedgerService };

export const tokenLedgerService = new TokenLedgerService();
