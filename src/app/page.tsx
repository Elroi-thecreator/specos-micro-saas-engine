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
  Lock,
  Zap,
  Terminal,
  Activity,
} from 'lucide-react';

export default function LandingPage() {
  const { tenants, setActiveTenantBySlug } = useTenant();

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black bg-grid-pattern relative">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <nav className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur sticky top-0 z-50 px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-950 shadow-sm">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">SpecOS</span>
            <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
              v1.0.0 &bull; Kiroween
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300 font-medium">Engine Healthy</span>
          </div>
          <a
            href="https://kiroween.devpost.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-colors font-medium text-xs"
          >
            Devpost Submission &rarr;
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium">Track: Skeleton Crew &bull; Autonomous Micro-SaaS Engine</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          One Autonomous Core.<br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Infinite Multilingual SaaS.
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          A production-grade, configurable agent runtime. Each tenant organization receives strict row-level isolation, its own native language (EN, ES, FR, DE, JA, HI, AR with RTL), token quotas, and interactive capability toggles.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/w/lexis-legal"
            onClick={() => setActiveTenantBySlug('lexis-legal')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all shadow-lg hover:shadow-white/10"
          >
            <span>Launch Live Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/w/lexis-legal/settings"
            onClick={() => setActiveTenantBySlug('lexis-legal')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-medium text-sm transition-all border border-zinc-800 hover:border-zinc-700"
          >
            <span>Explore Settings &amp; Presets</span>
          </Link>
        </div>

        {/* Live Workspaces Directory Grid */}
        <div className="mt-20 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Active Multi-Tenant Workspaces
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Each workspace runs on the identical backend core, isolated logically by <code className="font-mono text-zinc-300">tenant_id</code>.
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-mono self-start sm:self-auto">
              4 Tenants Seeded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tenants.map((tenant) => {
              const modules = tenant.settings.modules;

              return (
                <div
                  key={tenant.id}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/70 p-6 transition-all duration-200 hover:border-zinc-700 hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle Accent Glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl rounded-full pointer-events-none"
                    style={{ backgroundColor: tenant.settings.branding.primaryColor || '#0f766e' }}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                            /w/{tenant.slug}
                          </span>
                          <span className="text-[10px] text-zinc-400">&bull;</span>
                          <span className="text-[10px] font-mono text-cyan-400 uppercase">
                            Lang: {tenant.settings.defaultLocale}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                          {tenant.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          {tenant.settings.branding.tagline}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700/60 shrink-0">
                        {tenant.tier}
                      </span>
                    </div>

                    {/* Active Capabilities Pills */}
                    <div className="mt-5 pt-4 border-t border-zinc-800/80">
                      <div className="flex flex-wrap gap-2">
                        {modules.docIntel && (
                          <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-900 text-teal-300 border border-teal-800/40 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                            Document Intel
                          </span>
                        )}
                        {modules.supportSwarm && (
                          <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-900 text-amber-300 border border-amber-800/40 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Support Swarm
                          </span>
                        )}
                        {modules.codeAudit && (
                          <span className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-900 text-blue-300 border border-blue-800/40 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            Code &amp; Specs Auditor
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Token Ledger Info */}
                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono bg-zinc-950/60 px-3 py-2 rounded-lg border border-zinc-800/60">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        Tokens:
                      </span>
                      <span className="text-zinc-200">
                        {tenant.settings.tokensConsumed.toLocaleString()} / {tenant.settings.tokenBudgetMonthly.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-3">
                    <Link
                      href={`/w/${tenant.slug}`}
                      onClick={() => setActiveTenantBySlug(tenant.slug)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-all border border-zinc-800 hover:border-zinc-700 group-hover:border-emerald-500/50"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Strict Row-Level Isolation</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Every database entity, prompt memory, and vector retrieval query enforces <code className="text-emerald-400 font-mono">tenant_id</code> constraints. Zero cross-tenant data leakage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400 mb-4">
              <Globe2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">7-Language i18n &amp; RTL</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Localized for English, Japanese, Spanish, German, French, Hindi, and Arabic. The UI adapts bidirectional RTL layout while agents output reasoning in the user&apos;s native language.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Configurable Turnkey Presets</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Administrators configure agent modules and branding in real-time. Switch between Legal Tech, Customer Support, and DevSecOps presets in a single click.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 max-w-6xl w-full mx-auto">
        <span>SpecOS &bull; Autonomous Multi-Tenant Engine</span>
        <span>Built with Kiro Spec-Driven Architecture &bull; Kiroween 2026</span>
      </footer>
    </main>
  );
}
