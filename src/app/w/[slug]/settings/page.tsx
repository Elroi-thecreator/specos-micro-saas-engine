'use client';

import React, { useState } from 'react';
import { useTenant } from '@/lib/tenant-context';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import { SupportedLocale } from '@/lib/types';
import {
  Settings,
  FileText,
  MessageSquare,
  ShieldAlert,
  Globe,
  Coins,
  CheckCircle2,
  Sparkles,
  Zap,
  Palette,
  ShieldCheck,
} from 'lucide-react';

export default function TenantSettingsPage() {
  const { activeTenant, toggleModule, applyPreset, updateSettings, t, activeLocale } = useTenant();
  const settings = activeTenant.settings;
  const modules = settings.modules;

  const [savedAlert, setSavedAlert] = useState(false);
  const [brandingName, setBrandingName] = useState(settings.branding.name);
  const [brandingTagline, setBrandingTagline] = useState(settings.branding.tagline);
  const [tokenBudget, setTokenBudget] = useState(settings.tokenBudgetMonthly);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      branding: {
        ...settings.branding,
        name: brandingName,
        tagline: brandingTagline,
      },
      tokenBudgetMonthly: Number(tokenBudget),
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-2">
          <Settings className="w-4 h-4" />
          <span>Tenant Configuration &bull; ID: {activeTenant.slug}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {savedAlert && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('common.saved')}</span>
        </div>
      )}

      {/* SECTION 1: 1-Click Presets for Hackathon Demo */}
      <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 backdrop-blur">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <Zap className="w-4 h-4" />
          <span>{t('presets.title')}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {t('presets.desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <button
            onClick={() => applyPreset('legal')}
            className="p-3.5 rounded-xl border border-teal-800/60 bg-teal-950/40 hover:bg-teal-900/40 text-left transition-all hover:scale-[1.02]"
          >
            <div className="font-bold text-xs text-teal-300">{t('presets.legal')}</div>
            <div className="text-[11px] text-teal-400/80 mt-1">Doc Intel &bull; Japanese</div>
          </button>

          <button
            onClick={() => applyPreset('support')}
            className="p-3.5 rounded-xl border border-amber-800/60 bg-amber-950/40 hover:bg-amber-900/40 text-left transition-all hover:scale-[1.02]"
          >
            <div className="font-bold text-xs text-amber-300">{t('presets.support')}</div>
            <div className="text-[11px] text-amber-400/80 mt-1">Support Swarm &bull; Spanish</div>
          </button>

          <button
            onClick={() => applyPreset('devsecops')}
            className="p-3.5 rounded-xl border border-blue-800/60 bg-blue-950/40 hover:bg-blue-900/40 text-left transition-all hover:scale-[1.02]"
          >
            <div className="font-bold text-xs text-blue-300">{t('presets.devsecops')}</div>
            <div className="text-[11px] text-blue-400/80 mt-1">Code &amp; Specs &bull; English</div>
          </button>

          <button
            onClick={() => applyPreset('all')}
            className="p-3.5 rounded-xl border border-purple-800/60 bg-purple-950/40 hover:bg-purple-900/40 text-left transition-all hover:scale-[1.02]"
          >
            <div className="font-bold text-xs text-purple-300">{t('presets.all')}</div>
            <div className="text-[11px] text-purple-400/80 mt-1">All 3 Enabled &bull; Enterprise</div>
          </button>
        </div>
      </div>

      {/* SECTION 2: Dynamic Module Toggles */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            {t('settings.modulesTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t('settings.modulesSubtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {/* Module 1: Doc Intel */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200">{t('settings.docIntelTitle')}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {t('settings.docIntelDesc')}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  Kiro Spec: specos-doc-intel
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleModule('docIntel', !modules.docIntel)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                modules.docIntel ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  modules.docIntel ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Module 2: Support Swarm */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200">{t('settings.supportSwarmTitle')}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {t('settings.supportSwarmDesc')}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Kiro Crew: 3 Swarm Agents
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleModule('supportSwarm', !modules.supportSwarm)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                modules.supportSwarm ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  modules.supportSwarm ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Module 3: Code Audit */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-200">{t('settings.codeAuditTitle')}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {t('settings.codeAuditDesc')}
                </p>
                <span className="inline-block mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Steering: tenancy &amp; i18n
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleModule('codeAudit', !modules.codeAudit)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                modules.codeAudit ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  modules.codeAudit ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Workspace Localization & Branding */}
      <form onSubmit={handleSaveBranding} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            Workspace Identity &amp; Localization
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize how your tenants and users experience the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Display Brand Name
            </label>
            <input
              type="text"
              value={brandingName}
              onChange={(e) => setBrandingName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tagline / Mission
            </label>
            <input
              type="text"
              value={brandingTagline}
              onChange={(e) => setBrandingTagline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Default Operating Language (i18n)
            </label>
            <select
              value={settings.defaultLocale}
              onChange={(e) => updateSettings({ defaultLocale: e.target.value as SupportedLocale })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.flag} {loc.nativeName} ({loc.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Monthly LLM Token Budget Limit
            </label>
            <input
              type="number"
              value={tokenBudget}
              onChange={(e) => setTokenBudget(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-950"
          >
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
