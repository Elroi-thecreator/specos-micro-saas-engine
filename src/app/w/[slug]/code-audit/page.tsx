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
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white mt-16 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">Code &amp; Specs Auditor Disabled</h2>
        <p className="text-slate-600 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Code Quality &amp; Compliance Auditor active.
        </p>
        <button
          onClick={() => toggleModule('codeAudit', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-mono mb-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Kiro Autonomous Scanner &bull; specos-code-audit</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {t('settings.codeAuditTitle')}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Automated verification of codebase changes against Kiro specs, architecture guidelines, and tenant security.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isRunningAudit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
          <span>{isRunningAudit ? 'Auditing Codebase...' : 'Run Spec Audit'}</span>
        </button>
      </div>

      {auditSuccess && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Audit complete &bull; Verified against ARCH-001, ARCH-002, and DEV-001!</span>
        </div>
      )}

      {/* Main DevSecOps Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score Card & Target Repo */}
        <div className="lg:col-span-5 space-y-4">
          {/* Health Score Gauge */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1 font-semibold">
              Kiro Architecture Health Score
            </span>
            <div className="text-5xl font-black text-emerald-600 my-2">
              {selectedAudit.score}
              <span className="text-lg text-slate-400 font-normal">/100</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedAudit.specCompliance}</span>
            </span>
          </div>

          {/* Repo Info */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Monitored Target
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
              <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{selectedAudit.repo}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
              <span className="flex items-center gap-1.5 text-[11px] font-medium">
                <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                {selectedAudit.branch}
              </span>
              <span className="text-[11px]">{selectedAudit.createdAt}</span>
            </div>
          </div>

          {/* Enforced Guidelines List */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">Enforced Knowledge Standards:</span>
            <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ARCH-001: Multi-Tenant Data Isolation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ARCH-002: Modular Agent Capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                DEV-001: Multilingual i18n &amp; Localized Output
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Findings & Remediation */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
            <div>
              <h3 className="text-base font-bold text-slate-950">Active Findings &amp; Regressions</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAudit.violationsCount} items flagged by Kiro steering directives.
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              Tenant: {activeTenant.slug}
            </span>
          </div>

          <div className="space-y-3.5">
            {selectedAudit.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        finding.severity === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {finding.severity} Severity
                    </span>
                    <span className="text-xs font-mono text-blue-700 font-semibold">
                      Rule: {finding.ruleId}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {finding.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 flex items-start gap-2 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
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
