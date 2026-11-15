import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import OverviewTab from './OverviewTab';
import MedicationsTab from './MedicationsTab';
import AppointmentsTab from './AppointmentsTab';
import AiInsightsTab from './AiInsightsTab';
import SettingsTab from './SettingsTab';
import {
  LayoutDashboard,
  Pill,
  Calendar,
  Sparkles,
  Mail,
  Settings,
  HeartPulse,
  Stethoscope,
  Users,
  ShieldAlert,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function CaretakerDashboard() {
  const { currentRole, setCurrentRole, patient, emailOutbox, setIsOutboxOpen } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'medications' | 'appointments' | 'insights' | 'settings'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview & Adherence', icon: LayoutDashboard },
    { id: 'medications', label: 'Medication Manager', icon: Pill },
    { id: 'appointments', label: 'Doctor Appointments', icon: Calendar },
    { id: 'insights', label: 'AI Routine & Drug Advisor', icon: Sparkles, badge: 'Smart' },
    { id: 'settings', label: 'Profile & Passcodes', icon: Settings }
  ];

  const isFamily = currentRole === 'family';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isFamily ? <Users className="w-5 h-5 text-purple-400" /> : <Stethoscope className="w-5 h-5 text-emerald-400" />}
          <span className="font-bold text-sm">
            {isFamily ? 'Family Member Portal' : 'Primary Caretaker Dashboard'}
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transform transition-transform duration-200 md:static md:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          {/* Patient Quick Info Card */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monitoring Patient</span>
            <div className="font-bold text-base text-white mt-0.5">{patient.name}</div>
            <div className="text-xs text-slate-400">Age {patient.age} • {patient.location ? patient.location.split(',')[1] || 'Outpatient' : 'Outpatient'}</div>
            <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Active View:</span>
              <span className={`font-bold px-2 py-0.5 rounded-md ${
                isFamily ? 'bg-purple-900/60 text-purple-300 border border-purple-700' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
              }`}>
                {isFamily ? `${patient.emergencyContacts[1]?.name || 'Family'}` : `${patient.emergencyContacts[0]?.name || 'Caretaker'}`}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsOutboxOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Email Alert Outbox</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">
              {emailOutbox.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentRole('elderly')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition-all border border-blue-500/30"
          >
            <HeartPulse className="w-4 h-4" />
            <span>Switch to Senior Mode</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'medications' && <MedicationsTab />}
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'insights' && <AiInsightsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
}
