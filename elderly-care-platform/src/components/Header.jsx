import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartPulse,
  Stethoscope,
  Users,
  Clock,
  Mail,
  AlertTriangle,
  LogOut,
  ChevronDown,
  RefreshCw,
  Bell
} from 'lucide-react';

export default function Header() {
  const {
    currentRole,
    setCurrentRole,
    patient,
    emailOutbox,
    setIsOutboxOpen,
    simulateMissedDose,
    activeToast
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleBadge = () => {
    if (currentRole === 'elderly') {
      return {
        label: 'Senior Mode',
        name: patient.name,
        color: 'bg-blue-600 text-white',
        icon: HeartPulse
      };
    }
    if (currentRole === 'caretaker') {
      return {
        label: 'Caretaker Dashboard',
        name: patient.emergencyContacts[0].name,
        color: 'bg-emerald-600 text-white',
        icon: Stethoscope
      };
    }
    return {
      label: 'Family Monitor',
      name: patient.emergencyContacts[1].name,
      color: 'bg-purple-600 text-white',
      icon: Users
    };
  };

  const badge = getRoleBadge();
  const Icon = badge.icon;

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/50">
              <span className="text-xl sm:text-2xl">💊</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-heading text-white">
                  <span className="text-blue-400">Aarogya</span>Care
                </span>
                <span className="hidden md:inline-block text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                  Clinical High-Contrast
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">
                Patient: <strong className="text-white font-semibold">{patient.name}</strong> (74, Malleshwaram)
              </p>
            </div>
          </div>

          {/* Center: Live Real-Time Indian Clock */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-medium">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span className="text-xs font-mono font-bold text-white pl-1 border-l border-slate-700">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Judge Simulation Action: Simulate Missed Dose */}
            <button
              onClick={simulateMissedDose}
              title="Test real-time proactive email & notification trigger"
              className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce shrink-0" />
              <span className="hidden sm:inline">Simulate Missed Dose</span>
              <span className="sm:hidden">Missed Alert</span>
            </button>

            {/* Email Outbox Drawer Trigger */}
            <button
              onClick={() => setIsOutboxOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-semibold text-xs sm:text-sm transition-all"
            >
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="hidden md:inline">Alert Outbox</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-600 text-white">
                {emailOutbox.length}
              </span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${badge.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="max-w-[100px] sm:max-w-none truncate">{badge.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 text-slate-200"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 mb-1">
                    Switch Active Mode
                  </div>

                  <button
                    onClick={() => {
                      setCurrentRole('elderly');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all ${
                      currentRole === 'elderly' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <HeartPulse className="w-4 h-4" />
                    <div>
                      <div>Senior Mode (Ramesh)</div>
                      <div className="text-[11px] opacity-80">High-Contrast & Large UI</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('caretaker');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all ${
                      currentRole === 'caretaker' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <div>
                      <div>Caretaker Dashboard (Priya)</div>
                      <div className="text-[11px] opacity-80">Full Clinical Schedule & Logs</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('family');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all ${
                      currentRole === 'family' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <div>
                      <div>Family Monitor (Rahul)</div>
                      <div className="text-[11px] opacity-80">Remote Adherence Digest</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setCurrentRole(null);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out / Switch PIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-2xl shadow-2xl border-2 flex items-start gap-3 transition-all animate-slide-up bg-slate-900 border-slate-700 text-white">
          <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-white">{activeToast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
