import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Stethoscope
} from 'lucide-react';

export default function SettingsTab() {
  const {
    patient,
    passcodes,
    updatePasscode,
    resetToDefaults,
    showToast
  } = useApp();

  const [pins, setPins] = useState({
    elderly: passcodes.elderly,
    caretaker: passcodes.caretaker,
    family: passcodes.family
  });

  const handleSavePin = (role) => {
    const newPin = pins[role];
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      updatePasscode(role, newPin);
    } else {
      showToast('Invalid PIN', 'Passcode must be exactly 4 digits', 'danger');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Patient Profile & Security Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage 4-digit role passcodes, emergency contacts, and clinical record details
        </p>
      </div>

      {/* 4-Digit Passcode Management */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">4-Digit Role Passcodes (PINs)</h3>
        </div>

        <p className="text-xs text-slate-500">
          Passcodes protect role-based access. Judges can test updating these PINs; changes will reflect immediately on the login keypad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Elderly PIN */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-xs font-bold text-blue-900 uppercase">Senior Mode (Ramesh)</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={pins.elderly}
                onChange={(e) => setPins({ ...pins, elderly: e.target.value })}
                className="w-full text-center font-mono font-bold text-lg px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <button
                onClick={() => handleSavePin('elderly')}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">Default: 1111</span>
          </div>

          {/* Caretaker PIN */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <span className="text-xs font-bold text-emerald-900 uppercase">Caretaker (Priya)</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={pins.caretaker}
                onChange={(e) => setPins({ ...pins, caretaker: e.target.value })}
                className="w-full text-center font-mono font-bold text-lg px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <button
                onClick={() => handleSavePin('caretaker')}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">Default: 2222</span>
          </div>

          {/* Family PIN */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
            <span className="text-xs font-bold text-purple-900 uppercase">Family Monitor (Rahul)</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={pins.family}
                onChange={(e) => setPins({ ...pins, family: e.target.value })}
                className="w-full text-center font-mono font-bold text-lg px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <button
                onClick={() => handleSavePin('family')}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">Default: 3333</span>
          </div>
        </div>
      </div>

      {/* Patient Profile Details Card */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Patient Demographic & Health Record</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Full Name & Age</span>
            <strong className="text-slate-900 text-sm block mt-0.5">{patient.name}, {patient.age} years ({patient.gender})</strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Blood Group & Allergies</span>
            <strong className="text-slate-900 text-sm block mt-0.5">
              Blood: {patient.bloodGroup} • Allergies: {patient.allergies.join(', ')}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Residence Location</span>
            <strong className="text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              {patient.location}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Chronic Conditions</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {patient.conditions.map((c, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Directory */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Emergency & Caretaker Directory</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {patient.emergencyContacts.map(contact => (
            <div key={contact.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{contact.name}</span>
                {contact.isPrimary && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-slate-500">{contact.relation} • {contact.city}</p>
              <div className="pt-2 text-slate-700 font-semibold flex flex-col gap-0.5">
                <span>📞 {contact.phone}</span>
                <span>✉️ {contact.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Data to Defaults */}
      <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-red-950 text-base">Reset Demo Data</h4>
          <p className="text-xs text-red-800 mt-0.5">
            Restores all original Indian patient schedules, appointments, passcodes, and email logs in localStorage.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all platform data back to original Ramesh Iyer sample data?")) {
              resetToDefaults();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
}
