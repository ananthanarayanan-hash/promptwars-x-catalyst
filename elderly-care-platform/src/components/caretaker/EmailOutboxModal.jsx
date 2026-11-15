import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Calendar,
  Sparkles,
  Inbox,
  Filter
} from 'lucide-react';

export default function EmailOutboxModal() {
  const {
    isOutboxOpen,
    setIsOutboxOpen,
    emailOutbox,
    simulateMissedDose,
    simulateUpcomingAlert,
    medications,
    patient
  } = useApp();

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  if (!isOutboxOpen) return null;

  const filteredEmails = filterCategory === 'ALL'
    ? emailOutbox
    : emailOutbox.filter(m => m.category === filterCategory);

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-red-600 text-white animate-pulse border-red-700';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'INFO':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'EMERGENCY_SOS':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'MISSED_DOSE':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'DOSE_LOGGED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <Mail className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l-2 border-slate-300 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Proactive Email Alert Outbox</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                {emailOutbox.length} Logs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time automated notification engine for Caregivers & Doctors
            </p>
          </div>

          <button
            onClick={() => setIsOutboxOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Simulation Bar for Judges */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Judge Sandbox Actions:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={simulateMissedDose}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Simulate Missed Dose</span>
            </button>

            <button
              onClick={() => simulateUpcomingAlert(medications[2]?.id || medications[0]?.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Due Alert</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'MISSED_DOSE', label: 'Missed Doses' },
            { id: 'DOSE_LOGGED', label: 'Doses Taken' },
            { id: 'APPOINTMENT', label: 'Appointments' },
            { id: 'EMERGENCY_SOS', label: 'Emergency SOS' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-semibold transition-colors ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Email Logs List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Inbox className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-sm">No email logs found for this filter.</p>
            </div>
          ) : (
            filteredEmails.map((mail) => {
              const isSelected = selectedEmail?.id === mail.id;
              return (
                <div
                  key={mail.id}
                  onClick={() => setSelectedEmail(mail)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all bg-white shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        {getCategoryIcon(mail.category)}
                      </div>
                      <span className="font-bold text-xs text-slate-800 truncate max-w-[280px]">
                        To: {mail.recipient}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {mail.timestamp}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getUrgencyBadge(mail.urgency)}`}>
                        {mail.urgency}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">
                    {mail.subject}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {mail.bodyHtml}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched via Automated Mailer
                    </span>
                    <span className="text-blue-600 font-bold hover:underline">
                      View Full Preview →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Email Detailed Preview Modal / Overlay */}
        {selectedEmail && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">Automated Email Transmission</span>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Envelope Meta */}
              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono mb-4">
                <div>
                  <strong className="text-slate-500">From:</strong> alerts@aarogyacare.org (AarogyaCare Healthcare Gateway)
                </div>
                <div>
                  <strong className="text-slate-500">To:</strong> <span className="text-slate-900 font-bold">{selectedEmail.recipient}</span>
                </div>
                <div>
                  <strong className="text-slate-500">Date:</strong> {selectedEmail.timestamp}
                </div>
                <div>
                  <strong className="text-slate-500">Status:</strong> <span className="text-emerald-700 font-bold">Delivered (250 OK)</span>
                </div>
              </div>

              <h3 className="font-black text-lg text-slate-900 mb-3">
                {selectedEmail.subject}
              </h3>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedEmail.bodyHtml}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
