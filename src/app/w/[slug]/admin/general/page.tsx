'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import { SUPPORTED_LOCALES } from '@/lib/i18n/translations';
import { SupportedLocale } from '@/lib/types';
import {
  Building,
  CheckCircle2,
  Globe,
  Palette,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function TenantAdminGeneralPage() {
  const { activeTenant, updateSettings, setActiveLocale, activeLocale } = useTenant();
  const settings = activeTenant.settings;

  const [savedAlert, setSavedAlert] = useState(false);
  const [name, setName] = useState(settings.branding.name || activeTenant.name);
  const [tagline, setTagline] = useState(settings.branding.tagline);
  const [primaryColor, setPrimaryColor] = useState(settings.branding.primaryColor || '#2563eb');
  const [locale, setLocale] = useState<SupportedLocale>(settings.defaultLocale);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      branding: {
        name,
        tagline,
        primaryColor,
      },
      defaultLocale: locale,
    });
    setActiveLocale(locale);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-mono mb-1 font-semibold">
          <Building className="w-3.5 h-3.5" />
          <span>Tenant Admin &bull; General &amp; Identity</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Organization Profile &amp; Internationalization
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Configure branding name, workspace tagline, accent theme, and default operating language for <strong>{activeTenant.name}</strong>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Organization profile updated successfully!</span>
        </div>
      )}

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <Link
          href={`/w/${activeTenant.slug}/admin/general`}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-xs"
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
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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

      {/* General Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>Identity &amp; Styling</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workspace Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Default Operating Language</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Language for Autonomous Agents
            </label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as SupportedLocale)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.flag} {loc.name} ({loc.nativeName}) {loc.dir === 'rtl' ? '— Right-to-Left (RTL)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
