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
  Copy,
  Check,
  Terminal,
  RefreshCw,
} from 'lucide-react';

export default function TenantAdminBillingPage() {
  const { activeTenant, updateSettings } = useTenant();
  const settings = activeTenant.settings;

  const [budget, setBudget] = useState(settings.tokenBudgetMonthly);
  const [savedAlert, setSavedAlert] = useState(false);
  const [apiKey, setApiKey] = useState(`specos_live_${activeTenant.slug}_${Math.random().toString(36).substring(2, 10)}`);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<any | null>(null);

  const handleRegenerateKey = () => {
    setApiKey(`specos_live_${activeTenant.slug}_${Math.random().toString(36).substring(2, 12)}`);
  };

  const handleCopyKey = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(apiKey);
    }
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const curlCommand = `curl -X POST https://specos-micro-saas-engine.vercel.app/api/v1/w/${activeTenant.slug}/agent/run \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"moduleKey":"docIntel","payload":{"title":"Master Cloud Agreement"}}'`;

  const handleCopyCurl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(curlCommand);
    }
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSimulateApiCall = async () => {
    setIsSimulating(true);
    setSimulationResponse(null);
    try {
      const res = await fetch(`/api/v1/w/${activeTenant.slug}/agent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleKey: 'docIntel',
          payload: { title: 'Headless API Test Contract' },
        }),
      });
      const data = await res.json();
      setSimulationResponse({ httpStatus: res.status, ...data });
    } catch (err: any) {
      setSimulationResponse({ error: err.message });
    } finally {
      setIsSimulating(false);
    }
  };

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
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scoped Tenant API Access &bull; Edge Gateway</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
            Active Token
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Rate Limiting Notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Sliding-Window Rate Limit (Rule ARCH-003)
              </span>
              <p className="text-slate-700 font-mono text-[11px] mt-0.5">
                Max 60 requests/minute per tenant &bull; Atomic token ledger accounting
              </p>
            </div>
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          </div>

          {/* API Key Box */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Verifiable API Token:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRegenerateKey}
                  className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                  title="Generate new token string"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="font-mono text-xs text-indigo-950 bg-white p-2 rounded border border-slate-200 break-all select-all font-semibold">
              {apiKey}
            </div>
          </div>

          {/* Headless cURL Playground */}
          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400 flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Headless Agent Execution (cURL)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            <pre className="text-[10px] font-mono text-emerald-300 bg-slate-900 p-2.5 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
              {curlCommand}
            </pre>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                Dispatches to async queue &bull; returns 202 Accepted + Job ID
              </span>
              <button
                type="button"
                onClick={handleSimulateApiCall}
                disabled={isSimulating}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-bounce' : ''}`} />
                <span>{isSimulating ? 'Testing Endpoint...' : 'Simulate Live API Dispatch'}</span>
              </button>
            </div>

            {simulationResponse && (
              <div className="mt-2 p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-400">
                <span className="text-slate-400 block mb-0.5">Response (HTTP {simulationResponse.httpStatus || 202}):</span>
                {JSON.stringify(simulationResponse, null, 2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
