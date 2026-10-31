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
} from 'lucide-react';

export default function SupportSwarmPage() {
  const { activeTenant, toggleModule, t, activeLocale } = useTenant();
  const isEnabled = activeTenant.settings.modules.supportSwarm;

  const [tickets, setTickets] = useState<SupportTicketItem[]>(() => {
    return MOCK_TICKETS.filter((tk) => tk.tenantId === activeTenant.id || tk.tenantId === 'tenant-support-303');
  });

  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(tickets[0]);
  const [replyText, setReplyText] = useState(tickets[0]?.suggestedReply || '');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isEnabled) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/60 mt-12">
        <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Support Swarm is Disabled</h2>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          This tenant workspace has not enabled the Customer Operations &amp; Support Swarm module.
        </p>
        <button
          onClick={() => toggleModule('supportSwarm', true)}
          className="mt-6 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors"
        >
          Enable Module Now
        </button>
      </div>
    );
  }

  const handleSelectTicket = (ticket: SupportTicketItem) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.suggestedReply);
  };

  const handleSendReply = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTickets((prev) =>
        prev.map((tk) => (tk.id === selectedTicket.id ? { ...tk, status: 'Resolved' } : tk))
      );
      setTimeout(() => setSentSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Kiro Autonomous Agent Swarm &bull; ID: specos-support-swarm</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t('settings.supportSwarmTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous ticket triage, sentiment monitoring, and cross-lingual human-in-the-loop replies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 font-mono bg-amber-950/80 border border-amber-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            3 Agents Active in Swarm
          </span>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>Ticket marked RESOLVED &bull; Localized reply delivered to customer!</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ticket Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Incoming Support Queue ({tickets.length})
            </span>
            <span className="text-[11px] text-amber-400 font-mono">Tenant: {activeTenant.slug}</span>
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
                      ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-white truncate">{tkt.subject}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        tkt.sentiment === 'Urgent' || tkt.sentiment === 'Frustrated'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {tkt.sentiment}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {tkt.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{tkt.customerName}</span>
                    <span className={tkt.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}>
                      {tkt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Ticket Detail & Agent Draft */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                  Ticket #{selectedTicket.id}
                </span>
                <span className="text-xs text-slate-400">&bull; {selectedTicket.createdAt}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedTicket.subject}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                From: {selectedTicket.customerName} ({selectedTicket.customerEmail})
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
              Lang: {selectedTicket.inputLocale.toUpperCase()}
            </span>
          </div>

          {/* Customer Message */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Original Customer Transmission:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              &ldquo;{selectedTicket.message}&rdquo;
            </p>
          </div>

          {/* Autonomous Swarm Draft */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Autonomous Kiro Swarm Suggested Response:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Human-in-the-Loop Safeguard</span>
            </div>

            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleSendReply}
                disabled={isSending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-lg shadow-amber-950 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching Reply...' : 'Approve & Send Localized Reply'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
