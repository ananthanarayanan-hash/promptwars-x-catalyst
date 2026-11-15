import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, PhoneCall, ShieldAlert, X, HeartPulse, CheckCircle2 } from 'lucide-react';

export default function EmergencyModal() {
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    triggerEmergencyAlert,
    patient
  } = useApp();

  if (!isEmergencyModalOpen) return null;

  const primaryContact = patient.emergencyContacts[0];

  const handleConfirmEmergency = () => {
    triggerEmergencyAlert();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-red-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* SOS Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-4 border-4 border-white animate-emergency">
            <AlertOctagon className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            EMERGENCY ASSISTANCE
          </h2>
          <p className="text-base text-slate-300 font-medium mt-1">
            Need urgent help, Ramesh Uncle? We are connecting you immediately.
          </p>
        </div>

        {/* Direct Action Call Buttons */}
        <div className="space-y-4 mb-6">
          {/* Call Daughter / Primary Caretaker */}
          <a
            href={`tel:${primaryContact.phone}`}
            onClick={handleConfirmEmergency}
            className="w-full h-18 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-xl flex items-center justify-between shadow-xl transition-all border-2 border-emerald-400"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-7 h-7" />
              <div className="text-left">
                <div className="text-lg leading-tight">Call {primaryContact.name} (Daughter)</div>
                <div className="text-xs font-mono font-medium text-emerald-100">{primaryContact.phone}</div>
              </div>
            </div>
            <span className="text-sm bg-emerald-700 px-3 py-1.5 rounded-xl uppercase font-bold">Call Now</span>
          </a>

          {/* Call 108 Emergency Medical Service */}
          <a
            href="tel:108"
            onClick={handleConfirmEmergency}
            className="w-full h-18 p-4 rounded-2xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-xl flex items-center justify-between shadow-xl transition-all border-2 border-red-400"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-7 h-7" />
              <div className="text-left">
                <div className="text-lg leading-tight">Call 108 Ambulance</div>
                <div className="text-xs font-medium text-red-100">National Medical Emergency</div>
              </div>
            </div>
            <span className="text-sm bg-red-700 px-3 py-1.5 rounded-xl uppercase font-bold">Emergency 108</span>
          </a>

          {/* Send Instant Silent Caregiver SOS Email */}
          <button
            onClick={() => {
              handleConfirmEmergency();
              setIsEmergencyModalOpen(false);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Send Silent SOS Notification & Location to Priya</span>
          </button>
        </div>

        {/* Safety Note & Dismiss */}
        <div className="text-center pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Registered Address: 4th Main, Malleshwaram</span>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-slate-300 hover:text-white underline font-semibold"
          >
            I'm okay, close this
          </button>
        </div>
      </div>
    </div>
  );
}
