'use client';

import React from 'react';
import { useTenant } from '@/lib/tenant-context';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import { SupportedLocale } from '@/lib/types';
import { Globe, Coins, ShieldCheck, Zap } from 'lucide-react';

export function TenantHeader() {
  const { activeTenant, activeLocale, setActiveLocale, applyPreset, t } = useTenant();
  const settings = activeTenant.settings;

  const usagePercent = Math.min(
    100,
    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
  );

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Active Workspace Pill & Presets */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">{t('header.currentTenant')}:</span>
          <span className="font-semibold text-slate-200">{activeTenant.name}</span>
        </div>

        {/* Quick Preset Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-2">
            <Zap className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          <button
            onClick={() => applyPreset('legal')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
            title="Convert workspace into Legal SaaS"
          >
            ⚖️ Legal
          </button>
          <button
            onClick={() => applyPreset('support')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
            title="Convert workspace into Support Swarm"
          >
            🎧 Support
          </button>
          <button
            onClick={() => applyPreset('devsecops')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
            title="Convert workspace into DevSecOps Auditor"
          >
            🛡️ DevSecOps
          </button>
          <button
            onClick={() => applyPreset('all')}
            className="px-2 py-1 rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-[11px] transition-colors border border-purple-800/50"
            title="Enable all modules"
          >
            🚀 All-in-One
          </button>
        </div>
      </div>

      {/* Right: Token Ledger & Language Switcher */}
      <div className="flex items-center gap-4">
        {/* Token Budget Meter */}
        <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-slate-400">{t('header.tokensUsed')}</span>
              <span className="font-mono text-slate-200">
                {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()}
              </span>
            </div>
            <div className="w-32 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usagePercent > 85 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Locale Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={activeLocale}
            onChange={(e) => setActiveLocale(e.target.value as SupportedLocale)}
            aria-label="Select Operating Language"
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <option key={loc.code} value={loc.code} className="bg-slate-900 text-slate-200">
                {loc.flag} {loc.nativeName} ({loc.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
