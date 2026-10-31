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
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1 font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Tenant Scoped &bull; ID: {activeTenant.slug}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('common.saved')}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('modules')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'modules'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Autonomous Modules
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'presets'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>1-Click Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'identity'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Identity &amp; Localization
        </button>
        <button
          onClick={() => setActiveTab('quota')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'quota'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Token Budget &amp; Quota
        </button>
      </div>

      {/* TAB 1: Autonomous Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            Toggle modules on/off. When toggled, the left navigation bar immediately updates to reflect the tenant&apos;s active agent capabilities.
          </div>

          <div className="space-y-3">
            {/* Module 1: Doc Intel */}
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-950">{t('settings.docIntelTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-teal-800 border border-slate-200 font-semibold">
                      specos-doc-intel
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.docIntelDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('docIntel', !modules.docIntel)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.docIntel ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
                    modules.docIntel ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Module 2: Support Swarm */}
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-950">{t('settings.supportSwarmTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-amber-800 border border-slate-200 font-semibold">
                      3 Kiro Agents Swarm
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.supportSwarmDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('supportSwarm', !modules.supportSwarm)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.supportSwarm ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
                    modules.supportSwarm ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Module 3: Code Audit */}
            <div className="flex items-start justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-950">{t('settings.codeAuditTitle')}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-blue-800 border border-slate-200 font-semibold">
                      Kiro Spec Compliance
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.codeAuditDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleModule('codeAudit', !modules.codeAudit)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  modules.codeAudit ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-xs ${
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
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50">
            <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              Turnkey Micro-SaaS Presets
            </span>
            <p className="text-xs text-amber-700 mt-1">
              Clicking a preset will immediately reconfigure this workspace into a specialized vertical Micro-SaaS:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => applyPreset('legal')}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-teal-400 text-left transition-all shadow-xs hover:shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-800">⚖️ Legal &amp; Contract SaaS</span>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">JA &bull; Doc Intel</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Re-skins workspace to LexisAI Legal Suite in Japanese with Document Intelligence enabled.
              </p>
            </button>

            <button
              onClick={() => applyPreset('support')}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 text-left transition-all shadow-xs hover:shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800">🎧 Customer Support Swarm</span>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">ES &bull; Support Swarm</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Re-skins workspace to AtenciónGlobal in Spanish with autonomous support agents active.
              </p>
            </button>

            <button
              onClick={() => applyPreset('devsecops')}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 text-left transition-all shadow-xs hover:shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-800">🛡️ DevSecOps &amp; Specs Auditor</span>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">EN &bull; Code Audit</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Re-skins workspace to DevShield Sentinel in English with repository auditing enabled.
              </p>
            </button>

            <button
              onClick={() => applyPreset('all')}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-purple-400 text-left transition-all shadow-xs hover:shadow-sm group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-800">🚀 All-in-One Enterprise Swarm</span>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">DE &bull; All 3 Enabled</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Re-skins to OmniCorp Global Holdings in German with all 3 autonomous agent modules active.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Identity & Localization */}
      {activeTab === 'identity' && (
        <form onSubmit={handleSaveBranding} className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Workspace Display Name
              </label>
              <input
                type="text"
                value={brandingName}
                onChange={(e) => setBrandingName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Workspace Mission / Tagline
              </label>
              <input
                type="text"
                value={brandingTagline}
                onChange={(e) => setBrandingTagline(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Default Operating Language
              </label>
              <select
                value={settings.defaultLocale}
                onChange={(e) => updateSettings({ defaultLocale: e.target.value as SupportedLocale })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 cursor-pointer"
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
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Save Identity Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Token Budget & Quota */}
      {activeTab === 'quota' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-950">Monthly Token Allocation</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Hard limit on autonomous agent LLM token consumption for this tenant.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">Current Consumption</span>
              <span className="text-slate-950 font-semibold">
                {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()} tokens
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
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
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Adjust Monthly Quota
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={tokenBudget}
                onChange={(e) => setTokenBudget(Number(e.target.value))}
                className="w-48 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-500"
              />
              <button
                onClick={() => {
                  updateSettings({ tokenBudgetMonthly: Number(tokenBudget) });
                  setSavedAlert(true);
                  setTimeout(() => setSavedAlert(false), 3000);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors border border-slate-300"
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
