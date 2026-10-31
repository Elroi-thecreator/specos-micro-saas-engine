'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  Sparkles,
  Building2,
  Globe2,
  ShieldCheck,
  ArrowRight,
  Layers,
  Cpu,
  CheckCircle2,
  Coins,
} from 'lucide-react';

export default function LandingPage() {
  const { tenants, setActiveTenantBySlug } = useTenant();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 shadow-emerald-500/20 shadow-lg">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">SpecOS Engine</span>
            <span className="text-xs text-emerald-400 ml-2 font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60">
              Kiroween 2026: Skeleton Crew
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            7 Locales (EN, ES, FR, DE, JA, HI, AR)
          </span>
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Tenant Row-Level Security
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>One Skeleton Core • Infinite Autonomous Micro-SaaS Possibilities</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Autonomous Multi-Tenant &amp; Multilingual Micro-SaaS Engine
        </h1>
        
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A production-grade, configurable agent runtime. Each tenant organization gets isolated data, their own operating language, token budget, and an interactive settings panel to toggle specialized AI modules on demand.
        </p>

        {/* Tenant Selection Grid */}
        <div className="mt-16 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Select an Active Tenant Organization to Launch:
            </h2>
            <span className="text-xs text-slate-400">
              All tenants run on the identical backend skeleton
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenants.map((tenant) => {
              const modules = tenant.settings.modules;
              const activeCount = Object.values(modules).filter(Boolean).length;

              return (
                <div
                  key={tenant.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 p-6 transition-all duration-200 hover:border-slate-700 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          Tenant ID: {tenant.slug}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                          {tenant.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {tenant.settings.branding.tagline}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                          {tenant.tier}
                        </span>
                        <span className="text-xs text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                          Lang: {tenant.settings.defaultLocale.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Active Modules Badges */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400 font-medium">Configured Modules:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {modules.docIntel && (
                          <span className="text-xs px-2.5 py-1 rounded bg-teal-950/70 text-teal-300 border border-teal-800/60 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-teal-400" />
                            Document Intel
                          </span>
                        )}
                        {modules.supportSwarm && (
                          <span className="text-xs px-2.5 py-1 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-amber-400" />
                            Support Swarm
                          </span>
                        )}
                        {modules.codeAudit && (
                          <span className="text-xs px-2.5 py-1 rounded bg-blue-950/70 text-blue-300 border border-blue-800/60 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-blue-400" />
                            Code &amp; Specs Auditor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Token Budget Meter */}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800/60">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        Tokens:
                      </span>
                      <span className="text-slate-200">
                        {tenant.settings.tokensConsumed.toLocaleString()} / {tenant.settings.tokenBudgetMonthly.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4">
                    <Link
                      href={`/w/${tenant.slug}`}
                      onClick={() => setActiveTenantBySlug(tenant.slug)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-medium text-sm transition-all group-hover:bg-emerald-600"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Prop Columns */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Strict Multi-Tenancy</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Enforces <code className="text-emerald-400 font-mono">tenant_id</code> boundaries at the data and ORM layer. No tenant ever sees or accesses another organization’s prompts, documents, or memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-4">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">7-Language Native i18n</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Dynamic localization across English, Japanese, Spanish, German, French, Hindi, and Arabic (with RTL). AI agents automatically reason and output in the tenant’s native tongue.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Configurable Modules</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Admins toggle Legal Document Intel, Customer Support, and Code Auditing on or off. The UI and agent swarms adapt dynamically with zero code changes or redeployments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-400">
        Built with Kiro Spec-Driven Architecture &bull; Kiroween 2026 Submission
      </footer>
    </main>
  );
}
