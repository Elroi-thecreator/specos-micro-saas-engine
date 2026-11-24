# SpecOS Knowledge Base Injection (Unified Machine Context)

> **Auto-Generated & Standardized Context Injection File**  
> **Last Synchronized:** 2026-11-24  
> **Active Knowledge Units Count:** 12  
> **Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)  
> **Live Production:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)

---

## 🧭 System Purpose & Architectural Philosophy
SpecOS is an autonomous, multi-tenant B2B Micro-SaaS operating system and modular AI swarm runtime. It proves that a single, adaptable skeleton core can dynamically morph into completely distinct vertical SaaS applications (Legal AI in Japanese, Customer Support Swarm in Spanish, DevSecOps Compliance in English, or Full Enterprise Suite) through dynamic feature gates, separated admin centers, and a centralized Super Admin control plane.

Any autonomous agent, language model, or developer modifying or extending this codebase **MUST** strictly adhere to the following approved knowledge units.

---

## 🏛️ Domain 1: Architecture Standards

### Unit ARCH-001: Multi-Tenant Data & Workspace Isolation
* **ID:** `ARCH-001` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  All application queries, mutations, agent execution contexts, document stores, and audit logs **MUST** be strictly scoped to a valid `tenant_id`. Cross-tenant data leakage is strictly prohibited.
* **Do:**
  * Enforce `tenant_id` foreign keys on every tenant-scoped entity in database schemas.
  * Automatically inject tenant isolation filters at the ORM/database middleware layer.
  * Resolve tenant context early in the request lifecycle via edge middleware (`/w/[slug]` or `/api/v1/w/[slug]`).
  * Scope all LLM token consumption and background tasks to the active tenant's budget ledger.
* **Don't:**
  * Never execute global database queries without an explicit `tenant_id` filter.
  * Never store tenant files or documents in unpartitioned global directories.
  * Never allow one tenant to query or trigger agents belonging to another tenant.
* **Reason:** In a multi-tenant SaaS architecture, data privacy, compliance, and tenant security are paramount. A leak between tenants represents a critical vulnerability.

---

### Unit ARCH-002: Modular Agent Capabilities & Configuration Engine
* **ID:** `ARCH-002` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  All autonomous capabilities (Legal Document Analysis, Customer Support Swarm, Code & Specs Auditor) **MUST** be registered as loosely-coupled feature modules. Workspaces can toggle any module on or off at runtime without server downtime or code refactoring.
* **Do:**
  * Define feature gates inside `tenant.settings.modules` (`docIntel`, `supportSwarm`, `codeAudit`).
  * Check module activation in routing middleware, UI navigation sidebars, and API handlers.
  * Dynamically hide navigation links, routes, and background jobs for disabled modules.
  * Provide modular fallback states and 1-click industry demo presets.
* **Don't:**
  * Never hardcode AI agent pipelines directly into global UI layouts.
  * Never allow an API route or worker job to execute for a disabled module.
* **Reason:** Provides the core "Skeleton Crew" hackathon capability: one unified skeleton that dynamically morphs into vertical SaaS applications.

---

### Unit ARCH-003: High-Scale Multi-Tenant Data & Worker Architecture
* **ID:** `ARCH-003` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  The application **MUST** maintain horizontal scalability across thousands of concurrent tenants:
  1. Edge middleware **MUST** resolve tenant context and enforce rate limits before routing to handlers.
  2. Database queries **MUST** enforce tenant partitioning with composite indices on `(tenant_id, created_at)`.
  3. Long-running AI agent tasks **MUST** execute asynchronously via worker job queues rather than blocking web request threads.
  4. Token consumption **MUST** be tracked atomically via ledger transactions to prevent race-condition quota overruns.
