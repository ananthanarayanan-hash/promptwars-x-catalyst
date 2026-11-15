import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, KeyRound, UserCheck, HeartPulse, Stethoscope, Users, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginScreen() {
  const { passcodes, setCurrentRole, patient } = useApp();
  const [pin, setPin] = useState('');
  const [selectedRole, setSelectedRole] = useState('elderly'); // 'elderly' | 'caretaker' | 'family'
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const rolesConfig = [
    {
      id: 'elderly',
      label: 'Senior Mode',
      subtitle: `${patient.name} (${patient.age} yrs)`,
      icon: HeartPulse,
      demoPin: passcodes.elderly,
      color: 'border-blue-600 bg-blue-50/50 text-blue-900',
      activeBadge: 'bg-blue-600 text-white',
      desc: 'Oversized text, high contrast, 1-tap taken buttons & emergency SOS'
    },
    {
      id: 'caretaker',
      label: 'Caretaker Dashboard',
      subtitle: `${patient.emergencyContacts[0].name} (Primary)`,
      icon: Stethoscope,
      demoPin: passcodes.caretaker,
      color: 'border-emerald-600 bg-emerald-50/50 text-emerald-900',
      activeBadge: 'bg-emerald-600 text-white',
      desc: 'Adherence analytics, schedule manager, appointment & email alert logs'
    },
    {
      id: 'family',
      label: 'Family Monitor',
      subtitle: `${patient.emergencyContacts[1].name} (Remote Monitor)`,
      icon: Users,
      demoPin: passcodes.family,
      color: 'border-purple-600 bg-purple-50/50 text-purple-900',
      activeBadge: 'bg-purple-600 text-white',
      desc: 'Remote oversight, daily vitals, weekly health reports & care logs'
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
      setErrorMsg(`Incorrect PIN for ${rolesConfig.find(r => r.id === role)?.label}. Demo PIN is ${targetPin}`);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      {/* Brand Header */}
      <div className="text-center mb-8 max-w-xl">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 shadow-md mb-4">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">Clinical Modern Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <span className="text-blue-400">Aarogya</span>Care
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-2 font-medium">
          Elderly Medication & Remote Caregiver Management System
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Role Selector & Demo Badges */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              Select Profile & Role
            </h2>
            <span className="text-xs font-mono bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-1 rounded-md">
              4-Digit PIN Access
            </span>
          </div>

          <p className="text-sm text-slate-300 mb-6">
            Choose which interface to enter. For judges, demo PINs are displayed below. You can also click <strong>"Quick Access"</strong> to test immediately without typing.
          </p>

          {/* Role Cards */}
          <div className="space-y-3.5">
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
                  className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-blue-400 bg-slate-700/90 shadow-lg ring-2 ring-blue-500/20'
                      : 'border-slate-700 bg-slate-800/60 hover:bg-slate-700/40 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-white">{role.label}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 font-mono border border-slate-700">
                          PIN: <strong className="text-amber-400 font-bold">{role.demoPin}</strong>
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{role.subtitle}</p>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{role.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      directQuickLogin(role.id);
                    }}
                    className="self-end sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                  >
                    Quick Access
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Notice for Judges */}
          <div className="mt-6 p-4 rounded-xl bg-blue-950/50 border border-blue-800/60 flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-blue-300 font-semibold">Judge Fast-Switch Note:</strong> You can enter PIN on the keypad, or tap any <strong className="text-white">Quick Access</strong> button above. Inside the app, the top navigation always provides a 1-click role switcher.
            </div>
          </div>
        </div>

        {/* Right Side: Tactile PIN Keypad */}
        <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Authenticating</span>
            <h3 className="text-xl font-bold text-white capitalize mt-0.5">
              {rolesConfig.find(r => r.id === selectedRole)?.label}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Demo PIN is <span className="font-bold text-amber-400 font-mono text-sm">{passcodes[selectedRole]}</span>
            </p>
          </div>

          {/* PIN Dots Display */}
          <div className={`flex justify-center items-center gap-4 my-4 p-4 rounded-xl bg-slate-900 border border-slate-700 w-full ${isShaking ? 'animate-bounce border-red-500' : ''}`}>
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
            <div className="text-xs text-red-400 flex items-center gap-1.5 mb-4 text-center">
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
                className="h-14 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:bg-blue-600 border border-slate-600/80 text-xl font-bold text-white shadow transition-all active:scale-95 flex items-center justify-center"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-14 rounded-xl bg-slate-700/80 hover:bg-slate-600 active:bg-blue-600 border border-slate-600/80 text-xl font-bold text-white shadow transition-all active:scale-95 flex items-center justify-center"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all flex items-center justify-center"
            >
              ⌫ Del
            </button>
          </div>

          {/* Fill Demo PIN shortcut */}
          <button
            type="button"
            onClick={() => {
              const demo = passcodes[selectedRole];
              setPin(demo);
              verifyPin(demo, selectedRole);
            }}
            className="mt-6 text-xs text-blue-400 hover:text-blue-300 underline font-medium"
          >
            Auto-fill demo PIN ({passcodes[selectedRole]})
          </button>
        </div>
      </div>
    </div>
  );
}
