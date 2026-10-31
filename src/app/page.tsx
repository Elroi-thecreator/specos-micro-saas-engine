'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  Sparkles,
  Building2,
  Globe2,
  ShieldCheck,
  Shield,
  PlusCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  ShieldAlert,
  Coins,
  CheckCircle2,
  Lock,
  Zap,
  Play,
  HelpCircle,
  Users,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { tenants, setActiveTenantBySlug } = useTenant();
  const [activeDemoTab, setActiveDemoTab] = useState<'legal' | 'support' | 'code'>('legal');
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'done'>('idle');

  const handleRunDemo = () => {
    setDemoState('running');
    setTimeout(() => {
      setDemoState('done');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white bg-grid-pattern relative">
      {/* Top Header */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-white shadow-sm">
            S
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-950">SpecOS</span>
            <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
              Autonomous AI Operations Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/super-admin"
            className="px-3.5 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Super Admin</span>
          </Link>
          <Link
            href="/super-admin?tab=new"
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition-colors shadow-xs hidden sm:flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Tenant</span>
          </Link>
          <Link
            href="/w/lexis-legal"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Launch Live Demo &rarr;
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-slate-900">What is SpecOS?</span>
          <span className="text-slate-400">&bull;</span>
          <span>Deploy Your Company&apos;s Autonomous AI Workforce in Minutes</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12] max-w-4xl mx-auto">
          One Platform to Automate Your
          <span className="block mt-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Legal, Support &amp; Engineering Work.
          </span>
        </h1>
        
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Instead of paying for separate tools, <strong>SpecOS</strong> gives your company <strong>3 specialized AI employees</strong> that review contracts, answer customer tickets, and audit code—customized for any language and department.
        </p>

        {/* 3 Value Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Legal &amp; Contract AI</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload vendor NDAs or SLAs. The AI spots high-risk liability traps in seconds and summarizes them in plain English, Japanese, or any language.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Customer Support Swarm</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Receives customer queries in any language, detects urgency, and drafts accurate responses for your staff to approve in 1 click.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. Code &amp; Specs Auditor</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Scans your GitHub repository against architecture guidelines and automatically writes pull requests with code fixes.
            </p>
          </div>
        </div>

        {/* INTERACTIVE "SEE IT IN ACTION" SIMULATOR */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border-2 border-slate-200 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-700 block">
                Interactive Product Simulator
              </span>
              <h2 className="text-lg font-bold text-slate-950 mt-0.5">
                See How the AI Agents Actually Solve Problems:
              </h2>
            </div>

            {/* Simulator Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setActiveDemoTab('legal');
                  setDemoState('idle');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeDemoTab === 'legal'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚖️ Legal Agent
              </button>
              <button
                onClick={() => {
                  setActiveDemoTab('support');
                  setDemoState('idle');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeDemoTab === 'support'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎧 Support Agent
              </button>
              <button
                onClick={() => {
                  setActiveDemoTab('code');
                  setDemoState('idle');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeDemoTab === 'code'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛡️ Code Auditor
              </button>
            </div>
          </div>

          {/* Simulator Content */}
          <div className="mt-6">
            {activeDemoTab === 'legal' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Incoming Document Example: Vendor Cloud SLA
                  </span>
                  <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200">
                    &ldquo;Section 11.2: In the event of a catastrophic data leak, Vendor&apos;s total aggregate liability shall not exceed $100. Customer waives all rights to legal discovery.&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunDemo}
                    disabled={demoState === 'running'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{demoState === 'running' ? 'Scanning Clauses...' : 'Run Legal AI on This Clause'}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-mono">
                    Model: Kiro SpecOS Contract Engine
                  </span>
                </div>

                {demoState === 'done' && (
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        AI Extraction Result:
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                        Critical Risk Trap
                      </span>
                    </div>
                    <p className="text-xs text-teal-950 leading-relaxed">
                      <strong>AI Warning:</strong> The vendor has capped liability for data breaches at $100 and forced you to waive legal rights.
                      <br />
                      <strong>Recommended Redline:</strong> Replace with: <em>&ldquo;Liability for gross negligence and data security breaches shall be uncapped.&rdquo;</em>
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeDemoTab === 'support' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Incoming Customer Ticket Example (From Spain):
                  </span>
                  <p className="text-xs text-slate-700 font-mono bg-white p-3 rounded-lg border border-slate-200">
                    &ldquo;¡Ayuda urgente! La pasarela devuelve error 502 Bad Gateway y nuestros clientes no pueden pagar sus facturas.&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunDemo}
                    disabled={demoState === 'running'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{demoState === 'running' ? 'Analyzing Sentiment...' : 'Generate AI Support Response'}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-mono">
                    Model: Kiro Triage Swarm (Spanish)
                  </span>
                </div>

                {demoState === 'done' && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        AI Drafted Reply (Ready for 1-Click Send):
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                        Urgent Priority Triage
                      </span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-sans">
                      &ldquo;Estimado cliente, comprendemos la urgencia. Hemos detectado la incidencia en la pasarela de pagos europea y nuestro equipo ya ha aplicado el parche correctivo. El servicio quedará restablecido en 10 minutos.&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeDemoTab === 'code' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Incoming Pull Request Snippet (Missing Tenant Scope):
                  </span>
                  <pre className="text-xs text-slate-800 font-mono bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
                    {`export async function getInvoices() {\n  // VULNERABILITY: Missing tenant_id check! Leaks invoices across tenants!\n  return await db.invoices.findMany();\n}`}
                  </pre>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleRunDemo}
                    disabled={demoState === 'running'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{demoState === 'running' ? 'Scanning AST...' : 'Run Spec Compliance Audit'}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-mono">
                    Model: Kiro Architecture Sentinel
                  </span>
                </div>

                {demoState === 'done' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        AI Violation Detected (Rule ARCH-001):
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                        Data Leak Risk
                      </span>
                    </div>
                    <p className="text-xs text-blue-950 leading-relaxed">
                      <strong>Automated Remediation:</strong> Wrap query with <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono text-[11px]">where: &#123; tenantId: session.tenantId &#125;</code> to maintain multi-tenant data boundaries.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SECTION: CLIENT WORKSPACES EXPLAINED */}
        <div className="mt-20 text-left">
          <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 block">
                Multi-Tenant Architecture in Practice
              </span>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">
                Explore Real Client Workspaces Running on SpecOS:
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every client organization gets their own private workspace with their preferred language, logo, and active agent modules. Click any workspace below to enter:
              </p>
            </div>

            <Link
              href="/super-admin?tab=new"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Provision New Tenant</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tenants.map((tenant) => {
              const modules = tenant.settings.modules;

              let roleSummary = '';
              if (tenant.slug === 'lexis-legal') roleSummary = 'Configured strictly as a Legal Contract AI in Japanese.';
              else if (tenant.slug === 'devshield') roleSummary = 'Configured as an Engineering Code Auditor in English.';
              else if (tenant.slug === 'atencion-global') roleSummary = 'Configured as a Customer Support Swarm in Spanish.';
              else roleSummary = 'Enterprise tier with all 3 AI agents active simultaneously in German.';

              return (
                <div
                  key={tenant.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                            /w/{tenant.slug}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-[11px] font-mono text-cyan-700 font-bold uppercase">
                            Lang: {tenant.settings.defaultLocale}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-950 mt-1 group-hover:text-emerald-700 transition-colors">
                          {tenant.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1.5 font-medium">
                          {roleSummary}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {tenant.tier}
                      </span>
                    </div>

                    {/* Active Modules Badges */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-2">
                      {modules.docIntel && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium">
                          📄 Legal Contract AI
                        </span>
                      )}
                      {modules.supportSwarm && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          💬 Support Swarm
                        </span>
                      )}
                      {modules.codeAudit && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                          🛡️ Code Auditor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-3">
                    <Link
                      href={`/w/${tenant.slug}`}
                      onClick={() => setActiveTenantBySlug(tenant.slug)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs group-hover:bg-emerald-600"
                    >
                      <span>Enter {tenant.name} Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="mt-20 p-8 rounded-2xl bg-white border border-slate-200 text-left shadow-xs">
          <h2 className="text-lg font-bold text-slate-950 mb-6">
            How SpecOS Works in 3 Simple Steps:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900">Set Up Your Organization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your default language (English, Spanish, Japanese, German, etc.) and assign monthly token budgets to protect costs.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900">Toggle the Agents You Need</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn on Legal Contract Review, Support Triage, or Code Auditing in the Settings tab. Your navigation bar updates instantly.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900">Let AI Work with Human Approval</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The agents extract risks, triage tickets, and draft pull requests. Your team reviews and approves actions with 1 click.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-5xl w-full mx-auto">
        <span>SpecOS &bull; Autonomous Multi-Tenant AI Operations</span>
        <span>Built with Kiro Spec-Driven Architecture &bull; Kiroween 2026 Submission</span>
      </footer>
    </main>
  );
}
