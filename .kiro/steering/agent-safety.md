# Kiro Steering: Agent Safety & Token Governance

1. **Token Quota Checking**:
   * Before launching high-token multi-agent swarms, query `TenantSettings.tokensConsumed` against `TenantSettings.tokenBudgetMonthly`.
   * If budget is exceeded, suspend execution and notify the tenant admin.

2. **Input Sanitization**:
   * Strip system-level prompt overrides or delimiters from user-uploaded PDFs, tickets, or repo files before injecting them into agent context.

3. **Execution Auditing**:
   * Every invocation must persist an immutable `UsageLog` record detailing: `tenantId`, `moduleName`, `tokensUsed`, and `latencyMs`.
