'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  Sliders,
  FileText,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function TenantAdminModulesPage() {
  const { activeTenant, toggleModule, applyPreset, updateSettings, t } = useTenant();
  const settings = activeTenant.settings;
  const modules = settings.modules;

  const [savedAlert, setSavedAlert] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-mono mb-1 font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Tenant Admin &bull; Autonomous Modules &amp; Capabilities</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          AI Capabilities &amp; Swarm Configuration
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Turnkey feature gates: enable or disable autonomous legal intelligence, customer support, or code auditing with zero redeployment.
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Module settings updated and synced to Edge Middleware!</span>
        </div>
      )}

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <Link
          href={`/w/${activeTenant.slug}/admin/general`}
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          General &amp; Branding
        </Link>
        <Link
          href={`/w/${activeTenant.slug}/admin/modules`}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-xs"
        >
          Modules &amp; Swarms
        </Link>
        <Link
          href={`/w/${activeTenant.slug}/admin/sections`}
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Dashboard Sections
        </Link>
        <Link
          href={`/w/${activeTenant.slug}/admin/billing`}
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Quota &amp; Ledger
        </Link>
      </div>

      {/* 1-Click Demo Presets Banner */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>1-Click Industry Presets:</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Instant Reconfiguration</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              applyPreset('legal');
              setSavedAlert(true);
              setTimeout(() => setSavedAlert(false), 3000);
            }}
            className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-left transition-all text-xs shadow-xs"
          >
            <span className="font-bold text-teal-800 block">⚖️ Legal Suite</span>
            <span className="text-[10px] text-slate-500">DocIntel &bull; Japanese</span>
          </button>

          <button
            onClick={() => {
              applyPreset('support');
              setSavedAlert(true);
              setTimeout(() => setSavedAlert(false), 3000);
            }}
            className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-left transition-all text-xs shadow-xs"
          >
            <span className="font-bold text-amber-800 block">🎧 Support Swarm</span>
            <span className="text-[10px] text-slate-500">Tickets &bull; Spanish</span>
          </button>

          <button
            onClick={() => {
              applyPreset('devsecops');
              setSavedAlert(true);
              setTimeout(() => setSavedAlert(false), 3000);
            }}
            className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-left transition-all text-xs shadow-xs"
          >
            <span className="font-bold text-blue-800 block">🛡️ DevSecOps</span>
            <span className="text-[10px] text-slate-500">Code Audit &bull; English</span>
          </button>

          <button
            onClick={() => {
              applyPreset('all');
              setSavedAlert(true);
              setTimeout(() => setSavedAlert(false), 3000);
            }}
            className="p-2.5 rounded-lg bg-white border border-purple-200 hover:border-purple-400 text-left transition-all text-xs shadow-xs"
          >
            <span className="font-bold text-purple-800 block">🚀 All Modules</span>
            <span className="text-[10px] text-slate-500">Enterprise Swarm</span>
          </button>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="space-y-4">
        {/* Module 1: Document Intelligence */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-950">
                    Document &amp; Contract Intelligence
                  </h3>
                  {modules.docIntel && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Autonomous legal risk scoring, indemnification extraction, and multilingual briefing.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                toggleModule('docIntel', !modules.docIntel);
                setSavedAlert(true);
                setTimeout(() => setSavedAlert(false), 3000);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                modules.docIntel
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-teal-600 text-white hover:bg-teal-500'
              }`}
            >
              {modules.docIntel ? 'Disable Module' : 'Enable Module'}
            </button>
          </div>

          {modules.docIntel && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Application Route: <code className="font-mono text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">/w/{activeTenant.slug}/documents</code></span>
              <Link
                href={`/w/${activeTenant.slug}/documents`}
                className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
              >
                <span>Open Application</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Module 2: Support Swarm */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-950">
                    Customer Support Swarm
                  </h3>
                  {modules.supportSwarm && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Autonomous ticket sentiment triage, multilingual translation, and autonomous resolution drafts.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                toggleModule('supportSwarm', !modules.supportSwarm);
                setSavedAlert(true);
                setTimeout(() => setSavedAlert(false), 3000);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                modules.supportSwarm
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-amber-600 text-white hover:bg-amber-500'
              }`}
            >
              {modules.supportSwarm ? 'Disable Module' : 'Enable Module'}
            </button>
          </div>

          {modules.supportSwarm && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Application Route: <code className="font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">/w/{activeTenant.slug}/support</code></span>
              <Link
                href={`/w/${activeTenant.slug}/support`}
                className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
              >
                <span>Open Application</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Module 3: Code Audit */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-950">
                    Code Quality &amp; Compliance Auditor
                  </h3>
                  {modules.codeAudit && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Automated verification of codebase changes against Kiro specifications, architecture guidelines, and tenant security.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                toggleModule('codeAudit', !modules.codeAudit);
                setSavedAlert(true);
                setTimeout(() => setSavedAlert(false), 3000);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                modules.codeAudit
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {modules.codeAudit ? 'Disable Module' : 'Enable Module'}
            </button>
          </div>

          {modules.codeAudit && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Application Route: <code className="font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">/w/{activeTenant.slug}/code-audit</code></span>
              <Link
                href={`/w/${activeTenant.slug}/code-audit`}
                className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
              >
                <span>Open Application</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
