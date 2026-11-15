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
  Stethoscope,
  Activity,
  Plus,
  X
} from 'lucide-react';

export default function SettingsTab() {
  const {
    patient,
    passcodes,
    updatePasscode,
    resetToDefaults,
    updateNames,
    addDiagnosisCondition,
    removeDiagnosisCondition,
    showToast
  } = useApp();

  const [pins, setPins] = useState({
    elderly: passcodes.elderly,
    caretaker: passcodes.caretaker,
    family: passcodes.family
  });

  const [pName, setPName] = useState(patient.name);
  const [cName, setCName] = useState(patient.emergencyContacts[0]?.name || 'Sarah Jenkins');
  const [fName, setFName] = useState(patient.emergencyContacts[1]?.name || 'David Pendelton');
  const [newCond, setNewCond] = useState('');

  const handleSavePin = (role) => {
    const newPin = pins[role];
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      updatePasscode(role, newPin);
    } else {
      showToast('Invalid PIN', 'Passcode must be exactly 4 digits', 'danger');
    }
  };

  const handleSaveAllNames = (e) => {
    e.preventDefault();
    updateNames(pName.trim(), cName.trim(), fName.trim());
  };

  const handleAddCond = () => {
    if (newCond.trim()) {
      addDiagnosisCondition(newCond.trim());
      setNewCond('');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Patient Profile & Security Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage dynamic names, diagnosed conditions, 4-digit role passcodes, and emergency contacts
        </p>
      </div>

      {/* Dynamic Names Customizer */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Editable Role Names</h3>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md font-bold">
            Live Synchronized
          </span>
        </div>

        <form onSubmit={handleSaveAllNames} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                required
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Primary Caretaker Name
              </label>
              <input
                type="text"
                required
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Family Monitor Name
              </label>
              <input
                type="text"
                required
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm"
            >
              Save Names
            </button>
          </div>
        </form>
      </div>

      {/* Patient Diagnosed Medical Condition Field */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Diagnosed Condition(s) / Medical Profile</h3>
        </div>

        <p className="text-xs text-slate-500">
          Enter or edit diagnosed medical conditions. These conditions are displayed in the header and dynamically adjust the AI Care Insights engine.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {patient.conditions.map((condition) => (
            <span
              key={condition}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-300 text-xs font-bold text-blue-900"
            >
              <span>{condition}</span>
              <button
                type="button"
                onClick={() => removeDiagnosisCondition(condition)}
                className="p-0.5 rounded-full hover:bg-blue-200 text-blue-700 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newCond}
            onChange={(e) => setNewCond(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCond();
              }
            }}
            placeholder="Type new diagnosis (e.g., Congestive Heart Failure, Osteoarthritis)..."
            className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300"
          />
          <button
            type="button"
            onClick={handleAddCond}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Diagnosis</span>
          </button>
        </div>
      </div>

      {/* 4-Digit Passcode Management */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">4-Digit Role Passcodes (PINs)</h3>
        </div>

        <p className="text-xs text-slate-500">
          Passcodes protect role-based access. Changes reflect immediately on the login keypad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Elderly PIN */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="text-xs font-bold text-blue-900 uppercase">Senior Mode ({patient.name})</span>
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
            <span className="text-xs font-bold text-emerald-900 uppercase">Caretaker ({patient.emergencyContacts[0]?.name})</span>
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
            <span className="text-xs font-bold text-purple-900 uppercase">Family Monitor ({patient.emergencyContacts[1]?.name})</span>
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
                    Primary Caregiver
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
            Restores original clinical defaults (Arthur Pendelton, Sarah Jenkins, David Pendelton) in localStorage.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all platform data back to original clinical sample defaults?")) {
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
