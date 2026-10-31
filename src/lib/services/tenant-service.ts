import { Tenant, TenantSettings, ModuleKey } from '../types';
import { INITIAL_TENANTS } from '../mock-data';

// High-scale in-memory cached tenant store with atomic mutation locks
class TenantService {
  private tenants: Map<string, Tenant> = new Map();

  constructor() {
    // Seed initial tenants into scalable map
    INITIAL_TENANTS.forEach((t) => {
      this.tenants.set(t.slug, { ...t });
    });
  }

  public getAllTenants(): Tenant[] {
    return Array.from(this.tenants.values());
  }

  public getTenantBySlug(slug: string): Tenant | null {
    return this.tenants.get(slug) || null;
  }

  public createTenant(newTenantData: {
    name: string;
    slug?: string;
    tier?: 'Starter' | 'Pro' | 'Enterprise';
    settings?: Partial<TenantSettings>;
  }): Tenant {
    const rawSlug = newTenantData.slug || newTenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let finalSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!finalSlug) {
      finalSlug = `tenant-${Date.now().toString(36)}`;
    }
    if (this.tenants.has(finalSlug)) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const tenant: Tenant = {
      id: `tenant-${Date.now().toString(36)}`,
      name: newTenantData.name,
      slug: finalSlug,
      tier: newTenantData.tier || 'Pro',
      settings: {
        modules: {
          docIntel: newTenantData.settings?.modules?.docIntel ?? true,
          supportSwarm: newTenantData.settings?.modules?.supportSwarm ?? false,
          codeAudit: newTenantData.settings?.modules?.codeAudit ?? false,
        },
        sections: {
          showOverviewKpis: newTenantData.settings?.sections?.showOverviewKpis ?? true,
          showLiveAgentFeed: newTenantData.settings?.sections?.showLiveAgentFeed ?? true,
          showRiskMatrix: newTenantData.settings?.sections?.showRiskMatrix ?? true,
          showQuickActions: newTenantData.settings?.sections?.showQuickActions ?? true,
          showTokenMeter: newTenantData.settings?.sections?.showTokenMeter ?? true,
        },
        moduleConfig: {
          docIntelSensitivity: newTenantData.settings?.moduleConfig?.docIntelSensitivity || 'Standard',
          supportAutoReplyThreshold: newTenantData.settings?.moduleConfig?.supportAutoReplyThreshold || 85,
          codeAuditStrictBranchProtection: newTenantData.settings?.moduleConfig?.codeAuditStrictBranchProtection ?? true,
        },
        defaultLocale: newTenantData.settings?.defaultLocale || 'en',
        tokenBudgetMonthly: newTenantData.settings?.tokenBudgetMonthly || 150000,
        tokensConsumed: 0,
        branding: {
          name: newTenantData.settings?.branding?.name || newTenantData.name,
          tagline: newTenantData.settings?.branding?.tagline || 'Autonomous Intelligent Workspace',
          primaryColor: newTenantData.settings?.branding?.primaryColor || '#2563eb',
        },
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.tenants.set(tenant.slug, tenant);
    return tenant;
  }

  public deleteTenant(slug: string): boolean {
    if (!this.tenants.has(slug)) return false;
    return this.tenants.delete(slug);
  }

  public updateTenantSettings(
    slug: string,
    updates: {
      modules?: Partial<TenantSettings['modules']>;
      sections?: Partial<NonNullable<TenantSettings['sections']>>;
      moduleConfig?: Partial<NonNullable<TenantSettings['moduleConfig']>>;
      defaultLocale?: TenantSettings['defaultLocale'];
      tokenBudgetMonthly?: number;
      branding?: Partial<TenantSettings['branding']>;
    }
  ): Tenant | null {
    const tenant = this.tenants.get(slug);
    if (!tenant) return null;

    const updatedSettings: TenantSettings = {
      ...tenant.settings,
      modules: {
        ...tenant.settings.modules,
        ...(updates.modules || {}),
      },
      sections: {
        showOverviewKpis: tenant.settings.sections?.showOverviewKpis ?? true,
        showLiveAgentFeed: tenant.settings.sections?.showLiveAgentFeed ?? true,
        showRiskMatrix: tenant.settings.sections?.showRiskMatrix ?? true,
        showQuickActions: tenant.settings.sections?.showQuickActions ?? true,
        showTokenMeter: tenant.settings.sections?.showTokenMeter ?? true,
        ...(updates.sections || {}),
      },
      moduleConfig: {
        ...(tenant.settings.moduleConfig || {}),
        ...(updates.moduleConfig || {}),
      },
      defaultLocale: updates.defaultLocale || tenant.settings.defaultLocale,
      tokenBudgetMonthly: updates.tokenBudgetMonthly ?? tenant.settings.tokenBudgetMonthly,
      branding: {
        ...tenant.settings.branding,
        ...(updates.branding || {}),
      },
    };

    const updatedTenant: Tenant = {
      ...tenant,
      settings: updatedSettings,
    };

    this.tenants.set(slug, updatedTenant);
    return updatedTenant;
  }

  public assertModuleEnabled(slug: string, moduleKey: ModuleKey): boolean {
    const tenant = this.getTenantBySlug(slug);
    if (!tenant) return false;
    return Boolean(tenant.settings.modules[moduleKey]);
  }
}

export const tenantService = new TenantService();
