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

  // Derive current section name for breadcrumb
  let sectionName = 'Overview';
  if (pathname.includes('/documents')) sectionName = 'Document Intelligence';
  else if (pathname.includes('/support')) sectionName = 'Customer Support Swarm';
  else if (pathname.includes('/code-audit')) sectionName = 'Code & Specs Auditor';
  else if (pathname.includes('/settings')) sectionName = 'Workspace Settings';

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-[#0c0e14]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs & Quick Presets */}
      <div className="flex items-center gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 font-medium">{activeTenant.name}</span>
          <ChevronRight className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-100 font-semibold">{sectionName}</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-zinc-800 hidden md:block" />

        {/* 1-Click Demo Switcher Pills */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          <button
            onClick={() => applyPreset('legal')}
            className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] transition-colors border border-zinc-800 hover:border-zinc-700"
            title="Convert workspace into Legal SaaS"
          >
            ⚖️ Legal
          </button>
          <button
            onClick={() => applyPreset('support')}
            className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] transition-colors border border-zinc-800 hover:border-zinc-700"
            title="Convert workspace into Support Swarm"
          >
            🎧 Support
          </button>
          <button
            onClick={() => applyPreset('devsecops')}
            className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] transition-colors border border-zinc-800 hover:border-zinc-700"
            title="Convert workspace into DevSecOps Auditor"
          >
            🛡️ DevSecOps
          </button>
          <button
            onClick={() => applyPreset('all')}
            className="px-2 py-0.5 rounded-md bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-[11px] transition-colors border border-purple-800/50"
            title="Enable all modules"
          >
            🚀 All Modules
          </button>
        </div>
      </div>

      {/* Right: Search Bar, Token Meter, Language Selector */}
      <div className="flex items-center gap-3">
        {/* Command Search Bar Pill */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-900/70 border border-zinc-800/80 rounded-lg px-2.5 py-1 text-xs text-zinc-400 cursor-pointer hover:border-zinc-700 transition-colors">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[11px]">Search commands...</span>
          <kbd className="text-[9px] font-mono bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700 text-zinc-300">
            ⌘K
          </kbd>
        </div>

        {/* Token Budget Meter */}
        <div className="flex items-center gap-2 bg-zinc-900/70 border border-zinc-800/80 rounded-lg px-2.5 py-1 text-xs">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-zinc-200">
              {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()}
            </span>
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Locale Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900/70 border border-zinc-800/80 rounded-lg px-2 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={activeLocale}
            onChange={(e) => setActiveLocale(e.target.value as SupportedLocale)}
            aria-label="Select Operating Language"
            className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <option key={loc.code} value={loc.code} className="bg-zinc-900 text-zinc-100">
                {loc.flag} {loc.nativeName} ({loc.name})
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
