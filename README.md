# SpecOS: Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine

> **Kiroween 2026 Hackathon Submission** &bull; **Track:** *Skeleton Crew* &bull; **Eligible Bonus:** *Best Kiro Crew App*, *Best Startup Project*

[![Built with Kiro](https://img.shields.io/badge/Built%20with-Kiro-emerald.svg)](https://kiro.dev)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Production%20Live-black.svg?logo=vercel)](https://specos-micro-saas-engine.vercel.app/)
[![Architecture Standards](https://img.shields.io/badge/Knowledge%20Base-ARCH--001%20%7C%20ARCH--002%20%7C%20ARCH--003-blue.svg)](./knowledge/)
[![i18n Ready](https://img.shields.io/badge/i18n-7%20Locales%20%2B%20RTL-cyan.svg)](./src/lib/i18n/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Elroi--thecreator%2Fspecos--micro--saas--engine-181717.svg?logo=github)](https://github.com/Elroi-thecreator/specos-micro-saas-engine)

SpecOS is an enterprise-grade, multi-tenant B2B AI Micro-SaaS boilerplate and autonomous agent execution engine. Built for the **Skeleton Crew** track, it proves that a **single, adaptable skeleton core** can dynamically morph into completely distinct vertical SaaS applications (e.g. Legal Contract AI in Japanese, Customer Support Swarm in Spanish, or DevSecOps Spec Auditor in English) purely through an interactive **Capabilities & Settings control center**.

---

## 🌐 Live Demo & Deployment
* **Official Vercel Production:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)
* **Super Admin Control Plane:** [https://specos-micro-saas-engine.vercel.app/super-admin](https://specos-micro-saas-engine.vercel.app/super-admin)
* **New Tenant Provisioning Wizard:** [https://specos-micro-saas-engine.vercel.app/super-admin?tab=new](https://specos-micro-saas-engine.vercel.app/super-admin?tab=new)
* **Live Cloudflare Tunnel Fallback:** [https://witnesses-frozen-laser-reggae.trycloudflare.com](https://witnesses-frozen-laser-reggae.trycloudflare.com)
* **Public GitHub Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)

---

## 🌟 Key Capabilities

### 1. 🛡️ Platform Super Admin Control Plane (`/super-admin`)
* **Fleet Registry & Telemetry:** Inspect all organizations across the platform, view aggregated token capacity vs consumption, verify RLS isolation status, and manage workspace life-cycles.
* **Interactive Tenant Provisioning Wizard:** Create a new tenant with organization identity, URL slug, tier, custom brand color, and operating language.
* **Granular Section Customizer:** Select which sections appear on the tenant dashboard (`showOverviewKpis`, `showLiveAgentFeed`, `showRiskMatrix`, `showQuickActions`, `showTokenMeter`).
* **1-Click Industry Templates:** Instant configuration for *Legal Tech Firm*, *DevSecOps Sentinel*, *Customer Support Swarm*, or *Full Enterprise Swarm*.
* **Live Real-time Preview:** Visual preview card dynamically mocks the new workspace header, sidebar navigation items, and enabled sections before launching.

### 2. 📑 Separated Tenant Admin Architecture
Rather than a single congested settings view, administrative tasks are partitioned into dedicated sub-centers:
* [`/w/[slug]/admin/general`](./src/app/w/[slug]/admin/general/page.tsx): Organization Profile, Tagline, Primary Color theme, and Operating Language.
* [`/w/[slug]/admin/modules`](./src/app/w/[slug]/admin/modules/page.tsx): Turnkey AI capability toggles with zero redeployment.
* [`/w/[slug]/admin/sections`](./src/app/w/[slug]/admin/sections/page.tsx): Live dashboard layout and section customizer.
* [`/w/[slug]/admin/billing`](./src/app/w/[slug]/admin/billing/page.tsx): Monthly token budget slider, sliding-window rate limits, and API keys.

### 3. 🔗 Dedicated Application Links in Header
* Individual top-nav links directly into each active capability:
  * `[⚖️ Documents]` &rarr; `/w/[slug]/documents` (Contract risk analysis)
  * `[🎧 Support]` &rarr; `/w/[slug]/support` (Customer ticket swarm)
  * `[🛡️ Code Audit]` &rarr; `/w/[slug]/code-audit` (Spec & code auditor)
  * `[⚙️ Admin]` &rarr; `/w/[slug]/admin/general`
  * `[⚡ Super Admin]` &rarr; `/super-admin`

### 4. ⚡ High-Scale Asynchronous Architecture (ARCH-003)
* **Edge Middleware:** Injects tenant resolution (`x-tenant-slug`), security headers (`X-Frame-Options`, `X-Content-Type-Options`), and request tracing IDs.
* **Sliding-Window Rate Limiting:** 60 requests/minute per tenant IP to prevent noisy-neighbor starvation.
* **Decoupled Worker Queue:** Non-blocking async agent execution returning `202 Accepted` with verifiable job IDs (`job_*`) and status polling (`/api/v1/w/[slug]/agent/jobs/[jobId]`).
* **Atomic Token Ledger:** Pre-flight quota verification and atomic debit preventing race-condition overruns.
* **Prisma Schema (`prisma/schema.prisma`):** Composite indices on `(tenant_id, created_at)` for high concurrency.

### 5. 🌍 Deep Multilingual Support (i18n & RTL)
* **7 Supported Operating Locales:**
  * 🇺🇸 English (`en`)
  * 🇪🇸 Spanish (`es`)
  * 🇫🇷 French (`fr`)
  * 🇩🇪 German (`de`)
  * 🇯🇵 Japanese (`ja`)
  * 🇮🇳 Hindi (`hi`)
  * 🇸🇦 Arabic (`ar`, with automatic right-to-left `dir="rtl"` layout)
* **Localized Agent Outputs:** AI agents inspect the active tenant's operating language and output executive summaries, risk tables, and replies in that native language.

---

## 🤖 Deep Kiro Native Architecture

This repository strictly commits the `/.kiro` ecosystem required by Kiroween judges:

```
.kiro/
├── specs/specos/
│   ├── requirements.md      # E2E functional & non-functional requirements
│   ├── design.md            # Schema, edge routing, & agent architecture
│   └── tasks.md             # Phased implementation roadmap (Phases 1-8 completed)
├── steering/
│   ├── tenancy-isolation.md # Directives enforcing tenant_id scoping
│   ├── i18n-standards.md    # Strict zero-hardcoded-text rules
│   └── agent-safety.md      # Token quotas & prompt injection sanitization
└── hooks/
    └── tenant-security-hook.json # Pre-commit linting & security verification
```

---

## 🚀 Quickstart & Development

### Prerequisites
* Node.js 18+ (tested on Node v20)
* npm 10+

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start the production server
npm run start
```

1. Navigate to `http://localhost:3000` to view the multi-tenant directory.
2. Select any tenant (e.g. `LexisAI Legal Suite` or `DevShield Sentinel`).
3. Open **Workspace Admin** (`/admin/sections`) to customize dashboard sections.
4. Open **Super Admin** (`/super-admin`) to provision new organizations on the fly!

---

## 📜 Mandatory Knowledge Base Protocol
All architectural rules, decisions, and development standards are recorded in the project's root `knowledge/` directory:
* [`knowledge/index.yaml`](./knowledge/index.yaml): Central registry of active standards.
* [`ARCH-001`](./knowledge/architecture/ARCH-001-multi-tenant-isolation.yaml): Multi-Tenant Data & Workspace Isolation.
* [`ARCH-002`](./knowledge/architecture/ARCH-002-modular-agent-registry.yaml): Modular Agent Capabilities & Configuration Engine.
* [`ARCH-003`](./knowledge/architecture/ARCH-003-scalable-multi-tenant-engine.yaml): High-Scale Multi-Tenant Data & Worker Architecture.
* [`DEV-001`](./knowledge/development/DEV-001-multilingual-i18n-standards.yaml): Internationalization and Localized Prompting.
* [`DEV-002`](./knowledge/development/DEV-002-enterprise-design-system.yaml): Enterprise-Grade Light UI/UX Design System.
* [`PROD-001`](./knowledge/product/PROD-001-configurable-module-settings.yaml): Turnkey Settings Page & Feature Toggle Control.
* [`PROD-002`](./knowledge/product/PROD-002-product-narrative-onboarding.yaml): Clear Product Narrative & Interactive Onboarding UX.
* [`PROD-003`](./knowledge/product/PROD-003-super-admin-tenant-provisioning.yaml): Super Admin Tenant Provisioning & Separated Admin Architecture.

---

## 🏆 Kiroween Devpost Submission Highlights
* **Track:** Skeleton Crew (One foundation, infinite modular micro-SaaS deployments).
* **Multi-Tenancy:** Complete tenant boundary isolation with per-tenant branding and quotas.
* **Super Admin Control Plane:** Centralized organization provisioning with real-time preview and section customizer.
* **Separated Admin Pages:** Distinct interfaces for general identity, modules, sections, and quotas.
* **Localization:** 7 languages + RTL Arabic handling.
* **Kiro Integration:** Native spec-driven development (`.kiro/`), steering directives, and automated security hooks.
