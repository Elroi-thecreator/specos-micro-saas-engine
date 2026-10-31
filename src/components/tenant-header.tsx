'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/lib/tenant-context';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import { SupportedLocale } from '@/lib/types';
import {
  Globe,
  Coins,
  ChevronRight,
  Bell,
  Search,
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
  Shield,
  Layers,
} from 'lucide-react';

export function TenantHeader() {
  const pathname = usePathname();
  const { activeTenant, activeLocale, setActiveLocale, t } = useTenant();
  const settings = activeTenant.settings;
  const modules = settings.modules;
  const sections = settings.sections || {
    showOverviewKpis: true,
    showLiveAgentFeed: true,
    showRiskMatrix: true,
    showQuickActions: true,
    showTokenMeter: true,
  };

  const usagePercent = Math.min(
    100,
    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
  );

  let sectionName = 'Overview';
  if (pathname.includes('/documents')) sectionName = 'Document Intelligence';
  else if (pathname.includes('/support')) sectionName = 'Customer Support Swarm';
  else if (pathname.includes('/code-audit')) sectionName = 'Code & Specs Auditor';
  else if (pathname.includes('/admin/general')) sectionName = 'Admin: General Profile';
  else if (pathname.includes('/admin/modules')) sectionName = 'Admin: Module Toggles';
  else if (pathname.includes('/admin/sections')) sectionName = 'Admin: Layout Customizer';
  else if (pathname.includes('/admin/billing')) sectionName = 'Admin: Quota & Token Budget';
  else if (pathname.includes('/admin') || pathname.includes('/settings')) sectionName = 'Workspace Admin';

  const isDocActive = pathname.includes('/documents');
  const isSupportActive = pathname.includes('/support');
  const isCodeActive = pathname.includes('/code-audit');
  const isAdminActive = pathname.includes('/admin') || pathname.includes('/settings');

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Breadcrumbs & Separate Individual Application Links */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <Link
            href={`/w/${activeTenant.slug}`}
            className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            {activeTenant.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{sectionName}</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-slate-200 hidden lg:block" />

        {/* Separate Application Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
            Applications:
          </span>

          {/* Doc Intel Application Link */}
          <Link
            href={`/w/${activeTenant.slug}/documents`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              isDocActive
                ? 'bg-teal-50 text-teal-800 border border-teal-300 font-semibold shadow-xs'
                : modules.docIntel
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200/60 hover:text-slate-600'
            }`}
            title="Legal & Contract Risk Intelligence Application"
          >
            <FileText className={`w-3 h-3 ${modules.docIntel ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Documents</span>
            {modules.docIntel && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
          </Link>

          {/* Customer Support Swarm Application Link */}
          <Link
            href={`/w/${activeTenant.slug}/support`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              isSupportActive
                ? 'bg-amber-50 text-amber-800 border border-amber-300 font-semibold shadow-xs'
                : modules.supportSwarm
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200/60 hover:text-slate-600'
            }`}
            title="Multilingual Customer Support Swarm Application"
          >
            <MessageSquare className={`w-3 h-3 ${modules.supportSwarm ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Support</span>
            {modules.supportSwarm && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          </Link>

          {/* Code & Specs Auditor Application Link */}
          <Link
            href={`/w/${activeTenant.slug}/code-audit`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              isCodeActive
                ? 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold shadow-xs'
                : modules.codeAudit
                ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200/60 hover:text-slate-600'
            }`}
            title="Code Quality & Spec Compliance Auditor Application"
          >
            <ShieldAlert className={`w-3 h-3 ${modules.codeAudit ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Code Audit</span>
            {modules.codeAudit && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
          </Link>

          {/* Separated Tenant Admin Link */}
          <Link
            href={`/w/${activeTenant.slug}/admin/general`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              isAdminActive
                ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
            title="Tenant Workspace Admin"
          >
            <Settings className="w-3 h-3 text-slate-500" />
            <span>Admin</span>
          </Link>
        </nav>
      </div>

      {/* Right: Search, Token Meter, Language Selector & Super Admin Button */}
      <div className="flex items-center gap-3">
        {/* Direct Super Admin Link */}
        <Link
          href="/super-admin"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-xs"
          title="Platform Super Admin Console"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Super Admin</span>
        </Link>

        {/* Command Search Bar Pill */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">Search commands...</span>
          <kbd className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 shadow-xs">
            ⌘K
          </kbd>
        </div>

        {/* Token Budget Meter (conditionally shown based on section config) */}
        {sections.showTokenMeter !== false && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-xs">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-slate-800 font-semibold">
                {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()}
              </span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Locale Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs shadow-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-600" />
          <select
            value={activeLocale}
            onChange={(e) => setActiveLocale(e.target.value as SupportedLocale)}
            aria-label="Select Operating Language"
            className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <option key={loc.code} value={loc.code} className="bg-white text-slate-900">
                {loc.flag} {loc.nativeName} ({loc.name})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
