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
    <aside className="w-64 bg-[#0c0e14] border-r border-zinc-800/80 text-zinc-300 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Workspace Selector Dropdown Header */}
      <div className="p-3.5 border-b border-zinc-800/80">
        <div className="relative group">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition-all cursor-pointer">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
              style={{ backgroundColor: activeTenant.settings.branding.primaryColor || '#0f766e' }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-zinc-100 truncate block">
                  {activeTenant.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  {activeTenant.tier}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block truncate">
                /w/{activeTenant.slug}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </div>

          {/* Hidden selector overlay */}
          <select
            value={activeTenant.slug}
            onChange={(e) => setActiveTenantBySlug(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Switch Workspace"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.slug} className="bg-zinc-900 text-white">
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
          <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
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
                        ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
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
            <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
              Agent Capabilities
            </span>
            <Link
              href={`/w/${activeTenant.slug}/settings`}
              className="text-[10px] text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Configure
            </Link>
          </div>

          <div className="space-y-0.5">
            {navItems.filter((i) => i.group === 'Capabilities' && i.visible).length === 0 ? (
              <div className="p-3 rounded-lg border border-dashed border-zinc-800 text-center">
                <p className="text-[11px] text-zinc-400">No capabilities enabled.</p>
                <Link
                  href={`/w/${activeTenant.slug}/settings`}
                  className="text-[11px] text-emerald-400 hover:underline font-medium block mt-1"
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
                          ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
          <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
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
                        ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#090b10] flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>RLS Isolated</span>
        </div>
        <Link
          href="/"
          className="text-zinc-400 hover:text-zinc-300 flex items-center gap-1 transition-colors"
          title="Return to Directory"
        >
          <span>All Workspaces</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
