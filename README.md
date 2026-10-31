# SpecOS: Autonomous Multi-Tenant & Multilingual Micro-SaaS Engine

> **Kiroween 2026 Hackathon Submission** &bull; **Track:** *Skeleton Crew* &bull; **Eligible Bonus:** *Best Kiro Crew App*, *Best Startup Project*

[![Built with Kiro](https://img.shields.io/badge/Built%20with-Kiro-emerald.svg)](https://kiro.dev)
[![Architecture Standards](https://img.shields.io/badge/Knowledge%20Base-ARCH--001%20%7C%20ARCH--002-blue.svg)](./knowledge/)
[![i18n Ready](https://img.shields.io/badge/i18n-7%20Locales%20%2B%20RTL-cyan.svg)](./src/lib/i18n/)

SpecOS is a production-grade, multi-tenant B2B AI Micro-SaaS boilerplate and autonomous agent execution engine. Built for the **Skeleton Crew** track, it proves that a **single, adaptable skeleton core** can dynamically morph into completely distinct vertical SaaS applications (e.g. Legal Contract AI in Japanese, Customer Support Swarm in Spanish, or DevSecOps Spec Auditor in English) purely through an interactive **Capabilities & Settings control center**.

---

## 🌟 Key Capabilities

### 1. Strict Multi-Tenancy & Logical Isolation
* **Tenant-Scoped State:** Every document, support ticket, code audit, token consumption ledger, and memory context is strictly partitioned by `tenant_id` (`ARCH-001`).
* **Subdomain & Workspace Slug Routing:** Seamless self-serve tenancy via `/w/[tenant_slug]`.
* **Zero Cross-Tenant Leakage:** Enforced by database filtering and Kiro pre-commit security hooks.

### 2. Deep Multilingual Support (i18n & RTL)
* **7 Supported Operating Locales:**
  * 🇺🇸 English (`en`)
  * 🇪🇸 Spanish (`es`)
  * 🇫🇷 French (`fr`)
  * 🇩🇪 German (`de`)
  * 🇯🇵 Japanese (`ja`)
  * 🇮🇳 Hindi (`hi`)
  * 🇸🇦 Arabic (`ar`, with automatic right-to-left `dir="rtl"` layout)
* **Localized Agent Outputs:** AI agents inspect the active tenant's operating language and output executive summaries, risk tables, and replies in that native language.

### 3. Configurable Capabilities in Workspace Settings
Administrators can toggle autonomous agent modules on and off in real-time, immediately reshaping the dynamic navigation sidebar and backend capabilities:
* 📄 **Document & Contract Intelligence:** Legal risk scoring, indemnification extraction, and SLA summaries.
* 💬 **Customer Operations & Support Swarm:** Autonomous ticket triage, sentiment detection, and multilingual draft replies.
* 🛡️ **Code Quality & Compliance Auditor:** Automated repository auditing against Kiro specifications, architecture guidelines, and security policies.

### 4. 1-Click Turnkey Demo Presets
Test the versatility of the skeleton in seconds:
* **⚖️ Legal & Contract SaaS:** Configured for Japanese legal procurement.
* **🎧 Global Customer Support SaaS:** Configured for Spanish multilingual operations.
* **🛡️ DevSecOps & Spec Auditor:** Configured for English engineering compliance.
* **🚀 All-in-One Enterprise Swarm:** Activates all modules in an enterprise tier.

---

## 🤖 Deep Kiro Native Architecture

This repository strictly commits the `/.kiro` ecosystem required by Kiroween judges:

```
.kiro/
├── specs/specos/
│   ├── requirements.md      # E2E functional & non-functional requirements
│   ├── design.md            # Schema, edge routing, & agent architecture
│   └── tasks.md             # Phased implementation roadmap
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

# 2. Start the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

1. Navigate to `http://localhost:3000` to view the multi-tenant directory.
2. Select any tenant (e.g. `LexisAI Legal Suite` or `DevShield Sentinel`).
3. Open **Workspace Settings** to toggle modules or click a **1-Click Preset** to see the entire platform reconfigure live!

---

## 📜 Mandatory Knowledge Base Protocol
All architectural rules, decisions, and development standards are recorded in the project's root `knowledge/` directory:
* [`knowledge/index.yaml`](./knowledge/index.yaml): Central registry of active standards.
* [`ARCH-001`](./knowledge/architecture/ARCH-001-multi-tenant-isolation.yaml): Multi-Tenant Data & Workspace Isolation.
* [`ARCH-002`](./knowledge/architecture/ARCH-002-modular-agent-registry.yaml): Modular Agent Capabilities & Configuration Engine.
* [`DEV-001`](./knowledge/development/DEV-001-multilingual-i18n-standards.yaml): Internationalization and Localized Prompting.
* [`PROD-001`](./knowledge/product/PROD-001-configurable-module-settings.yaml): Turnkey Settings Page & Feature Toggle Control.

---

## 🏆 Kiroween Devpost Submission Highlights
* **Track:** Skeleton Crew (One foundation, infinite modular micro-SaaS deployments).
* **Multi-Tenancy:** Complete tenant boundary isolation with per-tenant branding and quotas.
* **Localization:** 7 languages + RTL Arabic handling.
* **Kiro Integration:** Native spec-driven development, steering files, and automated hooks.
