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
      <div className="p-12 text-center max-w-xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 mt-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Code &amp; Specs Auditor is Disabled</h2>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          This tenant workspace has not enabled the Code Quality &amp; Compliance Auditor module.
        </p>
        <button
          onClick={() => toggleModule('codeAudit', true)}
          className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
        >
          Enable Module Now
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
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-mono mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Kiro Autonomous Agent Module &bull; ID: specos-code-audit</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t('settings.codeAuditTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated verification of codebase changes against Kiro specs, architecture guidelines, and tenant security.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isRunningAudit}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg shadow-blue-950 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningAudit ? 'animate-spin' : ''}`} />
          <span>{isRunningAudit ? 'Auditing Codebase...' : 'Run Kiro Spec Audit'}</span>
        </button>
      </div>

      {auditSuccess && (
        <div className="p-3.5 rounded-xl bg-blue-950/80 border border-blue-700/80 text-blue-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Audit complete! 0 critical regressions found against Kiro architectural standards.</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Repositories & Score */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1">
              Kiro Architecture Health Score
            </div>
            <div className="text-5xl font-black text-emerald-400 my-2">
              {selectedAudit.score}
              <span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedAudit.specCompliance}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Audited Repository
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-white bg-slate-950 p-3 rounded-xl border border-slate-800">
              <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="truncate">{selectedAudit.repo}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-mono">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                Branch: {selectedAudit.branch}
              </span>
              <span>Audit: {selectedAudit.createdAt}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300">Enforced Standards:</span>
            <ul className="text-xs space-y-1.5 text-slate-400 font-mono">
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
                DEV-001: Multilingual i18n Verification
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Findings Detail */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Active Audit Findings</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedAudit.violationsCount} guideline violations flagged by Kiro steering directives.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Tenant: {activeTenant.slug}
            </span>
          </div>

          <div className="space-y-4">
            {selectedAudit.findings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
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

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {finding.description}
                </p>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-emerald-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                      Kiro Agent Remediation Suggestion:
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
