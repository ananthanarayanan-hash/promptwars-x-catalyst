import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BellRing,
  Pill,
  Send
} from 'lucide-react';

export default function OverviewTab({ setActiveTab }) {
  const {
    patient,
    medications,
    appointments,
    stats,
    weeklyAdherenceHistory,
    simulateMissedDose,
    simulateUpcomingAlert,
    triggerEmergencyAlert,
    markDose,
    aiInsights
  } = useApp();

  const nextAppointment = appointments[0];
  const upcomingMedications = medications.filter(m => m.status === 'upcoming');
  const missedMedications = medications.filter(m => m.status === 'missed');

  return (
    <div className="space-y-8">
      {/* Judge Quick Action Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-900/80 border border-blue-400 text-blue-300 text-xs font-bold uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Judge Test Sandbox</span>
          </div>
          <h2 className="text-xl font-bold text-white">Live Reactive Alerts & Simulation</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Trigger real-time missed doses or proactive alerts to inspect the interactive Email Outbox drawer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={simulateMissedDose}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Simulate Missed Dose</span>
          </button>

          <button
            onClick={() => simulateUpcomingAlert(medications[2]?.id || medications[0]?.id)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
          >
            <BellRing className="w-4 h-4" />
            <span>Simulate Due Reminder</span>
          </button>

          <button
            onClick={triggerEmergencyAlert}
            className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm border border-slate-600 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Test SOS Alert</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adherence Rate */}
        <div className="p-6 rounded-2xl bg-white border-2 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Adherence Rate</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{stats.adherenceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Good
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Calculated in real-time across daily scheduled doses
          </p>
        </div>

        {/* Taken Today */}
        <div className="p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Taken Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-900">{stats.taken}</span>
            <span className="text-sm text-slate-500 font-semibold">of {stats.total} total</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(stats.taken / (stats.total || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Upcoming Doses */}
        <div className="p-6 rounded-2xl bg-white border-2 border-amber-200 shadow-sm bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming Doses</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-900">{stats.upcoming}</span>
            <span className="text-xs font-medium text-amber-700">Remaining</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Next: {upcomingMedications[0]?.name || 'All done for today'}
          </p>
        </div>

        {/* Missed Doses Alert */}
        <div className={`p-6 rounded-2xl border-2 shadow-sm ${stats.missed > 0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Missed Doses</span>
            <AlertTriangle className={`w-5 h-5 ${stats.missed > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${stats.missed > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stats.missed}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stats.missed > 0 ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
              {stats.missed > 0 ? 'Alert active' : 'Zero missed'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.missed > 0 ? 'Caregiver SMS/Email dispatched' : 'Care protocol on track'}
          </p>
        </div>
      </div>

      {/* 7-Day Adherence Chart & AI Insight Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 7-Day Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">7-Day Adherence Trend</h3>
              <p className="text-xs text-slate-500">Weekly compliance pattern for Ramesh Iyer</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
              Avg: 86.2%
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2 border-b border-slate-200">
            {weeklyAdherenceHistory.map((day, idx) => {
              const isToday = day.day === 'Sun';
              const rate = isToday ? stats.adherenceRate : day.rate;
              let barColor = 'bg-emerald-500';
              if (rate < 70) barColor = 'bg-rose-500';
              else if (rate < 90) barColor = 'bg-amber-500';

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {rate}%
                  </span>
                  <div
                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${barColor} ${isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                    style={{ height: `${Math.max(15, rate)}%` }}
                  />
                  <span className={`text-xs font-bold mt-1 ${isToday ? 'text-blue-600 font-black' : 'text-slate-600'}`}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                90%+ (Optimal)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                70-89% (Moderate)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                &lt;70% (At Risk)
              </span>
            </div>
            <span>Thursday showed dip due to delayed dinner</span>
          </div>
        </div>

        {/* Right: AI Routine Advisor Spotlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-2xl border-2 border-blue-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Smart Innovation: AI Routine Advisor</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              {aiInsights[0].title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {aiInsights[0].finding}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-white border border-blue-200 shadow-sm text-xs text-slate-700 leading-relaxed">
              <strong className="text-blue-900 block font-semibold mb-1">Clinical AI Suggestion:</strong>
              {aiInsights[0].recommendation}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('insights')}
            className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Open Drug Interaction & AI Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Next Upcoming Doses & Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Schedule Snapshot */}
        <div className="lg:col-span-7 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              Today's Medication Status
            </h3>
            <button
              onClick={() => setActiveTab('medications')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Full Schedule Manager <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {medications.map((med) => {
              const isTaken = med.status === 'taken';
              const isMissed = med.status === 'missed';
              return (
                <div key={med.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isTaken ? 'bg-emerald-500' : isMissed ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <div>
                      <div className="font-bold text-sm text-slate-900">{med.name}</div>
                      <div className="text-xs text-slate-500">
                        {med.scheduledTime} • {med.mealRelation} • <span className="font-medium text-slate-700">{med.dosage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isTaken
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isMissed
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {med.status.toUpperCase()}
                    </span>

                    {!isTaken ? (
                      <button
                        onClick={() => markDose(med.id, 'taken')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        Mark Taken
                      </button>
                    ) : (
                      <button
                        onClick={() => markDose(med.id, 'upcoming')}
                        className="text-xs text-slate-500 hover:text-slate-800 underline"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Appointment Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Doctor Visit
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                In 5 Days
              </span>
            </div>

            {nextAppointment ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-base text-slate-900">{nextAppointment.doctorName}</div>
                <div className="text-xs font-semibold text-blue-600">{nextAppointment.specialty}</div>
                <div className="text-xs text-slate-600 mt-2">
                  <strong>Hospital:</strong> {nextAppointment.hospital}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <strong>Date & Time:</strong> {new Date(nextAppointment.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  <strong>Purpose:</strong> {nextAppointment.purpose}
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  <strong>Prep:</strong> {nextAppointment.instructions}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No scheduled doctor visits.</p>
            )}
          </div>

          <button
            onClick={() => setActiveTab('appointments')}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>Manage All Appointments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
