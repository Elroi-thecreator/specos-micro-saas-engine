'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import { MOCK_DOCUMENTS } from '@/lib/mock-data';
import { DocumentItem } from '@/lib/types';
import {
  FileText,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Settings,
  Languages,
} from 'lucide-react';

export default function DocumentIntelligencePage() {
  const { activeTenant, toggleModule, t, activeLocale } = useTenant();
  const isEnabled = activeTenant.settings.modules.docIntel;

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    return MOCK_DOCUMENTS.filter((d) => d.tenantId === activeTenant.id || d.tenantId === 'tenant-legal-101');
  });

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(documents[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  if (!isEnabled) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 mt-12">
        <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-800/80 text-teal-400 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Document Intelligence is Disabled</h2>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          This tenant workspace has not enabled the Document &amp; Contract Intelligence module.
        </p>
        <button
          onClick={() => toggleModule('docIntel', true)}
          className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors"
        >
          Enable Module Now
        </button>
      </div>
    );
  }

  const handleRunAgent = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-mono mb-1">
            <FileText className="w-4 h-4" />
            <span>Kiro Autonomous Agent Module &bull; ID: specos-doc-intel</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t('settings.docIntelTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous legal risk scoring, indemnification extraction, and multilingual executive briefing.
          </p>
        </div>

        <button
          onClick={handleRunAgent}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-all shadow-lg shadow-teal-950 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? t('common.running') : t('common.runAgent')}</span>
        </button>
      </div>

      {analyzedSuccess && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-700/80 text-teal-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Kiro Agent Swarm completed contract risk audit in active locale ({activeLocale.toUpperCase()})!</span>
        </div>
      )}

      {/* Main Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tenant Contract Vault ({documents.length})
            </span>
            <span className="text-[11px] text-teal-400 font-mono">Scoped: {activeTenant.slug}</span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 shadow-md shadow-teal-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-white truncate">{doc.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        doc.riskScore === 'High' || doc.riskScore === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {doc.riskScore}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {doc.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Lang: {doc.sourceLanguage}</span>
                    <span>{doc.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload Dropzone */}
          <div className="p-6 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl text-center bg-slate-950/50 cursor-pointer transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-300">Drop SLA, NDA, or Master Agreement</p>
            <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX up to 25MB &bull; Tenant Scoped</p>
          </div>
        </div>

        {/* Right: Agent Analysis View */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400">
                Active Analysis Brief &bull; Scoped to {activeTenant.name}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedDoc.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Category: {selectedDoc.category}</p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Risk Rating</span>
              <span className="text-base font-black text-rose-400">{selectedDoc.riskScore}</span>
            </div>
          </div>

          {/* Localized Summary Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Languages className="w-3.5 h-3.5" />
              <span>Executive Briefing (Localized in {activeLocale.toUpperCase()})</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {selectedDoc.summary}
            </p>
          </div>

          {/* Extracted High-Risk Clauses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Extracted High-Risk Clauses ({selectedDoc.extractedClauses.length})
            </h4>

            <div className="space-y-3">
              {selectedDoc.extractedClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{clause.title}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        clause.risk === 'High' || (clause.risk as string) === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {clause.risk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/40">
                    &ldquo;{clause.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
