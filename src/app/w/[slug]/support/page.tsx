'use client';

import React, { useState } from 'react';
import { useTenant } from '@/lib/tenant-context';
import { MOCK_TICKETS } from '@/lib/mock-data';
import { SupportTicketItem } from '@/lib/types';
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Clock,
  ThumbsUp,
  Inbox,
  Flame,
  Check,
} from 'lucide-react';

export default function SupportSwarmPage() {
  const { activeTenant, toggleModule, executeAgentJob, t, activeLocale } = useTenant();
  const isEnabled = activeTenant.settings.modules.supportSwarm;

  const [tickets, setTickets] = useState<SupportTicketItem[]>(() => {
    return MOCK_TICKETS.filter((tk) => tk.tenantId === activeTenant.id || tk.tenantId === 'tenant-support-303');
  });

  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(tickets[0]);
  const [replyText, setReplyText] = useState(tickets[0]?.suggestedReply || '');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  if (!isEnabled) {
    return (
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white mt-16 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">Support Swarm Disabled</h2>
        <p className="text-slate-600 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Customer Operations &amp; Support Swarm module active.
        </p>
        <button
          onClick={() => toggleModule('supportSwarm', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          Enable Module
        </button>
      </div>
    );
  }

  const handleSelectTicket = (ticket: SupportTicketItem) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.suggestedReply);
  };

  const handleSendReply = async () => {
    setIsSending(true);
    const res = await executeAgentJob('supportSwarm', {
      ticketId: selectedTicket.id,
      reply: replyText,
    });
    setIsSending(false);
    if (res.success) {
      setJobId(res.jobId || null);
      setSentSuccess(true);
      setTickets((prev) =>
        prev.map((tk) => (tk.id === selectedTicket.id ? { ...tk, status: 'Resolved' } : tk))
      );
      setTimeout(() => setSentSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-mono mb-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Kiro Autonomous Swarm &bull; specos-support-swarm</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {t('settings.supportSwarmTitle')}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Autonomous ticket triage, sentiment detection, and cross-lingual customer responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-700 font-mono bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            3 Agents Orchestrated
          </span>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ticket marked RESOLVED &bull; Localized reply delivered via worker queue!</span>
          </div>
          {jobId && (
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
              ID: {jobId}
            </span>
          )}
        </div>
      )}

      {/* Main Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono font-medium">
            <span>INCOMING TICKETS ({tickets.length})</span>
            <span>TENANT: {activeTenant.slug}</span>
          </div>

          <div className="space-y-2">
            {tickets.map((tkt) => {
              const isSelected = selectedTicket.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => handleSelectTicket(tkt)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">{tkt.subject}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        tkt.sentiment === 'Urgent' || tkt.sentiment === 'Frustrated'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {tkt.sentiment}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {tkt.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{tkt.customerName}</span>
                    <span className={tkt.status === 'Resolved' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                      {tkt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Conversation Pane & Agent Draft */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
          <div className="flex items-start justify-between border-b border-slate-200 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-semibold">
                  Ticket #{selectedTicket.id}
                </span>
                <span className="text-xs text-slate-400">&bull; {selectedTicket.createdAt}</span>
              </div>
              <h3 className="text-base font-bold text-slate-950 mt-1">{selectedTicket.subject}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                From: {selectedTicket.customerName} ({selectedTicket.customerEmail})
              </p>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              Lang: {selectedTicket.inputLocale.toUpperCase()}
            </span>
          </div>

          {/* Customer Message Card */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Customer Message
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              &ldquo;{selectedTicket.message}&rdquo;
            </p>
          </div>

          {/* Autonomous Response Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Autonomous Kiro Swarm Suggested Reply
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">Confidence: 98.4%</span>
            </div>

            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 leading-relaxed font-sans"
            />

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={handleSendReply}
                disabled={isSending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Dispatching to Queue...' : 'Approve & Deliver Response'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
