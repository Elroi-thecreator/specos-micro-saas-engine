# AGENT.md: Universal Autonomous Agent Directives

> **Project:** SpecOS &bull; Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine  
> **Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)  
> **Production Live URL:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)  
> **Track Alignment:** Kiroween 2026 (*Skeleton Crew*, *Best Kiro Crew App*, *Best Startup Project*)

---

## 🤖 Role & Mission
You are an autonomous AI software engineer pair programming on the **SpecOS** codebase. Your goal is to maintain the highest enterprise standards of multi-tenant isolation, architectural modularity, asynchronous scalability, internationalization, and visual elegance.

---

## 🚨 Non-Negotiable Operational Rules

### 1. Mandatory Knowledge Base Protocol
Before designing, planning, or modifying any code or configuration:
1. **Pre-Change Inspection:** Check `knowledge/index.yaml` and `knowledge/INJECTION.md`. Identify all relevant `ARCH-*`, `DEV-*`, and `PROD-*` standards that apply to the task.
2. **Post-Change Synchronization:** Whenever changes are made (e.g. new routes, schema modifications, UI behaviors, packaging updates, bug fixes, or architecture adjustments), immediately update the relevant knowledge units in `knowledge/`.
3. If a new architectural pattern, product rule, or decision is introduced, create a new knowledge document following the standard schema (`id`, `type`, `title`, `domain`, `status`, `version`, `rule`, `do`, `dont`, `reason`, `related_items`).
4. Update `knowledge/index.yaml` (increment `knowledge_units_count`, update `last_updated`, and add the new entry under the appropriate domain).

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
* Strictly adhere to the clean, crisp Light Theme (Stripe/Linear aesthetic):
  * Outer background: `#f8fafc` (slate-50)
  * Card backgrounds: `#ffffff` (white)
  * Borders & dividers: `#e2e8f0` (slate-200)
  * Headings: `#020617` / `#0f172a` (slate-950/slate-900)
  * Status badges: soft, accessible tints with matching borders.
* Never deploy dark backgrounds as the primary workspace theme.

---

## 📂 Project Structure Map

```
E:\Hackathon\
├── .kiro/                       # Kiro native specification & steering ecosystem
│   ├── specs/specos/            # requirements.md, design.md, tasks.md
│   ├── steering/                # tenancy-isolation.md, i18n-standards.md, agent-safety.md
│   └── hooks/                   # tenant-security-hook.json
├── knowledge/                   # Continuous architectural knowledge base
│   ├── index.yaml               # Master catalog of standards (ARCH, DEV, PROD)
│   ├── INJECTION.md             # Unified compiled context injection file
│   ├── architecture/            # ARCH-001, ARCH-002, ARCH-003
│   ├── development/             # DEV-001, DEV-002
│   └── product/                 # PROD-001, PROD-002, PROD-003
├── prisma/
│   └── schema.prisma            # Scalable multi-tenant relational schema with composite indexes
├── src/
│   ├── app/
│   │   ├── page.tsx             # Public landing page with interactive simulator & directory
│   │   ├── super-admin/page.tsx # Platform Super Admin fleet manager & tenant wizard
│   │   ├── w/[slug]/page.tsx    # Tenant executive dashboard with configurable sections
│   │   ├── w/[slug]/admin/      # Separated admin sub-pages (general, modules, sections, billing)
│   │   ├── w/[slug]/documents/  # Document & Contract Intelligence application
│   │   ├── w/[slug]/support/    # Customer Support Swarm application
│   │   ├── w/[slug]/code-audit/ # Code Quality & Compliance Auditor application
│   │   └── api/v1/              # Scalable edge endpoints (tenants, settings, agent/run, agent/jobs)
│   ├── components/
│   │   ├── dynamic-sidebar.tsx  # Dynamic multi-tenant light sidebar with separated admin links
│   │   └── tenant-header.tsx    # Header with separate direct application links & Super Admin pill
│   ├── lib/
│   │   ├── types.ts             # Domain models (Tenant, TenantSettings, TenantSectionConfig, etc.)
│   │   ├── mock-data.ts         # Initial seed tenants & dataset
│   │   ├── tenant-context.tsx   # React context for multi-tenant state & async worker dispatch
│   │   ├── i18n/                # Complete dictionaries for 7 locales
│   │   └── services/            # tenant-service, token-ledger, agent-queue
│   └── middleware.ts            # Edge routing, tenant context & security headers
├── vercel.json                  # Vercel deployment configuration
└── package.json                 # Next.js 14, Tailwind CSS, Lucide Icons, TypeScript
```

---

## ⚙️ Development & Verification Runbook

### Windows NTFS Folder Casing Directive
The repository's physical folder on disk is `E:\Hackathon` (capital H). In PowerShell commands, **always prepend** `Set-Location E:\Hackathon;` before executing Node, npm, or Git commands to prevent duplicate React module loading.

### Commands
```powershell
# 1. Production Build Verification (must exit code 0)
Set-Location E:\Hackathon; npm run build

# 2. Local Production Server
Set-Location E:\Hackathon; npm run start

# 3. Git Status & Synchronization
Set-Location E:\Hackathon; git status
```

---

## 🎯 Verification Checklist for Any Future Modification
- [ ] Checked `knowledge/index.yaml` and `knowledge/INJECTION.md`.
- [ ] Confirmed `tenant_id` / `tenantSlug` boundary isolation.
- [ ] Verified that `npm run build` compiles with code 0.
- [ ] Tested responsive UI on both LTR and RTL Arabic locales.
- [ ] Updated relevant knowledge units and `.kiro/specs/specos/tasks.md`.
