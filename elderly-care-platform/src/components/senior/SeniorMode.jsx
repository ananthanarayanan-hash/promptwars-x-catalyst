import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Volume2,
  AlertOctagon,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  PhoneCall,
  Check,
  RotateCcw,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function SeniorMode() {
  const {
    patient,
    medications,
    markDose,
    speakText,
    stats,
    setIsEmergencyModalOpen
  } = useApp();

  const [filterSlot, setFilterSlot] = useState('ALL'); // 'ALL' | 'Morning' | 'Afternoon' | 'Evening' | 'Night'

  const filteredMeds = filterSlot === 'ALL'
    ? medications
    : medications.filter(m => m.timeSlot.toLowerCase() === filterSlot.toLowerCase());

  const getSlotIcon = (slot) => {
    switch (slot.toLowerCase()) {
      case 'morning':
        return <Sun className="w-6 h-6 text-amber-500" />;
      case 'afternoon':
        return <Sun className="w-6 h-6 text-orange-500" />;
      case 'evening':
        return <Sunset className="w-6 h-6 text-rose-500" />;
      case 'night':
        return <Moon className="w-6 h-6 text-indigo-500" />;
      default:
        return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'taken':
        return {
          label: '✓ TAKEN',
          bg: 'bg-emerald-600 text-white border-2 border-emerald-500',
          cardBorder: 'border-emerald-500 bg-emerald-50/40'
        };
      case 'missed':
        return {
          label: '✕ MISSED',
          bg: 'bg-rose-600 text-white border-2 border-rose-500 animate-pulse',
          cardBorder: 'border-rose-500 bg-rose-50/50'
        };
      case 'upcoming':
      default:
        return {
          label: '⏳ UPCOMING',
          bg: 'bg-amber-500 text-slate-900 border-2 border-amber-400 font-black',
          cardBorder: 'border-slate-300 bg-white'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Banner: Emergency SOS & Senior Greeting */}
      <div className="bg-slate-900 border-b-4 border-slate-950 text-white py-6 px-4 sm:px-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400 text-blue-300 text-sm font-bold tracking-wide uppercase mb-2">
              <span>Senior Friendly Interface</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Namaskara, {patient.name}!
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-medium mt-1">
              Today is <strong className="text-white font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
            </p>
          </div>

          {/* Prominent High-Contrast Emergency SOS Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full md:w-auto h-20 px-8 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xl sm:text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all transform active:scale-95 border-4 border-white animate-emergency ring-4 ring-red-600/40"
          >
            <AlertOctagon className="w-10 h-10 text-white shrink-0 animate-bounce" />
            <div className="text-left">
              <div className="leading-tight">NEED HELP?</div>
              <div className="text-xs sm:text-sm font-bold text-red-100 uppercase tracking-wider">Alert Caretaker Priya</div>
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Adherence & Daily Progress Card */}
        <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-sm font-bold tracking-wider uppercase text-slate-500">Today's Progress</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                {stats.taken} of {stats.total} Medicines Taken
              </h2>
              <p className="text-lg text-slate-700 font-medium mt-1">
                {stats.upcoming > 0 ? (
                  <span>You have <strong className="text-amber-700 font-bold">{stats.upcoming} upcoming dose{stats.upcoming > 1 ? 's' : ''}</strong> remaining today.</span>
                ) : (
                  <span className="text-emerald-700 font-bold">🎉 Wonderful! All scheduled medicines are completed!</span>
                )}
              </p>
            </div>

            {/* Visual Adherence Circle Badge */}
            <div className="flex items-center gap-4 self-start sm:self-center bg-slate-100 border-2 border-slate-300 px-6 py-4 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {stats.adherenceRate}%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Daily Score
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden mt-6 border-2 border-slate-800">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(5, (stats.taken / (stats.total || 1)) * 100)}%` }}
            >
              {stats.taken > 0 && <span className="text-[11px] font-black text-white">✓</span>}
            </div>
          </div>
        </div>

        {/* Time of Day Filter Tabs (Big Touch Targets) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base sm:text-lg font-bold text-slate-700">Filter by Time:</span>
            <button
              onClick={() => speakText("You have " + stats.total + " medicines scheduled today. " + stats.taken + " taken, and " + stats.upcoming + " upcoming.")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 border-2 border-blue-400 text-blue-900 font-bold text-base hover:bg-blue-200 transition-colors"
            >
              <Volume2 className="w-5 h-5 text-blue-700" />
              <span>Read Summary Aloud</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['ALL', 'Morning', 'Afternoon', 'Evening', 'Night'].map((slot) => {
              const isSelected = filterSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setFilterSlot(slot)}
                  className={`h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 border-3 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-950 shadow-lg scale-105'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Medication Cards List - High Contrast & Oversized Typography */}
        <div className="space-y-6">
          {filteredMeds.map((med) => {
            const badge = getStatusBadge(med.status);
            const isTaken = med.status === 'taken';
            const isMissed = med.status === 'missed';

            return (
              <div
                key={med.id}
                className={`rounded-3xl border-4 p-6 sm:p-8 transition-all shadow-lg ${badge.cardBorder}`}
              >
                {/* Header row: Time & Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-200/80 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 border-2 border-slate-300">
                      {getSlotIcon(med.timeSlot)}
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">
                        {med.scheduledTime} ({med.timeSlot})
                      </div>
                      <div className="text-base font-bold text-slate-600">
                        {med.mealRelation}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-base sm:text-lg font-black tracking-wide ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {/* Read Aloud Button */}
                    <button
                      onClick={() => speakText(`Medicine name is ${med.name}. Dosage is ${med.dosage}. ${med.seniorInstructions}`)}
                      title="Listen to medicine instructions"
                      className="p-3 rounded-2xl bg-blue-100 hover:bg-blue-200 border-2 border-blue-400 text-blue-900 transition-colors"
                    >
                      <Volume2 className="w-7 h-7 text-blue-800" />
                    </button>
                  </div>
                </div>

                {/* Main Medicine Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                        {med.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-slate-700 mt-1">
                        {med.genericName} • <span className="text-blue-900 underline font-black">{med.dosage}</span>
                      </p>
                    </div>

                    <div className="hidden sm:block text-right">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Doctor</span>
                      <p className="text-base font-bold text-slate-800">{med.prescribedBy}</p>
                    </div>
                  </div>

                  {/* Tablet Shape & Visual Pill Guide */}
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-sm font-semibold">
                    <span>Look for:</span>
                    <strong className="text-slate-900 font-bold">{med.shape}</strong>
                  </div>

                  {/* High Contrast Senior Instructions Box */}
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-100 border-2 border-slate-800 text-slate-900">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>Directions for Senior:</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold leading-snug">
                      "{med.seniorInstructions}"
                    </p>
                  </div>
                </div>

                {/* Big One-Tap Action Targets (Min 64px-72px height) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-4">
                  {!isTaken ? (
                    <button
                      onClick={() => markDose(med.id, 'taken')}
                      className="flex-1 h-20 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-2xl sm:text-3xl shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 border-4 border-emerald-700"
                    >
                      <Check className="w-9 h-9 stroke-[3]" />
                      <span>MARK AS TAKEN</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400">
                      <div className="flex items-center gap-3 text-emerald-900">
                        <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                        <div>
                          <span className="text-xl font-black">Logged at {med.takenAt}</span>
                          <p className="text-sm font-semibold text-emerald-800">Caregiver Priya Iyer has been notified.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => markDose(med.id, 'upcoming')}
                        className="px-4 py-2.5 rounded-xl bg-white border-2 border-slate-400 hover:bg-slate-100 text-slate-800 text-base font-bold flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Undo
                      </button>
                    </div>
                  )}

                  {/* Mark as Missed button */}
                  {!isTaken && !isMissed && (
                    <button
                      onClick={() => markDose(med.id, 'missed')}
                      className="h-20 sm:w-48 px-4 rounded-2xl bg-slate-200 hover:bg-rose-100 hover:text-rose-800 active:bg-rose-200 text-slate-700 font-bold text-lg border-2 border-slate-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Cannot Take / Missed</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Call Floating Bottom Drawer */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 border-4 border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-red-600 text-white">
              <PhoneCall className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">Need someone right now?</h4>
              <p className="text-lg text-slate-300 font-medium">
                Priya Iyer (Daughter) is on standby at <strong className="text-white">+91 98450 12345</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xl shadow-lg border-2 border-white transition-all"
          >
            Open Emergency SOS
          </button>
        </div>
      </div>
    </div>
  );
}
