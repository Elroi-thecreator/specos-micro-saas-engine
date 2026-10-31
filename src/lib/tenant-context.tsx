'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, SupportedLocale, ModuleKey, TenantSettings } from './types';
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
  applyPreset: (preset: 'legal' | 'support' | 'devsecops' | 'all') => void;
  updateSettings: (settings: Partial<TenantSettings>) => void;
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
          return {
            ...t,
            settings: {
              ...t.settings,
              modules: {
                ...t.settings.modules,
                [moduleKey]: enabled,
              },
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
                name: 'LexisAI Legal Intelligence',
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
                name: 'OmniCorp Enterprise Swarm',
                tagline: 'Full Autonomous Operations Suite',
                primaryColor: '#7c3aed',
              };
              break;
          }

          setActiveLocaleState(defaultLocale);

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
          return {
            ...t,
            settings: {
              ...t.settings,
              ...newSettings,
            },
          };
        }
        return t;
      })
    );
  };

  const t = (key: string): string => {
    const localeDict = TRANSLATIONS[activeLocale];
    if (localeDict && localeDict[key]) {
      return localeDict[key];
    }
    // Fallback to English
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
        applyPreset,
        updateSettings,
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
