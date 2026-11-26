'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ghost, X, Sparkles, ArrowRight, ShieldCheck, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

export function GhostGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const quickLinks = [
    {
      title: '⚖️ Japanese Legal AI Suite',
      desc: 'Detect high-risk indemnification clauses',
      href: '/w/lexis-legal/documents',
      tag: 'ARCH-001',
    },
    {
      title: '🎧 Multilingual Support Swarm',
      desc: 'Spanish customer sentiment triage',
      href: '/w/atencion-global/support',
      tag: 'DEV-001',
    },
    {
      title: '⚡ Super Admin Provisioning',
      desc: 'Real-time preview tenant wizard',
      href: '/super-admin?tab=new',
      tag: 'PROD-003',
    },
    {
      title: '🛡️ DevSecOps Code Auditor',
      desc: 'Inspect specs against Kiro steering rules',
      href: '/w/devshield-audit/code-audit',
      tag: 'DEV-004',
    },
  ];

  return (
    <aside aria-label="Kiro Ghost Guide" className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl border border-slate-700 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          title="Open Kiro Ghost Guide"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xl select-none group-hover:scale-110 transition-transform">👻</span>
          <span className="text-xs font-semibold tracking-wide text-slate-100">Kiro Ghost Guide</span>
          <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
            Kiroween
          </span>
        </button>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">👻</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Kiro Ghost Guide</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                    Skeleton Crew
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Scare me, then make it easy!</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Collapse'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {/* Spooky Witty Hook */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <p className="font-semibold flex items-center gap-1.5 text-amber-950 mb-1">
                  <span>🎃</span> Don&apos;t let SaaS complexity haunt you!
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Judges, skip the wandering! SpecOS morphs one skeleton core into vertical SaaS apps across 7 languages.
                  Here is where to tap next:
                </p>
              </div>

              {/* Quick Tap Actions */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                  1-Click Judge Teleport
                </p>
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group block p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 group-hover:text-slate-700 flex items-center justify-between">
                      <span>{item.desc}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transform group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </Link>
                ))}
              </div>

              {/* Open Source npm Package Link */}
              <div className="pt-2 border-t border-slate-100">
                <a
                  href="https://www.npmjs.com/package/specos-agent-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📦</span>
                    <div>
                      <p className="text-xs font-semibold">Published npm Package</p>
                      <p className="text-[10px] text-slate-400 font-mono">specos-agent-kit (v1.3.0)</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              {/* Mischievous Footer Note */}
              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Kiro Steering: 100% Isolated</span>
                </span>
                <span className="font-mono text-slate-400">Zero Dead Threads</span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
