'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/lib/tenant-context';
import {
  CreditCard,
  Coins,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  Key,
} from 'lucide-react';

export default function TenantAdminBillingPage() {
  const { activeTenant, updateSettings } = useTenant();
  const settings = activeTenant.settings;

  const [budget, setBudget] = useState(settings.tokenBudgetMonthly);
  const [savedAlert, setSavedAlert] = useState(false);

  const usagePercent = Math.min(
    100,
    Math.round((settings.tokensConsumed / settings.tokenBudgetMonthly) * 100)
  );

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ tokenBudgetMonthly: Number(budget) });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-indigo-700 font-mono mb-1 font-semibold">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tenant Admin &bull; Quotas &amp; Token Budget</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
          Token Budget &amp; API Rate Limits
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Atomic token ledger governance and sliding-window rate limit allocations for <strong>{activeTenant.name}</strong>.
        </p>
      </div>

      {savedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Monthly token budget updated successfully!</span>
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
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          Dashboard Sections
        </Link>
        <Link
          href={`/w/${activeTenant.slug}/admin/billing`}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white shadow-xs"
        >
          Quota &amp; Ledger
        </Link>
      </div>

      {/* Live Quota Consumption Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Active Billing Cycle Usage</span>
          </span>
          <span className="text-xs font-mono font-semibold text-slate-600">
            {activeTenant.tier} Plan Tier
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-black text-slate-950">
              {settings.tokensConsumed.toLocaleString()}
              <span className="text-sm font-normal text-slate-400"> / {settings.tokenBudgetMonthly.toLocaleString()} tokens</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              {(settings.tokenBudgetMonthly - settings.tokensConsumed).toLocaleString()} tokens remaining before throttling
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {usagePercent}%
          </div>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              usagePercent > 80 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Quota Allocation Form */}
      <form onSubmit={handleSaveBudget} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
          Adjust Monthly Token Allowance
        </h3>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label className="font-semibold text-slate-700">Monthly Budget (Tokens):</label>
            <span className="font-mono font-bold text-indigo-700">
              {Number(budget).toLocaleString()} tokens
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="1000000"
            step="25000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          Update Token Budget
        </button>
      </form>

      {/* API Rate Limits & Keys Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenant API Keys &amp; Throttling</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Edge Rate Limiting Standard (ARCH-003)
            </span>
            <p className="text-slate-700 font-mono text-[11px]">
              60 requests/minute per tenant IP &bull; Sliding-window Redis-ready algorithm
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Scoped API Token
            </span>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-800">
              <span>sk_live_tenant_{activeTenant.slug}_98a72b3c...</span>
              <span className="text-emerald-700 font-semibold">Active &bull; Read/Write</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