* **Do:**
  * Enforce tenant verification and header injection (`x-tenant-slug`, `x-request-id`) at the edge middleware layer (`src/middleware.ts`).
  * Structure API routes under `/api/v1/w/[slug]/...` with strict validation and error boundaries.
  * Implement an atomic token ledger (`tokenLedgerService`) that validates balances before agent execution.
  * Provide asynchronous agent task dispatch (`agentQueueService`) returning `202 Accepted` with verifiable job IDs and status polling endpoints.
  * Design database schema (`prisma/schema.prisma`) with foreign keys, cascade rules, and composite indexes.
* **Don't:**
  * Never run unbounded LLM inference directly in synchronous HTTP requests without timeouts or job tracking.
  * Never allow tenant queries to perform full table scans across multiple tenants.
  * Never store tenant state exclusively in client-side memory.
* **Reason:** Ensures the platform can scale from 1 tenant to 100,000+ tenants with enterprise reliability, preventing noisy-neighbor starvation, token quota abuse, and database bottlenecks.

---

### Unit ARCH-004: Hybrid Live AI & Contextual Fallback Swarm Runtime
* **ID:** `ARCH-004` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  All autonomous capabilities **MUST** support hybrid runtime execution: real LLM inference via the official Google Gen AI SDK (`@google/genai`) when `GEMINI_API_KEY` is present, paired with seamless, deterministic, and localized contextual mock fallback when running offline or without credentials.
* **Do:**
  * Initialize the Google Gen AI client with environment credentials (`GEMINI_API_KEY`).
  * Pass the active tenant's operating locale and sensitivity settings directly into system prompts.
  * Require strict JSON schema outputs for automated parsing across document, support, and audit modules.
  * Provide high-fidelity, localized contextual fallback generators for zero-friction hackathon evaluation.
* **Don't:**
  * Never allow API failures or missing credentials to crash the user interface or return unhandled 500 errors.
  * Never return hardcoded English mock text when the tenant is configured for Japanese, Spanish, or Arabic.
* **Reason:** Ensures the platform delivers genuine production AI capabilities when configured while maintaining guaranteed 100% uptime, zero friction, and high reliability for judges and local developers.

---

## 💻 Domain 2: Development & Design Standards

### Unit DEV-001: Internationalization (i18n) and Localized Prompting
* **ID:** `DEV-001` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  All user interfaces, system notifications, and autonomous agent outputs **MUST** support dynamic multi-lingual localization across 7 primary locales: English (`en`), Spanish (`es`), French (`fr`), German (`de`), Japanese (`ja`), Hindi (`hi`), and Arabic (`ar`, with automatic right-to-left `dir="rtl"` layout).
* **Do:**
  * Use centralized translation dictionary keys in `src/lib/i18n/translations.ts`.
  * Support tenant default locale configuration that automatically sets the workspace interface upon login.
  * Pass the active locale to AI agent prompts to generate localized responses in native syntax.
  * Automatically apply `dir="rtl"` on Arabic locale selection.
* **Don't:**
  * Never hardcode user-facing copy directly into JSX/TSX components.
  * Never return hardcoded English summaries from AI agents when the tenant is operating in Japanese or Spanish.
* **Reason:** Enables true global micro-SaaS deployment where international clients interact with autonomous agents in their native language.

---

### Unit DEV-002: Enterprise-Grade Light UI/UX Design System
* **ID:** `DEV-002` &bull; **Status:** Approved &bull; **Version:** `2.0.0`
* **Mandatory Rule:**
  The application interface **MUST** strictly adhere to an enterprise-grade, clean, modern **Light Theme** aesthetic (inspired by Stripe, Linear, and Vercel Light).
* **Do:**
  * Use `#f8fafc` (slate-50) for outer canvas backgrounds and `#ffffff` (pure white) for cards and modals.
  * Use `#e2e8f0` (slate-200) for clean, high-contrast borders and dividers.
  * Use `#020617` / `#0f172a` (slate-950/900) for bold, crisp headings.
  * Use soft, accessible status badges (e.g. `bg-emerald-50 text-emerald-700 border-emerald-200`).
  * Support tenant brand accent colors on badges, avatars, and active links.
