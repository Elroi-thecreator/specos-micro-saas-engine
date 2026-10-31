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
  Activity,
  ArrowUpRight,
  TrendingUp,
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

  const recentEvents = [
    {
      id: 'ev-1',
      action: 'Contract Risk Evaluation completed',
      detail: 'Master Cloud Agreement - VendorX.pdf audited in Japanese',
      time: '12m ago',
      agent: 'Kiro Legal Agent',
      status: 'High Risk Flagged',
    },
    {
      id: 'ev-2',
      action: 'Autonomous Support Reply dispatched',
      detail: 'Ticket #tkt-001 localized and sent in Spanish',
      time: '45m ago',
      agent: 'Kiro Support Swarm',
      status: 'Delivered',
    },
    {
      id: 'ev-3',
      action: 'Spec & Architecture Audit executed',
      detail: 'github.com/acme-org/payment-gateway (feat/multi-tenant-sync)',
      time: '2h ago',
      agent: 'Kiro Sentinel',
      status: 'Score 94/100',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Workspace Executive Header */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Active Tenant &bull; {activeTenant.slug}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                {activeTenant.tier} Plan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {settings.branding.name || activeTenant.name}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              {settings.branding.tagline || 'Autonomous Micro-SaaS Engine configured for your enterprise requirements.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Workspace Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Modules</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeCount} / 3</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Configurable on demand</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t('header.tokensUsed')}</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{percentUsed}%</div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full ${percentUsed > 80 ? 'bg-rose-500' : 'bg-amber-400'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono block mt-1.5">
            {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t('header.activeLocale')}</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white uppercase font-mono">
            {settings.defaultLocale}
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            7 Locales + RTL Supported
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Tenant Security</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Isolated</div>
          <span className="text-[11px] text-zinc-400 mt-2 block font-mono">
            0 leaks &bull; ARCH-001 active
          </span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configured Modules Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Modules
            </h2>
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Toggle Modules &rarr;
            </Link>
          </div>

          {/* Doc Intel Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.docIntel
                ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                : 'bg-zinc-900/20 border-zinc-800/40 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t('settings.docIntelTitle')}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.docIntelDesc')}
                  </p>
                </div>
              </div>

              {modules.docIntel ? (
                <Link
                  href={`/w/${activeTenant.slug}/documents`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-zinc-400 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>

          {/* Support Swarm Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.supportSwarm
                ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                : 'bg-zinc-900/20 border-zinc-800/40 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t('settings.supportSwarmTitle')}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.supportSwarmDesc')}
                  </p>
                </div>
              </div>

              {modules.supportSwarm ? (
                <Link
                  href={`/w/${activeTenant.slug}/support`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-zinc-400 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>

          {/* Code Audit Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.codeAudit
                ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                : 'bg-zinc-900/20 border-zinc-800/40 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{t('settings.codeAuditTitle')}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {t('settings.codeAuditDesc')}
                  </p>
                </div>
              </div>

              {modules.codeAudit ? (
                <Link
                  href={`/w/${activeTenant.slug}/code-audit`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-zinc-400 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Audit Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Agent Activity
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono">Real-time Stream</span>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{ev.action}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{ev.time}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{ev.detail}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                  <span className="text-emerald-400">{ev.agent}</span>
                  <span className="text-zinc-400">{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
