export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'hi' | 'ar';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export type ModuleKey = 'docIntel' | 'supportSwarm' | 'codeAudit';

export interface ModuleConfig {
  enabled: boolean;
  name: string;
  description: string;
}

export interface TenantSettings {
  modules: {
    docIntel: boolean;
    supportSwarm: boolean;
    codeAudit: boolean;
  };
  defaultLocale: SupportedLocale;
  tokenBudgetMonthly: number;
  tokensConsumed: number;
  branding: {
    name: string;
    tagline: string;
    primaryColor: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  tier: 'Starter' | 'Pro' | 'Enterprise';
  settings: TenantSettings;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  tenantId: string;
  title: string;
  category: string;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  extractedClauses: {
    title: string;
    content: string;
    risk: 'Low' | 'Medium' | 'High';
  }[];
  sourceLanguage: string;
  createdAt: string;
}

export interface SupportTicketItem {
  id: string;
  tenantId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  sentiment: 'Positive' | 'Neutral' | 'Frustrated' | 'Urgent';
  status: 'Open' | 'In Review' | 'Resolved';
  suggestedReply: string;
  inputLocale: string;
  createdAt: string;
}

export interface CodeAuditItem {
  id: string;
  tenantId: string;
  repo: string;
  branch: string;
  score: number;
  violationsCount: number;
  findings: {
    severity: 'High' | 'Medium' | 'Low';
    ruleId: string;
    description: string;
    suggestion: string;
  }[];
  specCompliance: '100% Compliant' | 'Warnings Found' | 'Critical Violations';
  createdAt: string;
}