* **Don't:**
  * Never use dark-mode backgrounds (`#0a0a0a`, `#111827`) as the primary theme.
  * Never use low-contrast text that violates WCAG AA standards.
* **Reason:** Enterprise B2B SaaS buyers expect clean, bright, professional light interfaces that maximize legibility and trust.

---

### Unit DEV-003: Open Source Licensing and Public Repository Compliance
* **ID:** `DEV-003` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  The repository **MUST** remain fully open source under the standard MIT License. A detectable `LICENSE` file **MUST** be maintained at the repository root, with matching SPDX identifier in `package.json` and clear badges/sections in `README.md` and Devpost submissions.
* **Do:**
  * Maintain an OSI-compliant MIT License file in the root directory.
  * Define `"license": "MIT"` in `package.json`.
  * Display license status and badges clearly in documentation and submission packages.
* **Don't:**
  * Never remove or obscure the open source license file.
  * Never mark open-source packages as `private: true` without justification.
* **Reason:** Compliance with open source hackathon submission criteria and open community contribution standards.

---

### Unit DEV-004: Automated Verification & Continuous Testing Suite
* **ID:** `DEV-004` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  All critical multi-tenant isolation, sliding-window rate limiters, token debit transactions, i18n translation coverage, and agent execution paths **MUST** be covered by automated unit and integration tests in Vitest and validated via continuous integration (CI).
* **Do:**
  * Maintain comprehensive test suites covering `tokenLedgerService`, `tenantService`, `i18n`, and `geminiAgentService`.
  * Enforce dictionary completeness across all 7 supported locales (`en`, `es`, `fr`, `de`, `ja`, `hi`, `ar`).
  * Verify sliding-window rate limit enforcement (max 60 req/min) and negative balance rejection.
  * Run `npm test` and `npm run build` in GitHub Actions CI workflows on every commit.
* **Don't:**
  * Never merge code that breaks test assertions or causes build failures.
  * Never ship new user-facing features without corresponding unit or integration tests.
* **Reason:** Automated testing guarantees enterprise resilience, prevents regressions during hackathon sprint iterations, and ensures strict adherence to multi-tenant safety standards.

---

### Unit DEV-005: Token-Efficient Sparse Knowledge Protocol
* **ID:** `DEV-005` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  AI agents and automated tools operating on this repository **MUST** use Sparse Knowledge Retrieval:
  1. Inspect `knowledge/index.yaml` first (~450 tokens) to identify the specific unit required for the task.
  2. Load **ONLY** the targeted YAML unit file (~300 tokens) relevant to the change (e.g., `ARCH-001` for tenancy, `DEV-001` for i18n).
  3. **NEVER** bulk-load `knowledge/INJECTION.md` (~3,800 tokens) into active agent prompt context unless explicitly performing a full repository bootstrap or requested by the user.
  4. Post-change synchronization updates the specific YAML unit, increments `knowledge_units_count` or updates `last_updated` in `knowledge/index.yaml`, and keeps `knowledge/INJECTION.md` synchronized as an offline reference artifact.
* **Do:**
  * Read `knowledge/index.yaml` first to identify applicable architecture, development, or product standards.
  * Read only the specific YAML file(s) needed for the active task.
  * Keep `knowledge/INJECTION.md` up-to-date as a compiled, offline artifact for external audits, documentation, and zero-context bootstrapping.
* **Don't:**
  * Never dump the entire 3,800+ tokens of `knowledge/INJECTION.md` into prompt context for routine edits or queries.
  * Never bypass checking `knowledge/index.yaml` before making architectural decisions or modifying core schemas.
* **Reason:** Bulk-injecting all knowledge units wastes ~3,500+ tokens on every agent turn, exhausting context budgets and increasing latency. Sparse retrieval maintains 100% architectural rigor while reducing context token consumption by over 85%.

---

## 📦 Domain 3: Product & Governance Standards

