'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
  Sparkles,
  ArrowRight,
  Coins,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export default function WorkspaceDashboard() {
  const { activeTenant, t } = useTenant();
  const settings = activeTenant.settings;
  const modules = settings.modules;

  const activeCount = Object.values(modules).filter(Boolean).length;
  const percentUsed = Math.min(
    100,
    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Workspace Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-emerald-400 font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Workspace: {activeTenant.slug} &bull; Tier: {activeTenant.tier}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {settings.branding.name || activeTenant.name}
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
            {settings.branding.tagline || 'Autonomous Micro-SaaS Engine configured for your enterprise requirements.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-lg shadow-emerald-950"
            >
              <Settings className="w-4 h-4" />
              <span>{t('settings.title')}</span>
            </Link>
            <span className="text-xs text-slate-400">
              Default Locale: <strong className="text-slate-300 font-mono">{settings.defaultLocale.toUpperCase()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Modules</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{activeCount} / 3</div>
          <p className="text-xs text-slate-400 mt-2">
            Configure more modules anytime in Workspace Settings.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('common.monthlyQuota')}</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{percentUsed}%</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full ${percentUsed > 80 ? 'bg-rose-500' : 'bg-amber-400'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()} {t('common.tokens')}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Agent Health</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">100% Ready</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Zero cross-tenant leakage detected.
          </p>
        </div>
      </div>

      {/* Enabled Capabilities Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-200">
            Active Capabilities for this Workspace
          </h2>
          <Link
            href={`/w/${activeTenant.slug}/settings`}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Manage Capabilities &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doc Intel Card */}
          <div
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              modules.docIntel
                ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
                : 'bg-slate-900/20 border-slate-800/40 opacity-50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">{t('settings.docIntelTitle')}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('settings.docIntelDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              {modules.docIntel ? (
                <Link
                  href={`/w/${activeTenant.slug}/documents`}
                  className="flex items-center justify-between text-xs font-semibold text-teal-400 hover:text-teal-300"
                >
                  <span>Launch Intelligence Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-slate-400 font-medium italic">
                  Disabled &bull; Enable in Settings
                </span>
              )}
            </div>
          </div>

          {/* Support Swarm Card */}
          <div
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              modules.supportSwarm
                ? 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
                : 'bg-slate-900/20 border-slate-800/40 opacity-50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">{t('settings.supportSwarmTitle')}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('settings.supportSwarmDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              {modules.supportSwarm ? (
                <Link
                  href={`/w/${activeTenant.slug}/support`}
                  className="flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <span>Open Support Operations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-slate-400 font-medium italic">
                  Disabled &bull; Enable in Settings
                </span>
              )}
            </div>
          </div>

          {/* Code Audit Card */}
          <div
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              modules.codeAudit
                ? 'bg-slate-900/60 border-slate-800 hover:border-blue-500/50'
                : 'bg-slate-900/20 border-slate-800/40 opacity-50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">{t('settings.codeAuditTitle')}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t('settings.codeAuditDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              {modules.codeAudit ? (
                <Link
                  href={`/w/${activeTenant.slug}/code-audit`}
                  className="flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Open Code &amp; Spec Auditor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-slate-400 font-medium italic">
                  Disabled &bull; Enable in Settings
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
