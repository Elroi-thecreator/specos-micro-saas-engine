'use client';

import React, { useState } from 'react';
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
  Filter,
  FileCheck2,
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
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 mt-16">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Document Intelligence Disabled</h2>
        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Document &amp; Contract Intelligence module active.
        </p>
        <button
          onClick={() => toggleModule('docIntel', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors"
        >
          Enable Module
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
    }, 1400);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Kiro Autonomous Agent &bull; specos-doc-intel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('settings.docIntelTitle')}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Autonomous legal risk scoring, indemnification extraction, and multilingual briefing.
          </p>
        </div>

        <button
          onClick={handleRunAgent}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-all shadow-sm disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Agent Analyzing...' : 'Run Autonomous Audit'}</span>
        </button>
      </div>

      {analyzedSuccess && (
        <div className="p-3 rounded-lg bg-teal-950/70 border border-teal-800/80 text-teal-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Contract risk audit complete &bull; Localized briefing generated in {activeLocale.toUpperCase()}!</span>
        </div>
      )}

      {/* Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Vault List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
            <span>VAULT ({documents.length} FILES)</span>
            <span>TENANT: {activeTenant.slug}</span>
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
                      ? 'bg-zinc-800/90 border-teal-500/80 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-white truncate">{doc.title}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        doc.riskScore === 'High' || doc.riskScore === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      }`}
                    >
                      {doc.riskScore}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {doc.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Source: {doc.sourceLanguage}</span>
                    <span>{doc.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload Dropzone */}
          <div className="p-5 border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl text-center bg-zinc-950/40 cursor-pointer transition-colors">
            <UploadCloud className="w-5 h-5 text-zinc-400 mx-auto mb-1.5" />
            <p className="text-xs font-medium text-zinc-300">Upload Legal Agreement (PDF, DOCX)</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Scanned and isolated by tenant partition</p>
          </div>
        </div>

        {/* Right: Inspection & Clause Detail */}
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-3.5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400">
                Contract Inspection &bull; {selectedDoc.category}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedDoc.title}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Risk Rating</span>
              <span className="text-sm font-black text-rose-400">{selectedDoc.riskScore}</span>
            </div>
          </div>

          {/* Localized Briefing Card */}
          <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Languages className="w-3.5 h-3.5" />
              <span>Executive Briefing ({activeLocale.toUpperCase()})</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {selectedDoc.summary}
            </p>
          </div>

          {/* Extracted Clauses */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Extracted Risk Clauses ({selectedDoc.extractedClauses.length})
            </h4>

            <div className="space-y-2.5">
              {selectedDoc.extractedClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/70 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">{clause.title}</span>
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
                  <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2 rounded border border-zinc-800/40">
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
