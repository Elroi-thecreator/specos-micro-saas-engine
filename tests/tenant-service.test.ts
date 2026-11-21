import { describe, it, expect } from 'vitest';
import { tenantService } from '../src/lib/services/tenant-service';

describe('TenantService (ARCH-001, ARCH-002, PROD-003)', () => {
  it('loads initial seeded tenants', () => {
    const tenants = tenantService.getAllTenants();
    expect(tenants.length).toBeGreaterThanOrEqual(3);

    const lexis = tenantService.getTenantBySlug('lexis-legal');
    expect(lexis).toBeDefined();
    expect(lexis?.settings.modules.docIntel).toBe(true);
  });

  it('correctly creates a new tenant with slug sanitization', () => {
    const newTenant = tenantService.createTenant({
      name: 'CyberShield Security Operations!',
      tier: 'Enterprise',
      settings: {
        modules: {
          docIntel: false,
          supportSwarm: false,
          codeAudit: true,
        },
      },
    });

    expect(newTenant.slug).toBe('cybershield-security-operations');
    expect(newTenant.tier).toBe('Enterprise');
    expect(newTenant.settings.modules.codeAudit).toBe(true);
  });

  it('resolves slug collisions automatically', () => {
    const first = tenantService.createTenant({ name: 'Acme Global Corp' });
    const second = tenantService.createTenant({ name: 'Acme Global Corp' });

    expect(first.slug).toBe('acme-global-corp');
    expect(second.slug).toMatch(/^acme-global-corp-[a-z0-9]+$/);
    expect(first.slug).not.toBe(second.slug);
  });

  it('enforces module enablement assertion (ARCH-002)', () => {
    const lexis = tenantService.getTenantBySlug('lexis-legal');
    expect(lexis).toBeDefined();

    expect(tenantService.assertModuleEnabled('lexis-legal', 'docIntel')).toBe(true);
    expect(tenantService.assertModuleEnabled('lexis-legal', 'codeAudit')).toBe(false);
  });

  it('updates tenant settings and section visibility (PROD-003)', () => {
    const tenant = tenantService.createTenant({ name: 'Custom Layout Tenant' });
    const updated = tenantService.updateTenantSettings(tenant.slug, {
      sections: {
        showOverviewKpis: true,
        showLiveAgentFeed: false,
        showRiskMatrix: false,
        showQuickActions: true,
        showTokenMeter: true,
      },
    });

    expect(updated?.settings.sections?.showLiveAgentFeed).toBe(false);
    expect(updated?.settings.sections?.showRiskMatrix).toBe(false);
  });
});
