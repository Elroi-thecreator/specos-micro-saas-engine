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
      <div className="rounded-2xl border border-slate-200 bg-white p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Active Tenant &bull; {activeTenant.slug}
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {activeTenant.tier} Plan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {settings.branding.name || activeTenant.name}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
              {settings.branding.tagline || 'Autonomous Micro-SaaS Engine configured for your enterprise requirements.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
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
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Modules</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-950">{activeCount} / 3</div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Configurable on demand</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('header.tokensUsed')}</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-950">{percentUsed}%</div>
          <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full ${percentUsed > 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1.5 font-medium">
            {settings.tokensConsumed.toLocaleString()} / {settings.tokenBudgetMonthly.toLocaleString()}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('header.activeLocale')}</span>
            <Sparkles className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 uppercase font-mono">
            {settings.defaultLocale}
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">
            7 Locales + RTL Supported
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tenant Security</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">Isolated</div>
          <span className="text-[11px] text-slate-500 mt-2 block font-mono font-medium">
            0 leaks &bull; ARCH-001 active
          </span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configured Modules Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Autonomous Modules
            </h2>
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Toggle Modules &rarr;
            </Link>
          </div>

          {/* Doc Intel Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.docIntel
                ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                : 'bg-slate-50 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-950">{t('settings.docIntelTitle')}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.docIntelDesc')}
                  </p>
                </div>
              </div>

              {modules.docIntel ? (
                <Link
                  href={`/w/${activeTenant.slug}/documents`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>

          {/* Support Swarm Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.supportSwarm
                ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                : 'bg-slate-50 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-950">{t('settings.supportSwarmTitle')}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.supportSwarmDesc')}
                  </p>
                </div>
              </div>

              {modules.supportSwarm ? (
                <Link
                  href={`/w/${activeTenant.slug}/support`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>

          {/* Code Audit Card */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              modules.codeAudit
                ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                : 'bg-slate-50 border-slate-200/60 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-950">{t('settings.codeAuditTitle')}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('settings.codeAuditDesc')}
                  </p>
                </div>
              </div>

              {modules.codeAudit ? (
                <Link
                  href={`/w/${activeTenant.slug}/code-audit`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shrink-0 flex items-center gap-1 shadow-xs"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono italic shrink-0">Disabled</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Audit Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Live Agent Activity
            </h2>
            <span className="text-[10px] text-slate-500 font-mono font-medium">Real-time Stream</span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            {recentEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{ev.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{ev.detail}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                  <span className="text-emerald-700 font-semibold">{ev.agent}</span>
                  <span className="text-slate-500 font-medium">{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
