# SpecOS Knowledge Base Injection (Unified Machine Context)

> **Auto-Generated & Standardized Context Injection File**  
> **Last Synchronized:** 2026-10-31  
> **Active Knowledge Units Count:** 8  
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

1. **Pre-Change Knowledge Inspection (Mandatory Step 1):**
   * Before designing or modifying any code, check `knowledge/index.yaml` and reference all relevant `ARCH-*`, `DEV-*`, and `PROD-*` standards.
2. **Post-Change Knowledge Synchronization (Mandatory Step 2):**
   * Whenever changes are made (routes, schema, UI, or architecture), immediately update the relevant knowledge units in `knowledge/`.
   * If a new standard is introduced, author its YAML unit, increment `knowledge_units_count`, update `last_updated`, and re-compile `INJECTION.md`.
