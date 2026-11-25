import { TokenLedgerService } from 'specos-agent-kit';

export type {
  DebitResult,
  LedgerEntry,
  LedgerStore,
  RateLimitResult,
  RateLimitStore,
} from 'specos-agent-kit';
export { InMemoryLedgerStore, InMemoryRateLimitStore, TokenLedgerService } from 'specos-agent-kit';

export const tokenLedgerService = new TokenLedgerService();
