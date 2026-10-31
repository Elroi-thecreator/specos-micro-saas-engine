'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, SupportedLocale, ModuleKey, TenantSettings, TenantSectionConfig } from './types';
import { INITIAL_TENANTS } from './mock-data';
import { TRANSLATIONS, SUPPORTED_LOCALES } from './i18n/translations';

interface TenantContextType {
  tenants: Tenant[];
  activeTenant: Tenant;
  activeLocale: SupportedLocale;
  isRtl: boolean;
  setActiveTenantBySlug: (slug: string) => void;
  setActiveLocale: (locale: SupportedLocale) => void;
  toggleModule: (moduleKey: ModuleKey, enabled: boolean) => void;
  updateSections: (sections: Partial<TenantSectionConfig>) => void;
  applyPreset: (preset: 'legal' | 'support' | 'devsecops' | 'all') => void;
  updateSettings: (settings: Partial<TenantSettings>) => void;
  createTenant: (tenantData: {
    name: string;
    slug?: string;
    tier?: 'Starter' | 'Pro' | 'Enterprise';
    settings?: Partial<TenantSettings>;
  }) => Tenant;
  deleteTenant: (slug: string) => boolean;
  executeAgentJob: (
    moduleKey: ModuleKey,
    payload?: any
  ) => Promise<{ success: boolean; jobId?: string; tokensRemaining?: number; error?: string }>;
  t: (key: string) => string;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('specos_tenants');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved tenants', e);
        }
      }
    }
    return INITIAL_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return INITIAL_TENANTS[0].id;
  });

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
  
  const [activeLocale, setActiveLocaleState] = useState<SupportedLocale>(() => {
    return activeTenant.settings.defaultLocale || 'en';
  });

  // When active tenant changes, default to tenant's preferred locale
  useEffect(() => {
    if (activeTenant) {
      setActiveLocaleState(activeTenant.settings.defaultLocale);
    }
  }, [activeTenant.id]);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('specos_tenants', JSON.stringify(tenants));
    }
  }, [tenants]);

  const currentLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === activeLocale);
  const isRtl = currentLocaleInfo?.dir === 'rtl';

  const setActiveTenantBySlug = (slug: string) => {
    const found = tenants.find((t) => t.slug === slug);
    if (found) {
      setActiveTenantId(found.id);
      setActiveLocaleState(found.settings.defaultLocale);
    }
  };

  const setActiveLocale = (locale: SupportedLocale) => {
    setActiveLocaleState(locale);
  };

  const toggleModule = (moduleKey: ModuleKey, enabled: boolean) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === activeTenant.id) {
          const updatedModules = {
            ...t.settings.modules,
            [moduleKey]: enabled,
          };

          // Scalable async API sync to backend
          fetch(`/api/v1/w/${t.slug}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modules: updatedModules }),
          }).catch(() => {});

          return {
            ...t,
            settings: {
              ...t.settings,
              modules: updatedModules,
            },
          };
        }
        return t;
      })
    );
  };

  const applyPreset = (preset: 'legal' | 'support' | 'devsecops' | 'all') => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === activeTenant.id) {
          let modules = { docIntel: false, supportSwarm: false, codeAudit: false };
          let defaultLocale = t.settings.defaultLocale;
          let branding = { ...t.settings.branding };

          switch (preset) {
            case 'legal':
              modules.docIntel = true;
              defaultLocale = 'ja';
              branding = {
                name: 'LexisAI Legal Suite',
                tagline: 'Autonomous Contract Risk & SLA Extraction',
                primaryColor: '#0f766e',
              };
              break;
            case 'support':
              modules.supportSwarm = true;
              defaultLocale = 'es';
              branding = {
                name: 'AtenciónGlobal Support',
                tagline: 'Enjambre Autónomo de Operaciones y Tickets',
                primaryColor: '#d97706',
              };
              break;
            case 'devsecops':
              modules.codeAudit = true;
              defaultLocale = 'en';
              branding = {
                name: 'DevShield Sentinel',
                tagline: 'Autonomous Architecture & Spec Governance',
                primaryColor: '#2563eb',
              };
              break;
            case 'all':
              modules = { docIntel: true, supportSwarm: true, codeAudit: true };
              branding = {
                name: 'OmniCorp Global Holdings',
                tagline: 'Full Autonomous Enterprise Swarm',
                primaryColor: '#7c3aed',
              };
              break;
          }

          setActiveLocaleState(defaultLocale);

          // Scalable async sync to backend API
          fetch(`/api/v1/w/${t.slug}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modules, defaultLocale, branding }),
          }).catch(() => {});

          return {
            ...t,
            settings: {
              ...t.settings,
              modules,
              defaultLocale,
              branding,
            },
          };
        }
        return t;
      })
    );
  };

  const updateSettings = (newSettings: Partial<TenantSettings>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === activeTenant.id) {
          const merged = { ...t.settings, ...newSettings };

          // Scalable async sync to backend API
          fetch(`/api/v1/w/${t.slug}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings),
          }).catch(() => {});

          return {
            ...t,
            settings: merged,
          };
        }
        return t;
      })
    );
  };

  const updateSections = (sections: Partial<TenantSectionConfig>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === activeTenant.id) {
          const currentSections: TenantSectionConfig = t.settings.sections || {
            showOverviewKpis: true,
            showLiveAgentFeed: true,
            showRiskMatrix: true,
            showQuickActions: true,
            showTokenMeter: true,
          };
          const updated = { ...currentSections, ...sections };

          fetch(`/api/v1/w/${t.slug}/settings`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sections: updated }),
          }).catch(() => {});

          return {
            ...t,
            settings: {
              ...t.settings,
              sections: updated,
            },
          };
        }
        return t;
      })
    );
  };

  const createTenant = (tenantData: {
    name: string;
    slug?: string;
    tier?: 'Starter' | 'Pro' | 'Enterprise';
    settings?: Partial<TenantSettings>;
  }): Tenant => {
    const rawSlug = tenantData.slug || tenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let finalSlug = rawSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!finalSlug) {
      finalSlug = `tenant-${Date.now().toString(36)}`;
    }
    if (tenants.some((t) => t.slug === finalSlug)) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const newTenant: Tenant = {
      id: `tenant-${Date.now().toString(36)}`,
      name: tenantData.name,
      slug: finalSlug,
      tier: tenantData.tier || 'Pro',
      settings: {
        modules: {
          docIntel: tenantData.settings?.modules?.docIntel ?? true,
          supportSwarm: tenantData.settings?.modules?.supportSwarm ?? false,
          codeAudit: tenantData.settings?.modules?.codeAudit ?? false,
        },
        sections: {
          showOverviewKpis: tenantData.settings?.sections?.showOverviewKpis ?? true,
          showLiveAgentFeed: tenantData.settings?.sections?.showLiveAgentFeed ?? true,
          showRiskMatrix: tenantData.settings?.sections?.showRiskMatrix ?? true,
          showQuickActions: tenantData.settings?.sections?.showQuickActions ?? true,
          showTokenMeter: tenantData.settings?.sections?.showTokenMeter ?? true,
        },
        moduleConfig: {
          docIntelSensitivity: tenantData.settings?.moduleConfig?.docIntelSensitivity || 'Standard',
          supportAutoReplyThreshold: tenantData.settings?.moduleConfig?.supportAutoReplyThreshold || 85,
          codeAuditStrictBranchProtection: tenantData.settings?.moduleConfig?.codeAuditStrictBranchProtection ?? true,
        },
        defaultLocale: tenantData.settings?.defaultLocale || 'en',
        tokenBudgetMonthly: tenantData.settings?.tokenBudgetMonthly || 150000,
        tokensConsumed: 0,
        branding: {
          name: tenantData.settings?.branding?.name || tenantData.name,
          tagline: tenantData.settings?.branding?.tagline || 'Autonomous Intelligent Workspace',
          primaryColor: tenantData.settings?.branding?.primaryColor || '#2563eb',
        },
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTenants((prev) => [...prev, newTenant]);
    setActiveTenantId(newTenant.id);
    setActiveLocaleState(newTenant.settings.defaultLocale);

    fetch('/api/v1/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTenant),
    }).catch(() => {});

    return newTenant;
  };

  const deleteTenant = (slug: string): boolean => {
    if (tenants.length <= 1) return false;
    setTenants((prev) => prev.filter((t) => t.slug !== slug));
    if (activeTenant.slug === slug) {
      const remaining = tenants.filter((t) => t.slug !== slug);
      if (remaining.length > 0) {
        setActiveTenantId(remaining[0].id);
        setActiveLocaleState(remaining[0].settings.defaultLocale);
      }
    }
    return true;
  };

  const executeAgentJob = async (
    moduleKey: ModuleKey,
    payload: any = {}
  ): Promise<{ success: boolean; jobId?: string; tokensRemaining?: number; error?: string }> => {
    try {
      const res = await fetch(`/api/v1/w/${activeTenant.slug}/agent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleKey, payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Job dispatch failed' };
      }

      // Update local tenant token count with real backend response
      if (data.tokensRemaining !== undefined) {
        setTenants((prev) =>
          prev.map((t) =>
            t.id === activeTenant.id
              ? {
                  ...t,
                  settings: {
                    ...t.settings,
                    tokensConsumed: t.settings.tokenBudgetMonthly - data.tokensRemaining,
                  },
                }
              : t
          )
        );
      }

      return {
        success: true,
        jobId: data.jobId,
        tokensRemaining: data.tokensRemaining,
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const t = (key: string): string => {
    const localeDict = TRANSLATIONS[activeLocale];
    if (localeDict && localeDict[key]) {
      return localeDict[key];
    }
    const fallbackDict = TRANSLATIONS['en'];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return key;
  };

  return (
    <TenantContext.Provider
      value={{
        tenants,
        activeTenant,
        activeLocale,
        isRtl,
        setActiveTenantBySlug,
        setActiveLocale,
        toggleModule,
        updateSections,
        applyPreset,
        updateSettings,
        createTenant,
        deleteTenant,
        executeAgentJob,
        t,
      }}
    >
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-sans' : ''}>
        {children}
      </div>
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
