# GitHub Copilot Instructions

## Project: SpecOS &bull; Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine

### Mandatory Knowledge Base Protocol (DEV-005 Sparse Retrieval)
1. Always inspect `knowledge/index.yaml` first to identify active architecture, development, or product standards.
2. Read ONLY the specific relevant YAML file in `knowledge/` (e.g. `knowledge/architecture/ARCH-001-multi-tenant-isolation.yaml`). Do NOT bulk-load `knowledge/INJECTION.md` into prompt context.
3. Maintain post-change synchronization: update relevant knowledge units in `knowledge/` whenever making architectural or feature changes.

### Core Architectural Directives
- **Tenant Isolation (ARCH-001):** Enforce `tenant_id` scoping on all queries, state mutations, and AI worker tasks.
- **Asynchronous Execution (ARCH-003):** Dispatch long-running agent tasks via `agentQueueService` with verifiable job IDs (`job_*`).
- **i18n & RTL (DEV-001):** Zero hardcoded user-facing strings; use `src/lib/i18n/translations.ts` across 7 locales (`en`, `es`, `fr`, `de`, `ja`, `hi`, `ar`).
- **Design System (DEV-002):** Enterprise light theme with Tailwind CSS (slate-50 background, white cards, slate-200 borders).
- **Automated QA (DEV-004):** Run `npm test` (Vitest) and `npm run build` to verify changes.
