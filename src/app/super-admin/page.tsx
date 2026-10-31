'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTenant } from '@/lib/tenant-context';
import { SupportedLocale, ModuleKey, TenantSectionConfig, TenantModuleCustomConfig } from '@/lib/types';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import {
  Shield,
  Building,
  PlusCircle,
  Search,
  CheckCircle2,
  ExternalLink,
  Sliders,
  SlidersHorizontal,
  Coins,
  Globe,
  Trash2,
  Sparkles,
  ArrowRight,
  Layers,
  Activity,
  Check,
  FileText,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

function SuperAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'new' ? 'new' : 'fleet';

  const { tenants, createTenant, deleteTenant, setActiveTenantBySlug } = useTenant();

  const [activeTab, setActiveTab] = useState<'fleet' | 'new'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [provisionSuccessSlug, setProvisionSuccessSlug] = useState<string | null>(null);

  // Form State for Creating New Tenant
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tier, setTier] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [tagline, setTagline] = useState('Autonomous Micro-SaaS Operations Suite');
  const [defaultLocale, setDefaultLocale] = useState<SupportedLocale>('en');
  const [tokenBudgetMonthly, setTokenBudgetMonthly] = useState(250000);

  // Configurable Sections
  const [sections, setSections] = useState<TenantSectionConfig>({
    showOverviewKpis: true,
    showLiveAgentFeed: true,
    showRiskMatrix: true,
    showQuickActions: true,
    showTokenMeter: true,
  });

  // Configurable Modules
  const [modules, setModules] = useState<{
    docIntel: boolean;
    supportSwarm: boolean;
    codeAudit: boolean;
  }>({
    docIntel: true,
    supportSwarm: false,
    codeAudit: false,
  });

  // Module Specific Settings
  const [moduleConfig, setModuleConfig] = useState<TenantModuleCustomConfig>({
    docIntelSensitivity: 'Standard',
    supportAutoReplyThreshold: 85,
    codeAuditStrictBranchProtection: true,
  });

  // Auto-slugify on name change
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  // 1-Click Industry Template Handlers
  const applyTemplate = (type: 'legal' | 'support' | 'devsecops' | 'enterprise') => {
    switch (type) {
      case 'legal':
        setName('Apex Legal Intelligence');
        setSlug('apex-legal');
        setTier('Enterprise');
        setPrimaryColor('#0f766e');
        setTagline('Autonomous Contract Governance & High-Risk SLA Triage');
        setDefaultLocale('ja');
        setTokenBudgetMonthly(300000);
        setModules({ docIntel: true, supportSwarm: false, codeAudit: false });
        setSections({
          showOverviewKpis: true,
          showLiveAgentFeed: true,
          showRiskMatrix: true,
          showQuickActions: true,
          showTokenMeter: true,
        });
        setModuleConfig({ docIntelSensitivity: 'Strict' });
        break;
      case 'support':
        setName('Zenith Customer Swarm');
        setSlug('zenith-support');
        setTier('Pro');
        setPrimaryColor('#d97706');
        setTagline('Autonomous Multi-Agent Global Customer Operations');
        setDefaultLocale('es');
        setTokenBudgetMonthly(150000);
        setModules({ docIntel: false, supportSwarm: true, codeAudit: false });
        setSections({
          showOverviewKpis: true,
          showLiveAgentFeed: true,
          showRiskMatrix: false,
          showQuickActions: true,
          showTokenMeter: true,
        });
        setModuleConfig({ supportAutoReplyThreshold: 90 });
        break;
      case 'devsecops':
        setName('Kiro Sentinel DevSecOps');
        setSlug('kiro-sentinel');
        setTier('Pro');
        setPrimaryColor('#2563eb');
        setTagline('Autonomous Architecture & Kiro Spec Compliance Governance');
        setDefaultLocale('en');
        setTokenBudgetMonthly(200000);
        setModules({ docIntel: false, supportSwarm: false, codeAudit: true });
        setSections({
          showOverviewKpis: true,
          showLiveAgentFeed: true,
          showRiskMatrix: false,
          showQuickActions: true,
          showTokenMeter: true,
        });
        setModuleConfig({ codeAuditStrictBranchProtection: true });
        break;
      case 'enterprise':
        setName('Global Frontier Holdings');
        setSlug('frontier-global');
        setTier('Enterprise');
        setPrimaryColor('#7c3aed');
        setTagline('Full Autonomous Enterprise Suite with Multi-Agent Swarms');
        setDefaultLocale('de');
        setTokenBudgetMonthly(750000);
        setModules({ docIntel: true, supportSwarm: true, codeAudit: true });
        setSections({
          showOverviewKpis: true,
          showLiveAgentFeed: true,
          showRiskMatrix: true,
          showQuickActions: true,
          showTokenMeter: true,
        });
        setModuleConfig({
          docIntelSensitivity: 'Strict',
          supportAutoReplyThreshold: 90,
          codeAuditStrictBranchProtection: true,
        });
        break;
    }
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTenant = createTenant({
      name: name.trim(),
      slug: slug.trim(),
      tier,
      settings: {
        modules,
        sections,
        moduleConfig,
        defaultLocale,
        tokenBudgetMonthly,
        branding: {
          name: name.trim(),
          tagline,
          primaryColor,
        },
      },
    });

    setProvisionSuccessSlug(newTenant.slug);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTokensCapacity = tenants.reduce((acc, t) => acc + t.settings.tokenBudgetMonthly, 0);
  const totalTokensUsed = tenants.reduce((acc, t) => acc + t.settings.tokensConsumed, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Super Admin Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-950 tracking-tight">
                  SpecOS Platform Control Plane
                </span>
                <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Multi-Tenant Provisioning, Governance &amp; Section Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Public Directory
            </Link>
            {tenants.length > 0 && (
              <Link
                href={`/w/${tenants[0].slug}`}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                Go to Active Workspace &rarr;
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Platform Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Organizations</span>
              <Building className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-950">{tenants.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-mono font-medium">
              100% RLS Partitioned
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Platform Token Quota</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-950">
              {totalTokensCapacity.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block font-mono font-medium">
              {totalTokensUsed.toLocaleString()} tokens debited
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Tenant Isolation</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700">ARCH-001</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-mono font-medium">
              Zero cross-tenant leakage
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Supported Locales</span>
              <Globe className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-950">7</div>
            <span className="text-[11px] text-slate-500 mt-1 block font-mono font-medium">
              EN, ES, FR, DE, JA, HI, AR (RTL)
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fleet')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fleet'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Organization Fleet ({tenants.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Provision New Tenant &amp; Configure Sections</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FLEET REGISTRY */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search organizations by name, slug, tier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 focus:outline-indigo-500"
                />
              </div>

              <button
                onClick={() => setActiveTab('new')}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Tenant</span>
              </button>
            </div>

            {/* Tenants Table */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Organization &amp; Slug</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Default Language</th>
                      <th className="py-3 px-4">Active Modules</th>
                      <th className="py-3 px-4">Configured Sections</th>
                      <th className="py-3 px-4">Token Budget</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTenants.map((t) => {
                      const enabledMods = Object.entries(t.settings.modules).filter(([, v]) => v).map(([k]) => k);
                      const enabledSecs = Object.entries(t.settings.sections || {}).filter(([, v]) => v).length;
                      const usageRatio = Math.round((t.settings.tokensConsumed / t.settings.tokenBudgetMonthly) * 100);

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px] shadow-xs shrink-0"
                                style={{ backgroundColor: t.settings.branding.primaryColor || '#2563eb' }}
                              >
                                {t.name.slice(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 block">{t.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">/w/{t.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                              {t.tier}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-semibold uppercase text-slate-700">
                            {t.settings.defaultLocale}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {t.settings.modules.docIntel && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                                  Legal
                                </span>
                              )}
                              {t.settings.modules.supportSwarm && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                                  Support
                                </span>
                              )}
                              {t.settings.modules.codeAudit && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                  Auditor
                                </span>
                              )}
                              {enabledMods.length === 0 && (
                                <span className="text-slate-400 text-[10px] italic">None</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {enabledSecs} / 5 sections
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-700 font-semibold block">
                                {t.settings.tokensConsumed.toLocaleString()} / {t.settings.tokenBudgetMonthly.toLocaleString()} ({usageRatio}%)
                              </span>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${usageRatio > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${Math.min(100, usageRatio)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/w/${t.slug}`}
                                onClick={() => setActiveTenantBySlug(t.slug)}
                                className="px-2.5 py-1 rounded bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shadow-xs"
                                title="Open Workspace"
                              >
                                <span>Launch</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>

                              <Link
                                href={`/w/${t.slug}/admin/sections`}
                                className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Configure Dashboard Sections"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </Link>

                              {tenants.length > 1 && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete workspace "${t.name}"?`)) {
                                      deleteTenant(t.slug);
                                    }
                                  }}
                                  className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                  title="Delete Tenant"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROVISION NEW TENANT & CONFIGURE SECTIONS */}
        {activeTab === 'new' && (
          <div className="space-y-6">
            {/* Success Banner if just created */}
            {provisionSuccessSlug && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm">Tenant Provisioned Successfully!</h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      New isolated tenant workspace is live at <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">/w/{provisionSuccessSlug}</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setProvisionSuccessSlug(null);
                      setActiveTab('fleet');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50"
                  >
                    Fleet Overview
                  </button>
                  <Link
                    href={`/w/${provisionSuccessSlug}`}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                  >
                    <span>Launch Workspace Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 1-Click Industry Templates */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Quick Start: 1-Click Industry Configuration Templates</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-populate identity, language, enabled modules, and section visibility with one click.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => applyTemplate('legal')}
                  className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-50 text-left transition-all group shadow-xs"
                >
                  <span className="text-xs font-bold text-teal-900 block group-hover:text-teal-700">
                    ⚖️ Legal Tech Firm
                  </span>
                  <span className="text-[11px] text-teal-700 mt-0.5 block">
                    Japanese / Strict Risk / Contract Intelligence
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate('support')}
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition-all group shadow-xs"
                >
                  <span className="text-xs font-bold text-amber-900 block group-hover:text-amber-700">
                    🎧 Customer Ops Swarm
                  </span>
                  <span className="text-[11px] text-amber-700 mt-0.5 block">
                    Spanish / 90% SLA / Multi-Agent Triage
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate('devsecops')}
                  className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-left transition-all group shadow-xs"
                >
                  <span className="text-xs font-bold text-blue-900 block group-hover:text-blue-700">
                    🛡️ DevSecOps Sentinel
                  </span>
                  <span className="text-[11px] text-blue-700 mt-0.5 block">
                    English / Strict Rules / Code &amp; Specs Auditor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => applyTemplate('enterprise')}
                  className="p-3 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-left transition-all group shadow-xs"
                >
                  <span className="text-xs font-bold text-purple-900 block group-hover:text-purple-700">
                    🚀 Full Enterprise Suite
                  </span>
                  <span className="text-[11px] text-purple-700 mt-0.5 block">
                    German / 750k Quota / All Modules &amp; Sections
                  </span>
                </button>
              </div>
            </div>

            {/* Creation Grid: Form on Left, Live Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Configuration Form */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
                <form onSubmit={handleCreateTenant} className="space-y-6">
                  {/* Section 1: Organization Profile */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>1. Organization &amp; Branding</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Acme Health AI"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Workspace URL Slug
                        </label>
                        <div className="flex items-center">
                          <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-2 py-2 rounded-l-lg border border-r-0 border-slate-200">
                            /w/
                          </span>
                          <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="acme-health"
                            className="w-full px-3 py-2 rounded-r-lg border border-slate-200 text-xs font-mono bg-slate-50 focus:bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subscription Tier
                        </label>
                        <select
                          value={tier}
                          onChange={(e) => setTier(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
                        >
                          <option value="Starter">Starter (Small Team)</option>
                          <option value="Pro">Pro (High Velocity)</option>
                          <option value="Enterprise">Enterprise (Full Compliance)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Primary Branding Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Workspace Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Tagline shown in workspace header"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Section 2: Localization */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>2. Internationalization &amp; Locale</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Default Workspace Operating Language
                      </label>
                      <select
                        value={defaultLocale}
                        onChange={(e) => setDefaultLocale(e.target.value as SupportedLocale)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
                      >
                        {SUPPORTED_LOCALES.map((loc) => (
                          <option key={loc.code} value={loc.code}>
                            {loc.flag} {loc.name} ({loc.nativeName}) {loc.dir === 'rtl' ? '— RTL' : ''}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Autonomous agents will generate responses and risk assessments in this language by default.
                      </span>
                    </div>
                  </div>

                  {/* Section 3: Configurable Sections & Dashboard Widgets */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                      <span>3. Configurable Dashboard Sections &amp; Layout</span>
                    </h4>

                    <div className="space-y-2.5">
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Executive KPI Metrics Ribbon
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Show top metric cards (Active Modules, Tokens, Locale, Isolation status)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={sections.showOverviewKpis}
                          onChange={(e) =>
                            setSections((prev) => ({ ...prev, showOverviewKpis: e.target.checked }))
                          }
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Live Agent Activity Stream
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Show real-time event feed for agent actions and background worker jobs
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={sections.showLiveAgentFeed}
                          onChange={(e) =>
                            setSections((prev) => ({ ...prev, showLiveAgentFeed: e.target.checked }))
                          }
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Risk Governance &amp; Compliance Matrix
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Display cross-audit compliance scores and high-risk flags overview
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={sections.showRiskMatrix}
                          onChange={(e) =>
                            setSections((prev) => ({ ...prev, showRiskMatrix: e.target.checked }))
                          }
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Quick Action Launchpad
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Show interactive trigger cards for instant agent runs
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={sections.showQuickActions}
                          onChange={(e) =>
                            setSections((prev) => ({ ...prev, showQuickActions: e.target.checked }))
                          }
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Header Token Budget Meter
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Display token consumption progress bar in the top navigation bar
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={sections.showTokenMeter}
                          onChange={(e) =>
                            setSections((prev) => ({ ...prev, showTokenMeter: e.target.checked }))
                          }
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Section 4: Autonomous Modules */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>4. Autonomous Agent Modules</span>
                    </h4>

                    <div className="space-y-3">
                      {/* Doc Intel Toggle */}
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-bold text-slate-900">
                              Document &amp; Contract Intelligence
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={modules.docIntel}
                            onChange={(e) =>
                              setModules((prev) => ({ ...prev, docIntel: e.target.checked }))
                            }
                            className="w-4 h-4 text-teal-600 rounded border-slate-300"
                          />
                        </label>
                        {modules.docIntel && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Risk Sensitivity Threshold:</span>
                            <select
                              value={moduleConfig.docIntelSensitivity}
                              onChange={(e) =>
                                setModuleConfig((prev) => ({
                                  ...prev,
                                  docIntelSensitivity: e.target.value as any,
                                }))
                              }
                              className="px-2 py-0.5 rounded border border-slate-200 text-[11px] bg-slate-50"
                            >
                              <option value="Standard">Standard</option>
                              <option value="Strict">Strict (Zero-Tolerance)</option>
                              <option value="Lenient">Lenient</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Support Swarm Toggle */}
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-slate-900">
                              Customer Support Swarm
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={modules.supportSwarm}
                            onChange={(e) =>
                              setModules((prev) => ({ ...prev, supportSwarm: e.target.checked }))
                            }
                            className="w-4 h-4 text-amber-600 rounded border-slate-300"
                          />
                        </label>
                        {modules.supportSwarm && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Auto-Reply Confidence:</span>
                            <select
                              value={moduleConfig.supportAutoReplyThreshold}
                              onChange={(e) =>
                                setModuleConfig((prev) => ({
                                  ...prev,
                                  supportAutoReplyThreshold: Number(e.target.value),
                                }))
                              }
                              className="px-2 py-0.5 rounded border border-slate-200 text-[11px] bg-slate-50"
                            >
                              <option value="80">80% Confidence</option>
                              <option value="85">85% Confidence</option>
                              <option value="90">90% High Confidence</option>
                              <option value="95">95% Strict Verification</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Code Audit Toggle */}
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-slate-900">
                              Code Quality &amp; Specs Auditor
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={modules.codeAudit}
                            onChange={(e) =>
                              setModules((prev) => ({ ...prev, codeAudit: e.target.checked }))
                            }
                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Monthly Token Quota */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-slate-400" />
                      <span>5. Monthly Token Quota Allocation</span>
                    </h4>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Monthly Budget (Tokens):</span>
                        <span className="font-mono font-bold text-indigo-700">
                          {tokenBudgetMonthly.toLocaleString()} tokens
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="1000000"
                        step="25000"
                        value={tokenBudgetMonthly}
                        onChange={(e) => setTokenBudgetMonthly(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Provision Tenant Workspace &amp; Launch</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Live Real-time Workspace Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="sticky top-20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Live Workspace Preview</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Real-time Sync
                    </span>
                  </div>

                  {/* Simulated Workspace Preview Container */}
                  <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-sm">
                    {/* Simulated Header */}
                    <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shadow-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {(name || 'Org').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-xs text-slate-900 truncate max-w-[150px]">
                          {name || 'New Organization'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono font-semibold">
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {tier}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 uppercase">
                          {defaultLocale}
                        </span>
                      </div>
                    </div>

                    {/* Preview Body */}
                    <div className="p-4 space-y-4 text-xs">
                      {/* Workspace Title Card */}
                      <div
                        className="p-3 rounded-xl border border-slate-200 text-slate-900 bg-white"
                        style={{ borderLeftWidth: 4, borderLeftColor: primaryColor }}
                      >
                        <h4 className="font-extrabold text-sm text-slate-950">
                          {name || 'Workspace Preview'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {tagline || 'Autonomous operations suite'}
                        </p>
                      </div>

                      {/* Configured Sections Preview */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Visible Sections &amp; Widgets
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className={`p-2 rounded-lg border text-[11px] ${
                              sections.showOverviewKpis
                                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-50 border-slate-200/50 text-slate-400 line-through'
                            }`}
                          >
                            KPI Metrics Ribbon
                          </div>

                          <div
                            className={`p-2 rounded-lg border text-[11px] ${
                              sections.showLiveAgentFeed
                                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-50 border-slate-200/50 text-slate-400 line-through'
                            }`}
                          >
                            Live Agent Stream
                          </div>

                          <div
                            className={`p-2 rounded-lg border text-[11px] ${
                              sections.showRiskMatrix
                                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-50 border-slate-200/50 text-slate-400 line-through'
                            }`}
                          >
                            Risk Matrix
                          </div>

                          <div
                            className={`p-2 rounded-lg border text-[11px] ${
                              sections.showQuickActions
                                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold'
                                : 'bg-slate-50 border-slate-200/50 text-slate-400 line-through'
                            }`}
                          >
                            Quick Actions
                          </div>
                        </div>
                      </div>

                      {/* Active Modules Preview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Active Agent Modules
                        </span>

                        <div className="space-y-1 font-mono text-[11px]">
                          {modules.docIntel && (
                            <div className="flex items-center justify-between p-2 rounded bg-teal-50 border border-teal-200 text-teal-800">
                              <span>⚖️ Document Intelligence</span>
                              <span className="text-[9px] bg-teal-200/70 px-1.5 py-0.2 rounded font-sans">
                                {moduleConfig.docIntelSensitivity}
                              </span>
                            </div>
                          )}

                          {modules.supportSwarm && (
                            <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200 text-amber-800">
                              <span>🎧 Support Swarm</span>
                              <span className="text-[9px] bg-amber-200/70 px-1.5 py-0.2 rounded font-sans">
                                {moduleConfig.supportAutoReplyThreshold}% auto
                              </span>
                            </div>
                          )}

                          {modules.codeAudit && (
                            <div className="flex items-center justify-between p-2 rounded bg-blue-50 border border-blue-200 text-blue-800">
                              <span>🛡️ Code &amp; Specs Auditor</span>
                              <span className="text-[9px] bg-blue-200/70 px-1.5 py-0.2 rounded font-sans">
                                Kiro SpecOS
                              </span>
                            </div>
                          )}

                          {!modules.docIntel && !modules.supportSwarm && !modules.codeAudit && (
                            <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-400 italic text-center">
                              No modules enabled
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Token Quota Preview */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center justify-between">
                        <span>Allocated Token Quota:</span>
                        <span className="font-bold text-indigo-700">
                          {tokenBudgetMonthly.toLocaleString()} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Loading SpecOS Control Plane...</span>
          </div>
        </div>
      }
    >
      <SuperAdminContent />
    </Suspense>
  );
}
