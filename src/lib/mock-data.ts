import { Tenant, DocumentItem, SupportTicketItem, CodeAuditItem } from './types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-legal-101',
    name: 'LexisAI Global Legal',
    slug: 'lexis-legal',
    tier: 'Enterprise',
    settings: {
      modules: {
        docIntel: true,
        supportSwarm: false,
        codeAudit: false,
      },
      sections: {
        showOverviewKpis: true,
        showLiveAgentFeed: true,
        showRiskMatrix: true,
        showQuickActions: true,
        showTokenMeter: true,
      },
      moduleConfig: {
        docIntelSensitivity: 'Strict',
      },
      defaultLocale: 'ja',
      tokenBudgetMonthly: 250000,
      tokensConsumed: 48320,
      branding: {
        name: 'LexisAI Legal Suite',
        tagline: 'Autonomous Contract Intelligence & Risk Governance',
        primaryColor: '#0f766e',
      },
    },
    createdAt: '2026-10-15',
  },
  {
    id: 'tenant-dev-202',
    name: 'DevShield Cloud Security',
    slug: 'devshield',
    tier: 'Pro',
    settings: {
      modules: {
        docIntel: false,
        supportSwarm: false,
        codeAudit: true,
      },
      sections: {
        showOverviewKpis: true,
        showLiveAgentFeed: true,
        showRiskMatrix: false,
        showQuickActions: true,
        showTokenMeter: true,
      },
      moduleConfig: {
        codeAuditStrictBranchProtection: true,
      },
      defaultLocale: 'en',
      tokenBudgetMonthly: 150000,
      tokensConsumed: 89450,
      branding: {
        name: 'DevShield Sentinel',
        tagline: 'Autonomous Kiro Spec & Architecture Auditor',
        primaryColor: '#2563eb',
      },
    },
    createdAt: '2026-10-20',
  },
  {
    id: 'tenant-support-303',
    name: 'AtenciónGlobal Support',
    slug: 'atencion-global',
    tier: 'Pro',
    settings: {
      modules: {
        docIntel: false,
        supportSwarm: true,
        codeAudit: false,
      },
      sections: {
        showOverviewKpis: true,
        showLiveAgentFeed: true,
        showRiskMatrix: false,
        showQuickActions: false,
        showTokenMeter: true,
      },
      moduleConfig: {
        supportAutoReplyThreshold: 90,
      },
      defaultLocale: 'es',
      tokenBudgetMonthly: 100000,
      tokensConsumed: 32100,
      branding: {
        name: 'AtenciónGlobal Swarm',
        tagline: 'Operaciones de Soporte Multilingüe Autónomo',
        primaryColor: '#d97706',
      },
    },
    createdAt: '2026-10-25',
  },
  {
    id: 'tenant-enterprise-404',
    name: 'OmniCorp Global Holdings',
    slug: 'omnicorp',
    tier: 'Enterprise',
    settings: {
      modules: {
        docIntel: true,
        supportSwarm: true,
        codeAudit: true,
      },
      sections: {
        showOverviewKpis: true,
        showLiveAgentFeed: true,
        showRiskMatrix: true,
        showQuickActions: true,
        showTokenMeter: true,
      },
      moduleConfig: {
        docIntelSensitivity: 'Standard',
        supportAutoReplyThreshold: 85,
        codeAuditStrictBranchProtection: true,
      },
      defaultLocale: 'de',
      tokenBudgetMonthly: 500000,
      tokensConsumed: 198400,
      branding: {
        name: 'OmniCorp AI Operations',
        tagline: 'Autonomous Enterprise Multi-Agent Suite',
        primaryColor: '#7c3aed',
      },
    },
    createdAt: '2026-10-01',
  },
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    tenantId: 'tenant-legal-101',
    title: 'Master Cloud Services Agreement - VendorX.pdf',
    category: 'SaaS SLA & Procurement',
    riskScore: 'High',
    sourceLanguage: 'English',
    summary: 'サプライヤーの責任上限が契約金額の100%に制限されており、データ漏洩時の無制限補償条項が欠如しています。即時修正が必要です。',
    extractedClauses: [
      {
        title: 'Section 11.2 - Limitation of Liability',
        content: 'Aggregate liability shall not exceed the total fees paid in the preceding 6 months.',
        risk: 'High',
      },
      {
        title: 'Section 14.1 - Intellectual Property Indemnification',
        content: 'Vendor disclaims all warranties regarding third-party patent infringements.',
        risk: 'Critical' as any,
      },
      {
        title: 'Section 8.4 - Automatic Renewal',
        content: 'Renews automatically for 24-month terms unless notice given 90 days prior.',
        risk: 'Medium',
      },
    ],
    createdAt: '2026-10-28',
  },
  {
    id: 'doc-002',
    tenantId: 'tenant-legal-101',
    title: 'Mutual Non-Disclosure Agreement - Tokyo FinTech.pdf',
    category: 'Confidentiality',
    riskScore: 'Low',
    sourceLanguage: 'Japanese',
    summary: '標準的な2年間の守秘義務契約書。準拠法は東京地方裁判所。特筆すべき異常リスクなし。',
    extractedClauses: [
      {
        title: '第4条 - 秘密情報の保持義務',
        content: '受領当事者は、善良な管理者の注意をもって開示当事者の秘密情報を保護するものとする。',
        risk: 'Low',
      },
    ],
    createdAt: '2026-10-30',
  },
];

