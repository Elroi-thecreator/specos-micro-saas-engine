'use client';

import React, { useState } from 'react';
import { useTenant } from '@/lib/tenant-context';
import { MOCK_AUDITS } from '@/lib/mock-data';
import { CodeAuditItem } from '@/lib/types';
import {
  ShieldAlert,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Terminal,
  Code2,
  FileCheck,
  RefreshCw,
  GitCommit,
  Check,
} from 'lucide-react';

export default function CodeAuditPage() {
  const { activeTenant, toggleModule, t, activeLocale } = useTenant();
  const isEnabled = activeTenant.settings.modules.codeAudit;

  const [audits, setAudits] = useState<CodeAuditItem[]>(() => {
    return MOCK_AUDITS.filter((a) => a.tenantId === activeTenant.id || a.tenantId === 'tenant-dev-202');
  });

  const [selectedAudit, setSelectedAudit] = useState<CodeAuditItem>(audits[0]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  if (!isEnabled) {
    return (
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 mt-16">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Code &amp; Specs Auditor Disabled</h2>
        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Code Quality &amp; Compliance Auditor active.
        </p>
        <button
          onClick={() => toggleModule('codeAudit', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors"
        >
          Enable Module
        </button>
      </div>
    );
  }

  const handleRunAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      setIsRunningAudit(false);
      setAuditSuccess(true);
      setTimeout(() => setAuditSuccess(false), 3000);
    }, 1400);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Kiro Autonomous Scanner &bull; specos-code-audit</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('settings.codeAuditTitle')}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automated verification of codebase changes against Kiro specs, architecture guidelines, and tenant security.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isRunningAudit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
          <span>{isRunningAudit ? 'Auditing Codebase...' : 'Run Spec Audit'}</span>
        </button>
      </div>

      {auditSuccess && (
        <div className="p-3 rounded-lg bg-blue-950/70 border border-blue-800/80 text-blue-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Audit complete &bull; Verified against ARCH-001, ARCH-002, and DEV-001!</span>
        </div>
      )}

      {/* Main DevSecOps Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Card & Target Repo */}
        <div className="lg:col-span-5 space-y-4">
          {/* Health Score Gauge */}
          <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block mb-1">
              Kiro Architecture Health Score
            </span>
            <div className="text-5xl font-black text-emerald-400 my-2">
              {selectedAudit.score}
              <span className="text-lg text-zinc-400 font-normal">/100</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedAudit.specCompliance}</span>
            </span>
          </div>

          {/* Repo Info */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Monitored Target
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-white bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{selectedAudit.repo}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-[11px]">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                {selectedAudit.branch}
              </span>
              <span className="text-[11px]">{selectedAudit.createdAt}</span>
            </div>
          </div>

          {/* Enforced Guidelines List */}
          <div className="p-5 rounded-xl bg-zinc-900/20 border border-zinc-800/60 space-y-2 text-xs">
            <span className="font-semibold text-zinc-300 block">Enforced Knowledge Standards:</span>
            <ul className="space-y-1.5 text-zinc-400 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ARCH-001: Multi-Tenant Data Isolation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ARCH-002: Modular Agent Capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                DEV-001: Multilingual i18n &amp; Localized Output
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Findings & Remediation */}
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div>
              <h3 className="text-base font-bold text-white">Active Findings &amp; Regressions</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedAudit.violationsCount} items flagged by Kiro steering directives.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              Tenant: {activeTenant.slug}
            </span>
          </div>

          <div className="space-y-3.5">
            {selectedAudit.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        finding.severity === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {finding.severity} Severity
                    </span>
                    <span className="text-xs font-mono text-blue-400 font-semibold">
                      Rule: {finding.ruleId}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {finding.description}
                </p>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                      Kiro Remediation:
                    </span>
                    <code>{finding.suggestion}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
