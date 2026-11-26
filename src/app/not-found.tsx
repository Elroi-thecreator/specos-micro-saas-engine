import Link from 'next/link';
import { Ghost, ArrowRight, ShieldCheck, Home, Settings, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Playful Ghost Icon */}
        <div className="relative inline-block">
          <div className="text-7xl animate-bounce select-none">👻</div>
          <span className="absolute -top-1 -right-2 bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-300">
            404: SPOOKY ERROR
          </span>
        </div>

        {/* Witty Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            The Ghosts Ate This Route!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You wandered into an unpartitioned void. But don&apos;t tremble—our Kiro steering rules (<code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">ARCH-001</code>) prevented any cross-tenant data leaks.
          </p>
          <p className="text-xs text-slate-400 italic">
            &ldquo;Even hackathon phantoms respect tenant boundary isolation.&rdquo;
          </p>
        </div>

        {/* Clear What to Tap Next Actions */}
        <div className="space-y-2.5 pt-2 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Here is what to tap next:
          </p>

          <Link
            href="/"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium text-xs group"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Return to Safety (Home Page)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/super-admin"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-xs text-slate-800 group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Super Admin Control Console</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/w/lexis-legal/documents"
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-xs text-slate-800 group"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Japanese Legal AI Workspace</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Footer verification badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Kiro Steering & Tenancy Guaranteed</span>
        </div>
      </div>
    </div>
  );
}