export const MOCK_TICKETS: SupportTicketItem[] = [
  {
    id: 'tkt-001',
    tenantId: 'tenant-support-303',
    customerName: 'Carlos Mendoza',
    customerEmail: 'carlos.m@empresa.es',
    subject: 'Error al sincronizar datos bancarios con la API',
    message: 'Llevamos más de 3 horas intentando sincronizar los balances y la pasarela devuelve error 502 Bad Gateway. Esto está paralizando nuestros cobros del mes.',
    sentiment: 'Urgent',
    status: 'In Review',
    inputLocale: 'es',
    suggestedReply: 'Estimado Carlos, lamentamos sinceramente el inconveniente. Hemos detectado un pico de latencia en la pasarela de pagos europea. Nuestro equipo de ingeniería ya ha desplegado un parche de mitigación y el servicio se restablecerá en 15 minutos.',
    createdAt: '2026-10-31 09:15',
  },
  {
    id: 'tkt-002',
    tenantId: 'tenant-support-303',
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@innovate.co.uk',
    subject: 'Query regarding multilingual seat licenses',
    message: 'Hello, we would like to know if the enterprise tier supports Arabic RTL and multi-region billing. Thank you!',
    sentiment: 'Positive',
    status: 'Open',
    inputLocale: 'en',
    suggestedReply: 'Hello Sarah! Yes, our Enterprise tier natively supports Arabic RTL across all dashboards, as well as multi-region currency invoicing. I have enabled a preview trial for your workspace.',
    createdAt: '2026-10-31 10:40',
  },
];

export const MOCK_AUDITS: CodeAuditItem[] = [
  {
    id: 'audit-001',
    tenantId: 'tenant-dev-202',
    repo: 'github.com/acme-org/payment-gateway',
    branch: 'feat/multi-tenant-sync',
    score: 94,
    violationsCount: 1,
    specCompliance: 'Warnings Found',
    findings: [
      {
        severity: 'Medium',
        ruleId: 'ARCH-001',
        description: 'Unscoped query detected in db/transaction-log.ts: `db.findMany()` missing `tenant_id` filter.',
        suggestion: 'Wrap with `withTenantScope(activeTenantId)` or add `{ where: { tenant_id: req.tenant.id } }`.',
      },
      {
        severity: 'Low',
        ruleId: 'DEV-001',
        description: 'Hardcoded string "Invalid card credentials" detected in auth/checkout.tsx:42.',
        suggestion: 'Replace with `t("checkout.errors.invalidCard")` from locale bundle.',
      },
    ],
    createdAt: '2026-10-31 08:30',
  },
];
