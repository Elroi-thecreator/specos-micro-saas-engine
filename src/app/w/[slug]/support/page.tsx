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
      <div className="p-12 text-center max-w-md mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 mt-16">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Support Swarm Disabled</h2>
        <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
          This tenant workspace does not have the Customer Operations &amp; Support Swarm module active.
        </p>
        <button
          onClick={() => toggleModule('supportSwarm', true)}
          className="mt-6 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors"
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

  const handleSendReply = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTickets((prev) =>
        prev.map((tk) => (tk.id === selectedTicket.id ? { ...tk, status: 'Resolved' } : tk))
      );
      setTimeout(() => setSentSuccess(false), 3000);
    }, 1100);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Kiro Autonomous Swarm &bull; specos-support-swarm</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t('settings.supportSwarmTitle')}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Autonomous ticket triage, sentiment detection, and cross-lingual customer responses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-300 font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            3 Agents Orchestrated
          </span>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Ticket marked RESOLVED &bull; Customer received localized reply!</span>
        </div>
      )}

      {/* Main Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
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
                      ? 'bg-zinc-800/90 border-amber-500/80 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-white truncate">{tkt.subject}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        tkt.sentiment === 'Urgent' || tkt.sentiment === 'Frustrated'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      }`}
                    >
                      {tkt.sentiment}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {tkt.message}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
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

        {/* Right: Conversation Pane & Agent Draft */}
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">
                  Ticket #{selectedTicket.id}
                </span>
                <span className="text-xs text-zinc-400">&bull; {selectedTicket.createdAt}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedTicket.subject}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                From: {selectedTicket.customerName} ({selectedTicket.customerEmail})
              </p>
            </div>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              Lang: {selectedTicket.inputLocale.toUpperCase()}
            </span>
          </div>

          {/* Customer Message Card */}
          <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Customer Message
            </span>
            <p className="text-xs text-zinc-200 leading-relaxed font-sans">
              &ldquo;{selectedTicket.message}&rdquo;
            </p>
          </div>

          {/* Autonomous Response Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Autonomous Kiro Swarm Suggested Reply
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Confidence: 98.4%</span>
            </div>

            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
            />

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={handleSendReply}
                disabled={isSending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Dispatching...' : 'Approve & Deliver Response'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
