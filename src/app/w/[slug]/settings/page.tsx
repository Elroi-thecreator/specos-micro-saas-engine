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
  Check,
  Sliders,
} from 'lucide-react';

export default function TenantSettingsPage() {
  const { activeTenant, toggleModule, applyPreset, updateSettings, t, activeLocale } = useTenant();
  const settings = activeTenant.settings;
  const modules = settings.modules;

  const [activeTab, setActiveTab] = useState<'modules' | 'presets' | 'identity' | 'quota'>('modules');
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
    <div className="space-y-8 max-w-5xl">
      {/* Settings Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Tenant Scoped &bull; ID: {activeTenant.slug}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('common.saved')}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-1">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'modules'
              ? 'bg-zinc-800 text-white border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          Autonomous Modules
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-zinc-800 text-white border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>1-Click Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'identity'
              ? 'bg-zinc-800 text-white border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          Identity &amp; Localization
        </button>
        <button
          onClick={() => setActiveTab('quota')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'quota'
              ? 'bg-zinc-800 text-white border border-zinc-700/60'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          Token Budget &amp; Quota
        </button>
      </div>

      {/* TAB 1: Autonomous Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="text-xs text-zinc-400">
            Toggle modules on/off. When toggled, the left navigation bar immediately updates to reflect the tenant&apos;s active agent capabilities.
          </div>

          <div className="space-y-3">
            {/* Module 1: Doc Intel */}
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-100">{t('settings.docIntelTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-teal-300 border border-zinc-700">
                      specos-doc-intel
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.docIntelDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('docIntel', !modules.docIntel)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.docIntel ? 'bg-emerald-500' : 'bg-zinc-800'
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
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-100">{t('settings.supportSwarmTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                      3 Kiro Agents Swarm
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.supportSwarmDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('supportSwarm', !modules.supportSwarm)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.supportSwarm ? 'bg-emerald-500' : 'bg-zinc-800'
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
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-100">{t('settings.codeAuditTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-blue-300 border border-zinc-700">
                      Kiro Spec Compliance
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.codeAuditDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('codeAudit', !modules.codeAudit)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.codeAudit ? 'bg-emerald-500' : 'bg-zinc-800'
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
      )}

      {/* TAB 2: 1-Click Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Turnkey Micro-SaaS Presets
            </span>
            <p className="text-xs text-zinc-400 mt-1">
              Clicking a preset will immediately reconfigure this workspace into a specialized vertical Micro-SaaS:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => applyPreset('legal')}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-left transition-all hover:border-teal-500/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-300">⚖️ Legal &amp; Contract SaaS</span>
                <span className="text-[10px] font-mono uppercase text-zinc-400">JA &bull; Doc Intel</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Re-skins workspace to LexisAI Legal Suite in Japanese with Document Intelligence enabled.
              </p>
            </button>

            <button
              onClick={() => applyPreset('support')}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-left transition-all hover:border-amber-500/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300">🎧 Customer Support Swarm</span>
                <span className="text-[10px] font-mono uppercase text-zinc-400">ES &bull; Support Swarm</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Re-skins workspace to AtenciónGlobal in Spanish with autonomous support agents active.
              </p>
            </button>

            <button
              onClick={() => applyPreset('devsecops')}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-left transition-all hover:border-blue-500/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">🛡️ DevSecOps &amp; Specs Auditor</span>
                <span className="text-[10px] font-mono uppercase text-zinc-400">EN &bull; Code Audit</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Re-skins workspace to DevShield Sentinel in English with repository auditing enabled.
              </p>
            </button>

            <button
              onClick={() => applyPreset('all')}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 text-left transition-all hover:border-purple-500/50 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300">🚀 All-in-One Enterprise Swarm</span>
                <span className="text-[10px] font-mono uppercase text-zinc-400">DE &bull; All 3 Enabled</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Re-skins to OmniCorp Global Holdings in German with all 3 autonomous agent modules active.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Identity & Localization */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveBranding} className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Workspace Display Name
              </label>
              <input
                type="text"
                value={brandingName}
                onChange={(e) => setBrandingName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Workspace Mission / Tagline
              </label>
              <input
                type="text"
                value={brandingTagline}
                onChange={(e) => setBrandingTagline(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Default Operating Language
              </label>
              <select
                value={settings.defaultLocale}
                onChange={(e) => updateSettings({ defaultLocale: e.target.value as SupportedLocale })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                {SUPPORTED_LOCALES.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.flag} {loc.nativeName} ({loc.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors"
            >
              Save Identity Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Token Budget & Quota */}
      {activeTab === 'quota' && (
        <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Token Allocation</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Hard limit on autonomous agent LLM token consumption for this tenant.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Current Consumption</span>
              <span className="text-zinc-200">
                {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()} tokens
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Adjust Monthly Quota
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={tokenBudget}
                onChange={(e) => setTokenBudget(Number(e.target.value))}
                className="w-48 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none"
              />
              <button
                onClick={() => {
                  updateSettings({ tokenBudgetMonthly: Number(tokenBudget) });
                  setSavedAlert(true);
                  setTimeout(() => setSavedAlert(false), 3000);
                }}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors"
              >
                Update Quota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
