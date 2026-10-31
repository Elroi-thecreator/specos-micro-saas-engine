'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/lib/tenant-context';
import {
  FileText,
  MessageSquare,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  ChevronDown,
  ExternalLink,
  PlusCircle,
  Shield,
  Sliders,
  SlidersHorizontal,
  CreditCard,
  Building,
} from 'lucide-react';

export function DynamicSidebar() {
  const pathname = usePathname();
  const { activeTenant, tenants, setActiveTenantBySlug, t } = useTenant();
  const modules = activeTenant.settings.modules;

  const coreNavItems = [
    {
      href: `/w/${activeTenant.slug}`,
      label: t('nav.dashboard') || 'Overview',
      icon: LayoutDashboard,
      active: pathname === `/w/${activeTenant.slug}`,
    },
  ];

  const appNavItems = [
    {
      href: `/w/${activeTenant.slug}/documents`,
      label: 'Document Intelligence',
      icon: FileText,
      visible: modules.docIntel,
      badge: 'Active',
      active: pathname.startsWith(`/w/${activeTenant.slug}/documents`),
    },
    {
      href: `/w/${activeTenant.slug}/support`,
      label: 'Customer Support Swarm',
      icon: MessageSquare,
      visible: modules.supportSwarm,
      badge: 'Live',
      active: pathname.startsWith(`/w/${activeTenant.slug}/support`),
    },
    {
      href: `/w/${activeTenant.slug}/code-audit`,
      label: 'Code & Specs Auditor',
      icon: ShieldAlert,
      visible: modules.codeAudit,
      badge: 'Auditing',
      active: pathname.startsWith(`/w/${activeTenant.slug}/code-audit`),
    },
  ];

  const adminNavItems = [
    {
      href: `/w/${activeTenant.slug}/admin/general`,
      label: 'General & Identity',
      icon: Building,
      active: pathname === `/w/${activeTenant.slug}/admin/general`,
    },
    {
      href: `/w/${activeTenant.slug}/admin/modules`,
      label: 'Modules & Swarms',
      icon: Sliders,
      active: pathname === `/w/${activeTenant.slug}/admin/modules` || pathname === `/w/${activeTenant.slug}/settings`,
    },
    {
      href: `/w/${activeTenant.slug}/admin/sections`,
      label: 'Dashboard Layout',
      icon: SlidersHorizontal,
      active: pathname === `/w/${activeTenant.slug}/admin/sections`,
    },
    {
      href: `/w/${activeTenant.slug}/admin/billing`,
      label: 'Quota & Ledger',
      icon: CreditCard,
      active: pathname === `/w/${activeTenant.slug}/admin/billing`,
    },
  ];

  const initials = activeTenant.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col h-screen sticky top-0 select-none z-30 shadow-xs">
      {/* Workspace Selector Dropdown Header */}
      <div className="p-3.5 border-b border-slate-200">
        <div className="relative group">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-xs">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0"
              style={{ backgroundColor: activeTenant.settings.branding.primaryColor || '#0f766e' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 truncate block">
                  {activeTenant.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-semibold">
                  {activeTenant.tier}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                /w/{activeTenant.slug}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Hidden selector overlay */}
          <select
            value={activeTenant.slug}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                window.location.href = '/super-admin?tab=new';
              } else {
                setActiveTenantBySlug(e.target.value);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Switch Workspace"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.slug} className="bg-white text-slate-900">
                {t.name} ({t.tier})
              </option>
            ))}
            <option value="__new__" className="bg-white text-indigo-600 font-bold">
              + Provision New Tenant...
            </option>
          </select>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
        {/* Core Overview */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Workspace
          </div>
          <div className="space-y-0.5">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Enabled Capabilities / Separate Applications */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Applications
            </span>
            <Link
              href={`/w/${activeTenant.slug}/admin/modules`}
              className="text-[10px] text-slate-500 hover:text-slate-800 transition-colors"
            >
              Configure
            </Link>
          </div>

          <div className="space-y-0.5">
            {appNavItems.filter((i) => i.visible).length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-slate-200 text-center bg-slate-50">
                <p className="text-[11px] text-slate-500">No applications active.</p>
                <Link
                  href={`/w/${activeTenant.slug}/admin/modules`}
                  className="text-[11px] text-emerald-600 hover:underline font-semibold block mt-1"
                >
                  Enable in Admin &rarr;
                </Link>
              </div>
            ) : (
              appNavItems
                .filter((item) => item.visible)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        item.active
                          ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item.badge}
                      </span>
                    </Link>
                  );
                })
            )}
          </div>
        </div>

        {/* Separated Tenant Admin Pages */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Tenant Administration
          </div>
          <div className="space-y-0.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-slate-100 text-slate-950 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info: Super Admin Quick-Launch */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
        <Link
          href="/super-admin"
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shadow-xs"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Super Admin Console</span>
          </div>
          <span className="text-[10px] font-mono bg-indigo-200/60 px-1.5 py-0.2 rounded text-indigo-800">
            Platform
          </span>
        </Link>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-600">ARCH-001 Isolated</span>
          </div>
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors font-medium"
            title="Return to Directory"
          >
            <span>Directory</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
