'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/lib/tenant-context';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import { SupportedLocale } from '@/lib/types';
import {
  Globe,
  Coins,
  ShieldCheck,
  Search,
  Command,
  Zap,
  ChevronRight,
  Bell,
  Sparkles,
} from 'lucide-react';

export function TenantHeader() {
  const pathname = usePathname();
  const { activeTenant, activeLocale, setActiveLocale, applyPreset, t } = useTenant();
  const settings = activeTenant.settings;

  const usagePercent = Math.min(
    100,
    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
  );

  let sectionName = 'Overview';
  if (pathname.includes('/documents')) sectionName = 'Document Intelligence';
  else if (pathname.includes('/support')) sectionName = 'Customer Support Swarm';
  else if (pathname.includes('/code-audit')) sectionName = 'Code & Specs Auditor';
  else if (pathname.includes('/settings')) sectionName = 'Workspace Settings';

  return (
    <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Breadcrumbs & Quick Presets */}
      <div className="flex items-center gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">{activeTenant.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{sectionName}</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-slate-200 hidden md:block" />

        {/* 1-Click Demo Switcher Pills */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <Zap className="w-3 h-3 text-amber-500" /> Presets:
          </span>
          <button
            onClick={() => applyPreset('legal')}
            className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] transition-colors border border-slate-200 hover:border-slate-300 font-medium"
            title="Convert workspace into Legal SaaS"
          >
            ⚖️ Legal
          </button>
          <button
            onClick={() => applyPreset('support')}
            className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] transition-colors border border-slate-200 hover:border-slate-300 font-medium"
            title="Convert workspace into Support Swarm"
          >
            🎧 Support
          </button>
          <button
            onClick={() => applyPreset('devsecops')}
            className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] transition-colors border border-slate-200 hover:border-slate-300 font-medium"
            title="Convert workspace into DevSecOps Auditor"
          >
            🛡️ DevSecOps
          </button>
          <button
            onClick={() => applyPreset('all')}
            className="px-2 py-0.5 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] transition-colors border border-purple-200 font-medium"
            title="Enable all modules"
          >
            🚀 All Modules
          </button>
        </div>
      </div>

      {/* Right: Search Bar, Token Meter, Language Selector */}
      <div className="flex items-center gap-3">
        {/* Command Search Bar Pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 cursor-pointer hover:border-slate-300 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px]">Search commands...</span>
          <kbd className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 shadow-xs">
            ⌘K
          </kbd>
        </div>

        {/* Token Budget Meter */}
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
