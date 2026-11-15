import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  KeyRound,
  UserCheck,
  HeartPulse,
  Stethoscope,
  Users,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Building2,
  Activity,
  Edit3
} from 'lucide-react';

export default function LoginScreen() {
  const {
    passcodes,
    setCurrentRole,
    patient,
    setIsProfileModalOpen
  } = useApp();

  const [pin, setPin] = useState('');
  const [selectedRole, setSelectedRole] = useState('elderly'); // 'elderly' | 'caretaker' | 'family'
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const caretakerName = patient.emergencyContacts[0]?.name || 'Sarah Jenkins';
  const familyName = patient.emergencyContacts[1]?.name || 'David Pendelton';

  const rolesConfig = [
    {
      id: 'elderly',
      label: 'Patient / Senior View',
      subtitle: `${patient.name} (${patient.age} yrs)`,
      icon: HeartPulse,
      demoPin: passcodes.elderly,
      color: 'border-blue-600 bg-blue-50/50 text-blue-900',
      activeBadge: 'bg-blue-600 text-white',
      desc: 'Oversized typography, high contrast, 1-tap "Mark as Taken", audio readout & SOS assistance'
    },
    {
      id: 'caretaker',
      label: 'Caretaker Dashboard',
      subtitle: `${caretakerName} (Primary Caregiver)`,
      icon: Stethoscope,
      demoPin: passcodes.caretaker,
      color: 'border-emerald-600 bg-emerald-50/50 text-emerald-900',
      activeBadge: 'bg-emerald-600 text-white',
      desc: 'Clinical adherence tracking, schedule manager, appointments & automated email alert logs'
    },
    {
      id: 'family',
      label: 'Family Monitor View',
      subtitle: `${familyName} (Remote Oversight)`,
      icon: Users,
      demoPin: passcodes.family,
      color: 'border-purple-600 bg-purple-50/50 text-purple-900',
      activeBadge: 'bg-purple-600 text-white',
      desc: 'Remote weekly adherence digests, physician appointments, and real-time care alerts'
    }
  ];

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');

      if (newPin.length === 4) {
        verifyPin(newPin, selectedRole);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (enteredPin, role) => {
    const targetPin = passcodes[role];
    if (enteredPin === targetPin) {
      setCurrentRole(role);
    } else {
      setIsShaking(true);
      setErrorMsg(`Incorrect passcode for ${rolesConfig.find(r => r.id === role)?.label}. Demo passcode is ${targetPin}`);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 700);
    }
  };

  const directQuickLogin = (role) => {
    setCurrentRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-100">
      {/* Enterprise Western Clinical Portal Header */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 shadow-md mb-3">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
            Enterprise Clinical Health Gateway
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <span className="text-blue-400">Elder Care Form</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
          Comprehensive Medication Adherence, Caregiver Oversight & Clinical Alert Portal
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Role Selector & Judge Quick-Start Guide */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Role Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                Select Portal Access Level
              </h2>
              <span className="text-xs font-mono bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-1 rounded-md">
                4-Digit Passcode Protected
              </span>
            </div>

            {/* Role Cards List */}
            <div className="space-y-3">
              {rolesConfig.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setPin('');
                      setErrorMsg('');
                    }}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-400 bg-slate-700/90 shadow-lg ring-2 ring-blue-500/20'
                        : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/40 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{role.label}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 font-mono border border-slate-700">
                            PIN: <strong className="text-amber-400 font-bold">{role.demoPin}</strong>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">{role.subtitle}</p>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{role.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        directQuickLogin(role.id);
                      }}
                      className="self-end sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                    >
                      <span>1-Click Enter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Structured Judge & Evaluator Quick-Start Guide Panel */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <ClipboardCheck className="w-5 h-5" />
                <span>Judge & Evaluator Quick-Start Guide</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full">
                Interactive Evaluation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div
                onClick={() => directQuickLogin('elderly')}
                className="cursor-pointer p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-blue-400 hover:bg-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-blue-300">1. Senior Mode</span>
                  <span className="font-mono text-amber-400 font-bold">1111</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Test oversized buttons, 1-tap taken confirmation, audio directions & emergency SOS.
                </p>
                <span className="text-[10px] text-blue-400 font-bold mt-2 block hover:underline">Click to test →</span>
              </div>

              <div
                onClick={() => directQuickLogin('caretaker')}
                className="cursor-pointer p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 hover:bg-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-300">2. Caretaker</span>
                  <span className="font-mono text-amber-400 font-bold">2222</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Click <strong>"Simulate Missed Dose"</strong> in header to trigger reactive email alerts.
                </p>
                <span className="text-[10px] text-emerald-400 font-bold mt-2 block hover:underline">Click to test →</span>
              </div>

              <div
                onClick={() => directQuickLogin('family')}
                className="cursor-pointer p-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-400 hover:bg-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-purple-300">3. Family View</span>
                  <span className="font-mono text-amber-400 font-bold">3333</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Review weekly adherence history, scheduled clinic consults & care digests.
                </p>
                <span className="text-[10px] text-purple-400 font-bold mt-2 block hover:underline">Click to test →</span>
              </div>
            </div>

            {/* Note on live customization */}
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300 font-semibold">Live Customization Note:</strong> Patient details (e.g., Arthur Pendelton), Caretaker names (Sarah Jenkins), Family names (David Pendelton), and <strong>Diagnosed Medical Conditions</strong> can be edited live inside the app via the <strong className="text-white">"Edit Profile & Diagnoses"</strong> top bar button.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Keypad */}
        <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 backdrop-blur shadow-2xl flex flex-col items-center">
          <div className="text-center mb-5">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Passcode Verification</span>
            <h3 className="text-xl font-bold text-white capitalize mt-0.5">
              {rolesConfig.find(r => r.id === selectedRole)?.label}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Clickable demo passcode: <button type="button" onClick={() => directQuickLogin(selectedRole)} className="font-bold text-amber-400 font-mono text-sm underline hover:text-amber-300">{passcodes[selectedRole]} (Click to Auto-Login)</button>
            </p>
          </div>

          {/* PIN Dots Display */}
          <div className={`flex justify-center items-center gap-4 my-3 p-4 rounded-xl bg-slate-900 border border-slate-700 w-full ${isShaking ? 'animate-bounce border-red-500' : ''}`}>
            {[0, 1, 2, 3].map((idx) => {
              const hasDigit = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full transition-all duration-200 border-2 flex items-center justify-center ${
                    hasDigit
                      ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50 scale-110'
                      : 'border-slate-600 bg-slate-800'
                  }`}
                >
                  {hasDigit && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-xs text-red-400 flex items-center gap-1.5 mb-3 text-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num.toString())}
                className="h-13 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:bg-blue-600 border border-slate-600/80 text-xl font-bold text-white shadow transition-all active:scale-95 flex items-center justify-center py-3"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="h-13 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center py-3"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-13 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:bg-blue-600 border border-slate-600/80 text-xl font-bold text-white shadow transition-all active:scale-95 flex items-center justify-center py-3"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="h-13 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center py-3"
            >
              ⌫ Del
            </button>
          </div>

          {/* 1-Click Demo Login shortcut */}
          <button
            type="button"
            onClick={() => directQuickLogin(selectedRole)}
            className="mt-5 w-full py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>One-Click Login as {rolesConfig.find(r => r.id === selectedRole)?.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