### Unit PROD-001: Turnkey Settings Page & Feature Toggle Control
* **ID:** `PROD-001` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  The tenant settings center **MUST** provide intuitive toggles and configuration forms for all 3 agent modules, workspace branding, locale selection, and token budget management.
* **Do:**
  * Provide immediate visual feedback when toggling modules on/off (with real-time sidebar updates).
  * Include inline configuration controls for each module (e.g. risk sensitivity, auto-reply threshold).
  * Display current token usage vs. monthly budget limit with clear progress bars.
  * Provide 1-click industry presets for instant hackathon demo switching.
* **Don't:**
  * Never require server redeployment or environment restarts to enable or configure a module.
* **Reason:** Delivers immediate hackathon demo impact, showcasing how one tenant can be a Legal SaaS in Japanese while another is a DevSecOps auditor in English.

---

### Unit PROD-002: Clear Product Narrative & Interactive Onboarding UX
* **ID:** `PROD-002` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  The user interface **MUST** immediately communicate the core value proposition of SpecOS within the first 5 seconds of viewing the landing page or any workspace dashboard.
* **Do:**
  * State the core proposition clearly: *"One Platform to Automate Your Legal, Customer Support & Engineering Operations."*
  * Feature an interactive "See It In Action" product simulator on the homepage.
  * Include an explanatory onboarding callout banner on every workspace dashboard.
* **Don't:**
  * Never present generic placeholder text or cryptic jargon without business context.
* **Reason:** Ensures judges and evaluators instantly understand the product utility and architectural elegance.

---

### Unit PROD-003: Super Admin Tenant Provisioning & Separated Admin Architecture
* **ID:** `PROD-003` &bull; **Status:** Approved &bull; **Version:** `1.0.0`
* **Mandatory Rule:**
  The platform **MUST** provide a decoupled Super Admin control plane and distinct Tenant Admin pages:
  1. Super Admin Portal (`/super-admin`): Global platform management to create, provision, configure, and inspect any tenant organization.
  2. Section Configurability: Every tenant's workspace layout, widgets, and enabled sections **MUST** be independently configurable during onboarding and in settings (`showOverviewKpis`, `showLiveAgentFeed`, `showRiskMatrix`, `showQuickActions`, `showTokenMeter`).
  3. Separated Admin Pages: Workspace administration **MUST** be separated into dedicated sub-pages (`/admin/general`, `/admin/modules`, `/admin/sections`, `/admin/billing`).
  4. Header De-coupling: Direct navigation links to individual enabled applications **MUST** be presented separately in the header, rather than aggregated under a single preset button.
* **Do:**
  * Provide a dedicated `/super-admin` route with global tenant management and fleet overview.
  * Implement dynamic section toggling stored on each tenant's settings.
  * Expose individual application buttons in the workspace header for immediate access to active modules.
  * Split tenant settings into structured administrative routes.
  * Provide real-time live preview cards during tenant provisioning.
* **Don't:**
  * Never allow regular tenant members access to `/super-admin` or cross-tenant modification operations.
  * Never force all tenants to share an identical dashboard layout without section customizability.
* **Reason:** Enterprise customers demand both autonomous platform-level provisioning for operator agility and tailored workspace layouts for end-users.

---

## 🛠️ Mandatory Pre-Change & Post-Change Protocol

1. **Pre-Change Sparse Knowledge Inspection (Mandatory Step 1):**
   * Before designing or modifying any code, inspect `knowledge/index.yaml` (~450 tokens) and read **only** the specific `ARCH-*`, `DEV-*`, or `PROD-*` YAML file needed for the task.
   * Do **NOT** bulk-load `INJECTION.md` into the agent's prompt context during routine modifications.
2. **Post-Change Knowledge Synchronization (Mandatory Step 2):**
   * Whenever changes are made (routes, schema, UI, or architecture), immediately update the relevant knowledge units in `knowledge/`.
   * If a new standard is introduced, author its YAML unit, increment `knowledge_units_count`, update `last_updated` in `knowledge/index.yaml`, and re-compile `INJECTION.md`.
