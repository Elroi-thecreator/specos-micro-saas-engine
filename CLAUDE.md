# CLAUDE.md: Claude Code Workspace Instructions

> **Project:** SpecOS &bull; Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine  
> **Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)  
> **Production Live URL:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)

---

## ⚡ Mandatory Knowledge Base Protocol (Sparse Retrieval - DEV-005)
Before planning or modifying any code or configuration:
1. **Step 1 (Pre-Change Sparse Inspection):** Read `knowledge/index.yaml` (~450 tokens) to identify which standards apply to the current task.
2. **Step 2 (Load Only Target Unit):** Read **ONLY** the specific relevant YAML unit from `knowledge/` (e.g. `knowledge/architecture/ARCH-001-multi-tenant-isolation.yaml`). Do **NOT** bulk-read `knowledge/INJECTION.md` unless performing an initial system bootstrap, saving thousands of tokens per conversation.
3. **Step 3 (Post-Change Synchronization):** Whenever changes are made (routes, schemas, UI, or services), update the corresponding YAML unit in `knowledge/`, increment `knowledge_units_count` or update `last_updated` in `knowledge/index.yaml`, and re-sync `knowledge/INJECTION.md`.

---

## 🏛️ Core Architectural Standards
* **Tenant Isolation (`ARCH-001`):** Every database query, state mutation, and AI worker task MUST include explicit `tenant_id` scoping. Zero cross-tenant data leakage.
* **Modular Swarms (`ARCH-002`):** Capabilities (`docIntel`, `supportSwarm`, `codeAudit`) are dynamically toggleable per tenant.
* **Decoupled Worker Queue (`ARCH-003`):** Async jobs return `202 Accepted` with verifiable `jobId` (`job_*`). Rate limits: 60 req/min per IP.
* **Hybrid AI Runtime (`ARCH-004`):** Live Gemini API integration with intelligent contextual fallback.
* **i18n & RTL (`DEV-001`):** Zero hardcoded strings. Localized prompt pipelines across 7 locales (`en`, `es`, `fr`, `de`, `ja`, `hi`, `ar` with RTL).
* **Enterprise Light Design (`DEV-002`):** Crisp slate-50/white aesthetic with high-contrast slate typography.
* **Continuous Testing (`DEV-004`):** Maintain comprehensive unit/integration test coverage with Vitest.

---

## 🛠️ Build & Test Commands
```bash
npm run build      # Verify Next.js production compilation
npm test           # Run Vitest test suite (all 20 tests must pass)
npm run lint       # Run Next.js ESLint
```
