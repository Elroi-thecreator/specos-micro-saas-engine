# Kiro Steering: Multi-Tenant Isolation Directives

All Kiro agents operating in this codebase MUST strictly adhere to the following rules:

1. **Mandatory Tenant Scoping**:
   * Every database call (Prisma/Drizzle/SQL) MUST include the active `tenant_id` constraint.
   * Never execute an unconstrained `findMany` or `deleteMany` on tenant-scoped tables.

2. **No Cross-Tenant Data Contamination**:
   * Vector stores, cache keys, and file storage MUST prefix keys with `tenant:${tenantId}:...`.
   * Agents may not reference memory or execution artifacts from any other tenant.

3. **Feature Gate Enforcement**:
   * Before executing an agent workflow for a module (Doc Intel, Support Swarm, Code Audit), the agent MUST verify that the module is enabled in `tenant.settings.enabledModules`.
