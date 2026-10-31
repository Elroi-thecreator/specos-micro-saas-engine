'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import { TenantSectionConfig } from '@/lib/types';
import {
  SlidersHorizontal,
  CheckCircle2,
  LayoutDashboard,
  Activity,
  Layers,
  Coins,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function TenantAdminSectionsPage() {
  const { activeTenant, updateSections } = useTenant();
  const settings = activeTenant.settings;

  const initialSections: TenantSectionConfig = settings.sections || {
    showOverviewKpis: true,
    showLiveAgentFeed: true,
    showRiskMatrix: true,
    showQuickActions: true,
    showTokenMeter: true,
  };

  const [sections, setLocalSections] = useState<TenantSectionConfig>(initialSections);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleToggle = (key: keyof TenantSectionConfig) => {
    const updated = {
      ...sections,
      [key]: !sections[key],
    };
    setLocalSections(updated);
    updateSections(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-mono mb-1 font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Tenant Admin &bull; Dashboard Layout &amp; Section Customizer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Dashboard Sections &amp; Widget Customization
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Customize what information, streams, and operational tools appear on the main dashboard for <strong>{activeTenant.name}</strong>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Dashboard layout updated! Changes are live on your overview page.</span>
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
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Modules &amp; Swarms
        </Link>
        <Link
          href={`/w/${activeTenant.slug}/admin/sections`}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-xs"
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

      {/* Sections Configurator List */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-xs">
        {/* Section 1: Overview KPIs */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950">Executive KPI Metrics Ribbon</h3>
                {sections.showOverviewKpis ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Visible
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Displays the 4 high-level telemetry cards (Active Modules, Tokens Consumed, Locale, and Isolation Status) at the top of the dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('showOverviewKpis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              sections.showOverviewKpis
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sections.showOverviewKpis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sections.showOverviewKpis ? 'Hide Section' : 'Show Section'}</span>
          </button>
        </div>

        {/* Section 2: Live Agent Activity Stream */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950">Live Agent Activity Stream</h3>
                {sections.showLiveAgentFeed ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Visible
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Shows real-time audit logs of autonomous agent dispatches, risk evaluations, and localized customer replies.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('showLiveAgentFeed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              sections.showLiveAgentFeed
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sections.showLiveAgentFeed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sections.showLiveAgentFeed ? 'Hide Section' : 'Show Section'}</span>
          </button>
        </div>

        {/* Section 3: Risk Governance Matrix */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950">Risk Governance &amp; Compliance Matrix</h3>
                {sections.showRiskMatrix ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Visible
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Provides a compliance overview chart showing contract liabilities, code violations, and high-risk flags.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('showRiskMatrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              sections.showRiskMatrix
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sections.showRiskMatrix ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sections.showRiskMatrix ? 'Hide Section' : 'Show Section'}</span>
          </button>
        </div>

        {/* Section 4: Quick Action Launchpad */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950">Quick Action Launchpad</h3>
                {sections.showQuickActions ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Visible
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Renders 1-click execution cards for scanning contracts, dispatching support swarms, or verifying architecture specs.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('showQuickActions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              sections.showQuickActions
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sections.showQuickActions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sections.showQuickActions ? 'Hide Section' : 'Show Section'}</span>
          </button>
        </div>

        {/* Section 5: Header Token Meter */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-950">Header Token Budget Meter</h3>
                {sections.showTokenMeter ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Visible
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Displays the live token usage bar in the top navigation bar across all workspace pages.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('showTokenMeter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 ${
              sections.showTokenMeter
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sections.showTokenMeter ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sections.showTokenMeter ? 'Hide Meter' : 'Show Meter'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Link
          href={`/w/${activeTenant.slug}`}
          className="text-xs font-semibold text-indigo-700 hover:underline"
        >
          &larr; View Live Dashboard with New Layout
        </Link>
      </div>
    </div>
  );
}
