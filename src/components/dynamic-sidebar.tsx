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
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function DynamicSidebar() {
  const pathname = usePathname();
  const { activeTenant, tenants, setActiveTenantBySlug, t, isRtl } = useTenant();
  const modules = activeTenant.settings.modules;

  const navItems = [
    {
      href: `/w/${activeTenant.slug}`,
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      visible: true,
    },
    {
      href: `/w/${activeTenant.slug}/documents`,
      label: t('nav.documents'),
      icon: FileText,
      visible: modules.docIntel,
      badge: 'Agent Active',
    },
    {
      href: `/w/${activeTenant.slug}/support`,
      label: t('nav.support'),
      icon: MessageSquare,
      visible: modules.supportSwarm,
      badge: 'Swarm Live',
    },
    {
      href: `/w/${activeTenant.slug}/code-audit`,
      label: t('nav.codeAudit'),
      icon: ShieldAlert,
      visible: modules.codeAudit,
      badge: 'Specs v1',
    },
    {
      href: `/w/${activeTenant.slug}/settings`,
      label: t('nav.settings'),
      icon: Settings,
      visible: true,
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-colors"
            style={{ backgroundColor: activeTenant.settings.branding.primaryColor || '#0f766e' }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm tracking-tight truncate text-slate-100">
              {activeTenant.settings.branding.name || activeTenant.name}
            </h1>
            <p className="text-xs text-slate-400 truncate">
              {activeTenant.settings.branding.tagline || 'Autonomous Micro-SaaS Engine'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Enabled Capabilities
        </div>

        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
      </div>

      {/* Tenant Switcher at Bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
          <Building2 className="w-3.5 h-3.5" />
          {t('nav.switchTenant')}
        </label>
        <div className="relative">
          <select
            value={activeTenant.slug}
            onChange={(e) => setActiveTenantBySlug(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none pr-8"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name} ({t.settings.defaultLocale.toUpperCase()})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center px-1">
          <span>Tier: <strong className="text-slate-300">{activeTenant.tier}</strong></span>
          <span className="font-mono text-slate-400">ID: {activeTenant.slug}</span>
        </div>
      </div>
    </aside>
  );
}
