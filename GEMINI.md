# GEMINI.md: Google Gemini & Antigravity Agent Configuration

> **Project:** SpecOS &bull; Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine  
> **Repository:** [https://github.com/Elroi-thecreator/specos-micro-saas-engine](https://github.com/Elroi-thecreator/specos-micro-saas-engine)  
> **Production Live URL:** [https://specos-micro-saas-engine.vercel.app](https://specos-micro-saas-engine.vercel.app)  
> **Cloudflare Tunnel Fallback:** [https://witnesses-frozen-laser-reggae.trycloudflare.com](https://witnesses-frozen-laser-reggae.trycloudflare.com)

---

## 💎 Gemini Agent Persona & Execution Directives
You are Google Gemini, operating as an expert principal systems architect and full-stack software engineer inside Google Antigravity. When operating on the **SpecOS** codebase, you must adhere to the following environment rules, tool constraints, and architecture standards.

---

## ⚡ Critical Environment Rules (Windows & Antigravity)

### 1. NTFS Directory Casing Rule
* The physical working folder on disk is **`E:\Hackathon`** (Capital `H`).
* In PowerShell sessions, if commands run from `e:\hackathon` (lowercase `h`), Node.js and Webpack detect multiple path casings and load duplicate React instances, triggering:
  `TypeError: Cannot read properties of null (reading 'useContext')`
* **Mandatory Directive:** Whenever executing terminal commands, **always prepend** `Set-Location E:\Hackathon;`.

### 2. Mandatory Knowledge Base Protocol
* **Step 1 (Pre-Change):** Always inspect `knowledge/index.yaml` and `knowledge/INJECTION.md` before planning or writing code.
* **Step 2 (Post-Change):** Immediately update relevant YAML files in `knowledge/`, increment `knowledge_units_count` in `knowledge/index.yaml`, update `last_updated`, and re-synchronize `knowledge/INJECTION.md`.
* Never introduce architectural patterns or UX redesigns that contradict approved standards (`ARCH-001`, `ARCH-002`, `ARCH-003`, `DEV-001`, `DEV-002`, `PROD-001`, `PROD-002`, `PROD-003`).

### 3. Background Daemons & Long-Running Processes
* Do **NOT** poll background tasks in a loop. Antigravity notifies you reactively when tasks finish or trigger notifications.
* Active system daemons:
  * `cloudflared.exe tunnel --url http://localhost:3000` (serving Cloudflare tunnel fallback).
  * `npm run start` (serving Next.js production server on port 3000).

---

## 🏗️ Architecture & Component Reference

### 1. Multi-Tenant Edge Routing (`src/middleware.ts`)
* Resolves tenant slug from `/w/[slug]` or `/api/v1/w/[slug]`.
* Injects `x-tenant-slug`, `x-request-id`, and security headers (`X-Frame-Options`, `X-Content-Type-Options`).

### 2. Platform Super Admin (`src/app/super-admin/page.tsx`)
* Global platform management console.
* Displays Organization Fleet Registry, token volume, active modules, and RLS partition health.
* Features the **Tenant Provisioning Wizard** (`?tab=new`) with real-time preview, 1-click industry presets, and granular dashboard section customizer.
* Uses Next.js `<Suspense>` boundary around search params.

### 3. Separated Tenant Administration (`src/app/w/[slug]/admin/`)
* **General & Branding (`/admin/general`):** Organization name, tagline, brand accent color, and primary operating language.
* **Modules & Swarms (`/admin/modules`):** Turnkey AI capability toggles (`docIntel`, `supportSwarm`, `codeAudit`) with risk thresholds and 1-click demo presets.
* **Dashboard Sections (`/admin/sections`):** Granular layout customizer controlling visibility of KPI ribbons, live streams, risk matrix, quick actions, and token meter.
* **Billing & Ledger (`/admin/billing`):** Monthly token budget slider, sliding-window rate limits (60 req/min), and API key management.

### 4. Separate Application Links in Header (`src/components/tenant-header.tsx`)
* Separate direct navigation links to each active capability:
  * `[⚖️ Documents]` &rarr; `/w/[slug]/documents`
  * `[🎧 Support]` &rarr; `/w/[slug]/support`
  * `[🛡️ Code Audit]` &rarr; `/w/[slug]/code-audit`
  * `[⚙️ Admin]` &rarr; `/w/[slug]/admin/general`
  * `[⚡ Super Admin]` &rarr; `/super-admin`

### 5. Asynchronous Worker Queue (`src/lib/services/agent-queue.ts`)
* Returns `202 Accepted` with a verifiable `jobId` (`job_*`).
* Status polling endpoint: `/api/v1/w/[slug]/agent/jobs/[jobId]`.
* Atomic token debiting via `tokenLedgerService` preventing quota overruns.

---

## 🛠️ Verification Runbook

```powershell
# 1. Ensure correct physical location
Set-Location E:\Hackathon

# 2. Compile and verify production build
npm run build

# 3. Test edge endpoints locally
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tenants"
Invoke-RestMethod -Uri "https://specos-micro-saas-engine.vercel.app/api/v1/tenants"

# 4. Check git status
git status
```

---

## 🌟 Git & Remote Deployment
* **GitHub Remote:** `https://github.com/Elroi-thecreator/specos-micro-saas-engine.git`
* **Account:** `Elroi-thecreator`
* **Vercel Project:** `specos-micro-saas-engine` (auto-deploys from `main` branch)
* When committing code, use standard conventional commits (e.g. `feat: ...`, `fix: ...`, `docs: ...`).
