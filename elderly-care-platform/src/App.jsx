import React from 'react';
import { useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import SeniorMode from './components/senior/SeniorMode';
import CaretakerDashboard from './components/caretaker/CaretakerDashboard';
import EmailOutboxModal from './components/caretaker/EmailOutboxModal';
import EmergencyModal from './components/common/EmergencyModal';
import ProfileModal from './components/common/ProfileModal';

export default function App() {
  const { currentRole } = useApp();

  // If no active session, show PIN Login screen
  if (!currentRole) {
    return (
      <>
        <LoginScreen />
        <ProfileModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <div className="flex-1">
        {currentRole === 'elderly' ? (
          <SeniorMode />
        ) : (
          <CaretakerDashboard />
        )}
      </div>

      {/* Global Interactive Drawers & Modals */}
      <EmailOutboxModal />
      <EmergencyModal />
      <ProfileModal />
    </div>
  );
}
