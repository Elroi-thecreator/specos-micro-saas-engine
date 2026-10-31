'use client';

import React from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  Settings,
  Building,
  Sliders,
  SlidersHorizontal,
  CreditCard,
  ArrowRight,
  Shield,
  Layers,
  Coins,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export default function TenantSettingsIndexPage() {
  const { activeTenant } = useTenant();
  const settings = activeTenant.settings;

  const adminSections = [
    {
      title: 'General & Organization Identity',
      desc: 'Workspace display name, tagline, brand accent color, and primary operating language.',
      href: `/w/${activeTenant.slug}/admin/general`,
      icon: Building,
      badge: settings.defaultLocale.toUpperCase(),
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Autonomous Modules & Swarms',
      desc: 'Turnkey feature flags for Legal Intelligence, Customer Support Swarm, and Code Auditor.',
      href: `/w/${activeTenant.slug}/admin/modules`,
      icon: Sliders,
      badge: `${Object.values(settings.modules).filter(Boolean).length} / 3 Active`,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Dashboard Sections Customizer',
      desc: 'Configure what telemetry ribbons, streams, and operational launchpads appear on your dashboard.',
      href: `/w/${activeTenant.slug}/admin/sections`,
      icon: SlidersHorizontal,
      badge: 'Configurable',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Quota & Atomic Token Budget',
      desc: 'Monthly token allowance slider, sliding-window rate limits, and live ledger consumption.',
      href: `/w/${activeTenant.slug}/admin/billing`,
      icon: CreditCard,
      badge: `${settings.tokenBudgetMonthly.toLocaleString()} Tokens`,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1 font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Tenant Admin &bull; {activeTenant.slug}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Workspace Administration
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Separated management centers for identity, autonomous agent capabilities, dashboard layout, and billing quotas.
        </p>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adminSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${sec.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {sec.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-950 group-hover:text-indigo-600 transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-indigo-600 mt-4">
                <span>Configure Settings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Super Admin Callout */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-indigo-950 block">Need to provision another organization?</span>
            <span className="text-indigo-800">
              Platform Super Admins can create new tenant partitions and configure their sections in the central console.
            </span>
          </div>
        </div>

        <Link
          href="/super-admin?tab=new"
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          Super Admin Console &rarr;
        </Link>
      </div>
    </div>
  );
}
