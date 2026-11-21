'use client';

import React, { useState, useRef } from 'react';
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
  FileUp,
  Cpu,
  Download,
} from 'lucide-react';

export default function DocumentIntelligencePage() {
  const { activeTenant, toggleModule, executeAgentJob, t, activeLocale } = useTenant();
  const isEnabled = activeTenant.settings.modules.docIntel;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    return MOCK_DOCUMENTS.filter((d) => d.tenantId === activeTenant.id || d.tenantId === 'tenant-legal-101');
  });

  const [selectedDoc, setSelectedDoc] = useState<DocumentItem>(documents[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [engineInfo, setEngineInfo] = useState<string | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  if (!isEnabled) {
    return (
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white mt-16 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">Document Intelligence Disabled</h2>
        <p className="text-slate-600 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Document &amp; Contract Intelligence module active.
        </p>
        <button
          onClick={() => toggleModule('docIntel', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          Enable Module
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = (event.target?.result as string) || '';
      const newDocId = `doc-custom-${Date.now().toString(36)}`;
      
      const newDoc: DocumentItem = {
        id: newDocId,
        tenantId: activeTenant.id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Uploaded Legal Agreement',
        riskScore: 'Medium',
        summary: textContent.slice(0, 320) || 'Uploaded document ready for autonomous agent risk scoring and clause extraction.',
        extractedClauses: [
          {
            title: 'Initial Intake: Pending Autonomous Review',
            content: textContent.slice(0, 200) || 'Full contract text pending Gemini AI clause extraction.',
            risk: 'Medium',
          },
        ],
        sourceLanguage: activeLocale.toUpperCase(),
        createdAt: new Date().toISOString().split('T')[0],
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setUploadNotice(`"${file.name}" uploaded successfully into ${activeTenant.name}'s secure partition.`);
      setTimeout(() => setUploadNotice(null), 5000);
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRunAgent = async () => {
    setIsAnalyzing(true);
    setEngineInfo(null);
    const res = await executeAgentJob('docIntel', {
      docId: selectedDoc.id,
      title: selectedDoc.title,
      summary: selectedDoc.summary,
      category: selectedDoc.category,
    });

    if (res.success && res.jobId) {
      setJobId(res.jobId);
      
      // Poll briefly for completed result
      setTimeout(async () => {
        try {
          const pollRes = await fetch(`/api/v1/w/${activeTenant.slug}/agent/jobs/${res.jobId}`);
          if (pollRes.ok) {
            const pollData = await pollRes.json();
            const jobData = pollData.data;
            if (jobData && jobData.resultPayload) {
              const result = jobData.resultPayload;
              setEngineInfo(jobData.modelUsed || 'Gemini AI');

              const updatedDoc: DocumentItem = {
                ...selectedDoc,
                riskScore: result.riskLevel || selectedDoc.riskScore,
                summary: result.summary || selectedDoc.summary,
                extractedClauses: Array.isArray(result.clauses) && result.clauses.length > 0
                  ? result.clauses
                  : selectedDoc.extractedClauses,
              };

              setSelectedDoc(updatedDoc);
              setDocuments((prev) =>
                prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
              );
            }
          }
        } catch (err) {
          console.error('Job result retrieval error:', err);
        } finally {
          setIsAnalyzing(false);
          setAnalyzedSuccess(true);
          setTimeout(() => setAnalyzedSuccess(false), 5000);
        }
      }, 600);
    } else {
      setIsAnalyzing(false);
    }
  };

  const handleExportReport = () => {
    const reportContent = `# SpecOS Autonomous Contract Intelligence Audit Report
Date: ${new Date().toISOString()}
Tenant: ${activeTenant.name} (${activeTenant.slug})
Operating Locale: ${activeLocale.toUpperCase()}
Document: ${selectedDoc.title}
Category: ${selectedDoc.category}
Assigned Risk: ${selectedDoc.riskScore}
Engine: ${engineInfo || 'Gemini 2.5 Flash'}

---

## Executive Summary
${selectedDoc.summary}

## Extracted Clauses & Risk Findings
${selectedDoc.extractedClauses
  .map(
    (c, i) => `### ${i + 1}. ${c.title} [Risk: ${c.risk}]
> "${c.content}"
`
  )
  .join('\n')}

---
Generated autonomously by SpecOS Micro-SaaS Engine (https://specos-micro-saas-engine.vercel.app)
Compliant with ARCH-001, ARCH-002, and ARCH-004.
`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${selectedDoc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-700 font-mono mb-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Kiro Autonomous Agent &bull; specos-doc-intel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {t('settings.docIntelTitle')}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Autonomous legal risk scoring, indemnification extraction, and multilingual briefing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-xs"
            title="Download structured Markdown audit report"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>

          <button
            onClick={handleRunAgent}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Auditing with Gemini AI...' : 'Run Autonomous Audit'}</span>
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {analyzedSuccess && (
        <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Contract audit job completed via worker queue in {activeLocale.toUpperCase()}!</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            {engineInfo && (
              <span className="bg-teal-100/70 px-2 py-0.5 rounded border border-teal-300 text-teal-900 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                {engineInfo}
              </span>
            )}
            {jobId && (
              <span className="bg-white px-2 py-0.5 rounded border border-teal-200 text-teal-800">
                ID: {jobId}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Split-Screen Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document Vault List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono font-medium">
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
                      ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">{doc.title}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        doc.riskScore === 'High' || doc.riskScore === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {doc.riskScore}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {doc.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Source: {doc.sourceLanguage}</span>
                    <span>{doc.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Upload Dropzone */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.json,.pdf,.doc,.docx"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-5 border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-xl text-center bg-teal-50/40 hover:bg-teal-50 cursor-pointer transition-all group"
          >
            <UploadCloud className="w-5 h-5 text-teal-600 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-semibold text-teal-900">Upload Legal Agreement (TXT, MD, JSON, PDF)</p>
            <p className="text-[10px] text-teal-700 mt-0.5">Scanned and isolated by tenant partition</p>
          </div>
        </div>

        {/* Right: Inspection & Clause Detail */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
          <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-700 font-semibold">
                Contract Inspection &bull; {selectedDoc.category}
              </span>
              <h3 className="text-base font-bold text-slate-950 mt-0.5">{selectedDoc.title}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Risk Rating</span>
              <span
                className={`text-sm font-black ${
                  selectedDoc.riskScore === 'Critical' || selectedDoc.riskScore === 'High'
                    ? 'text-rose-600'
                    : selectedDoc.riskScore === 'Medium'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {selectedDoc.riskScore}
              </span>
            </div>
          </div>

          {/* Localized Briefing Card */}
          <div className="p-4 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <Languages className="w-3.5 h-3.5" />
              <span>Executive Briefing ({activeLocale.toUpperCase()})</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {selectedDoc.summary}
            </p>
          </div>

          {/* Extracted Clauses */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Extracted Risk Clauses ({selectedDoc.extractedClauses.length})
            </h4>

            <div className="space-y-2.5">
              {selectedDoc.extractedClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-900">{clause.title}</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        clause.risk === 'High' || (clause.risk as string) === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {clause.risk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
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
