import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Stethoscope, Users, Plus, X, Check, Activity, HeartPulse } from 'lucide-react';

export default function ProfileModal() {
  const {
    patient,
    isProfileModalOpen,
    setIsProfileModalOpen,
    updateNames,
    addDiagnosisCondition,
    removeDiagnosisCondition,
    updateDiagnosisConditions
  } = useApp();

  const [patientName, setPatientName] = useState(patient.name);
  const [caretakerName, setCaretakerName] = useState(patient.emergencyContacts[0]?.name || 'Sarah Jenkins');
  const [familyName, setFamilyName] = useState(patient.emergencyContacts[1]?.name || 'David Pendelton');
  const [newConditionInput, setNewConditionInput] = useState('');

  if (!isProfileModalOpen) return null;

  const handleSaveNames = (e) => {
    e.preventDefault();
    updateNames(patientName.trim(), caretakerName.trim(), familyName.trim());
    setIsProfileModalOpen(false);
  };

  const handleAddCondition = () => {
    if (newConditionInput.trim()) {
      addDiagnosisCondition(newConditionInput.trim());
      setNewConditionInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-slate-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Live Profile & Diagnosis Customizer
              </h3>
              <p className="text-xs text-slate-500">
                Changes apply instantly across all senior, caretaker, and family views
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveNames} className="space-y-5">
          {/* Section 1: Names Customization */}
          <div className="space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              1. Editable Role Profiles
            </span>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
                <span>Patient / Senior Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Arthur Pendelton"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              />
            </div>

            {/* Caretaker Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Primary Caretaker *</span>
                </label>
                <input
                  type="text"
                  required
                  value={caretakerName}
                  onChange={(e) => setCaretakerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Family Monitor *</span>
                </label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. David Pendelton"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Diagnosed Conditions Field */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              2. Diagnosed Condition(s) / Medical Profile
            </span>

            <p className="text-xs text-slate-600">
              Active diagnoses are displayed in the clinical header banner and link directly to the AI Care Insights & Routine Advisor.
            </p>

            {/* Existing conditions list */}
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
                    title="Remove diagnosis"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add new condition input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newConditionInput}
                onChange={(e) => setNewConditionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCondition();
                  }
                }}
                placeholder="Type new diagnosis (e.g., Asthma, Arrhythmia, Osteoarthritis)..."
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Diagnosis</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-5 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Update App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
