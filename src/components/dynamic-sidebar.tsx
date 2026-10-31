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
  Layers,
  CircleDot,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export function DynamicSidebar() {
  const pathname = usePathname();
  const { activeTenant, tenants, setActiveTenantBySlug, t } = useTenant();
  const modules = activeTenant.settings.modules;

  const navItems = [
    {
      href: `/w/${activeTenant.slug}`,
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      visible: true,
      group: 'Core',
    },
    {
      href: `/w/${activeTenant.slug}/documents`,
      label: t('nav.documents'),
      icon: FileText,
      visible: modules.docIntel,
      badge: 'Active',
      group: 'Capabilities',
    },
    {
      href: `/w/${activeTenant.slug}/support`,
      label: t('nav.support'),
      icon: MessageSquare,
      visible: modules.supportSwarm,
      badge: 'Live',
      group: 'Capabilities',
    },
    {
      href: `/w/${activeTenant.slug}/code-audit`,
      label: t('nav.codeAudit'),
      icon: ShieldAlert,
      visible: modules.codeAudit,
      badge: 'Auditing',
      group: 'Capabilities',
    },
    {
      href: `/w/${activeTenant.slug}/settings`,
      label: t('nav.settings'),
      icon: Settings,
      visible: true,
      group: 'Admin',
    },
  ];

  const initials = activeTenant.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col h-screen sticky top-0 select-none z-30 shadow-sm">
      {/* Workspace Selector Dropdown Header */}
      <div className="p-3.5 border-b border-slate-200">
        <div className="relative group">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-sm">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
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
            onChange={(e) => setActiveTenantBySlug(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Switch Workspace"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.slug} className="bg-white text-slate-900">
                {t.name} ({t.tier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
        {/* Core */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Platform
          </div>
          <div className="space-y-0.5">
            {navItems
              .filter((item) => item.group === 'Core' && item.visible)
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Enabled Capabilities */}
        <div>
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Agent Capabilities
            </span>
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="text-[10px] text-slate-500 hover:text-slate-800 transition-colors"
            >
              Configure
            </Link>
          </div>

          <div className="space-y-0.5">
            {navItems.filter((i) => i.group === 'Capabilities' && i.visible).length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-slate-200 text-center bg-slate-50">
                <p className="text-[11px] text-slate-500">No capabilities enabled.</p>
                <Link
                  href={`/w/${activeTenant.slug}/settings`}
                  className="text-[11px] text-emerald-600 hover:underline font-semibold block mt-1"
                >
                  Enable in Settings &rarr;
                </Link>
              </div>
            ) : (
              navItems
                .filter((item) => item.group === 'Capabilities' && item.visible)
                .map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
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

        {/* Administration */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Governance
          </div>
          <div className="space-y-0.5">
            {navItems
              .filter((item) => item.group === 'Admin' && item.visible)
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-600">RLS Isolated</span>
        </div>
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors font-medium"
          title="Return to Directory"
        >
          <span>All Workspaces</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
