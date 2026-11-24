# AGENTS.md: Universal Multi-Agent Directives & Operating Standards

> **Project:** SpecOS &bull; Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine  
> **Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)  
> **Production Live URL:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)  
> **Track Alignment:** Kiroween 2026 (*Skeleton Crew*, *Best Kiro Crew App*, *Best Startup Project*)

---

## 🤖 Role & Mission
You are an autonomous AI software engineer pair programming on the **SpecOS** codebase. Your goal is to maintain the highest enterprise standards of multi-tenant isolation, architectural modularity, asynchronous scalability, internationalization, and visual elegance.

---

## 🚨 Non-Negotiable Operational Rules

### 1. Mandatory Knowledge Base Protocol (Sparse Retrieval - DEV-005)
Before designing, planning, or modifying any code or configuration:
1. **Pre-Change Sparse Inspection:** Check `knowledge/index.yaml` (~450 tokens) to identify which architecture (`ARCH-*`), development (`DEV-*`), or product (`PROD-*`) standards apply.
2. **Load Targeted Units Only:** Read **ONLY** the specific YAML unit(s) needed for the active task (e.g., `knowledge/architecture/ARCH-001-multi-tenant-isolation.yaml`, ~300 tokens). **NEVER** bulk-load `knowledge/INJECTION.md` (~3,800 tokens) into active prompt context for routine tasks.
3. **Post-Change Synchronization:** Whenever changes are made (routes, schemas, UI, services), immediately update the relevant knowledge units in `knowledge/`.
4. If a new architectural pattern or rule is introduced, create a new knowledge document following the standard schema (`id`, `type`, `title`, `domain`, `status`, `version`, `rule`, `do`, `dont`, `reason`, `related_items`), update `knowledge/index.yaml`, and sync `knowledge/INJECTION.md`.

### 2. Kiro Ecosystem Integrity (`.kiro/`)
* Directory `/.kiro` **MUST NEVER** be added to `.gitignore`.
* Keep `.kiro/specs/specos/tasks.md` synchronized whenever completing features.
* Strictly enforce steering rules in `.kiro/steering/tenancy-isolation.md`, `.kiro/steering/i18n-standards.md`, and `.kiro/steering/agent-safety.md`.

### 3. Tenant Boundary Isolation (`ARCH-001`)
* Every data query, mutation, AI agent prompt, and token debit **MUST** be explicitly scoped to a valid `tenantId` / `tenantSlug`.
* Cross-tenant data leakage is considered a critical security vulnerability.

### 4. Edge Middleware & Worker Scalability (`ARCH-003`)
* Never perform unbounded, synchronous LLM inference inside standard HTTP handlers.
* Always dispatch tasks to `agentQueueService` returning `202 Accepted` with a verifiable `jobId` (`job_*`) and status polling endpoint `/api/v1/w/[slug]/agent/jobs/[jobId]`.
* Always debit tokens through `tokenLedgerService` with atomic verification against monthly quotas.
* Enforce edge rate limiting (60 requests/minute per tenant IP).

### 5. Internationalization & Right-to-Left (RTL) Standards (`DEV-001`)
* SpecOS supports 7 locales: English (`en`), Spanish (`es`), French (`fr`), German (`de`), Japanese (`ja`), Hindi (`hi`), Arabic (`ar`).
* Arabic **MUST** automatically activate `dir="rtl"` layout.
* Never hardcode user-facing copy; always use `src/lib/i18n/translations.ts`.
* Localize agent risk summaries and responses to match the active tenant's operating language.

### 6. Enterprise-Grade Light Design System (`DEV-002`)
* Strictly adhere to the clean Light Theme (Stripe/Linear aesthetic):
  * Outer background: `#f8fafc` (slate-50)
  * Card backgrounds: `#ffffff` (white)
  * Borders & dividers: `#e2e8f0` (slate-200)
  * Headings: `#020617` / `#0f172a` (slate-950/slate-900)
* Never deploy dark backgrounds as the primary workspace theme.

---

## 🛠️ Verification Runbook
```bash
npm run build
npm test
git status
```
