import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/initialData';

const AppContext = createContext(null);

const STORAGE_KEY = 'ELDER_CARE_FORM_V2';

export function AppProvider({ children }) {
  // Load state from localStorage or fallback to clean Western defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    return INITIAL_DATA;
  });

  // REQUIREMENT: Always open directly on the Login Page on initial load
  const [currentRole, setCurrentRole] = useState(null); // 'elderly' | 'caretaker' | 'family' | null

  // Global drawer state for Outbox / Email log
  const [isOutboxOpen, setIsOutboxOpen] = useState(false);

  // Global profile & diagnosis edit modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Global toast / notification for simulated events
  const [activeToast, setActiveToast] = useState(null);

  // Emergency SOS Modal
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Sync data changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist data:", e);
    }
  }, [data]);

  // Toast auto-dismiss
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const showToast = (title, message, type = 'info') => {
    setActiveToast({ title, message, type, id: Date.now() });
  };

  // Text-To-Speech reader for elderly accessibility
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Dynamic Name Updaters
  const updateNames = (patientName, caretakerName, familyName) => {
    setData(prev => {
      const updatedContacts = [...prev.patient.emergencyContacts];
      if (updatedContacts[0]) {
        updatedContacts[0] = { ...updatedContacts[0], name: caretakerName };
      }
      if (updatedContacts[1]) {
        updatedContacts[1] = { ...updatedContacts[1], name: familyName };
      }

      return {
        ...prev,
        patient: {
          ...prev.patient,
          name: patientName,
          emergencyContacts: updatedContacts
        }
      };
    });
    showToast('Names Updated', `Saved: ${patientName} (Patient), ${caretakerName} (Caretaker), ${familyName} (Family)`, 'success');
  };

  // Dynamic Diagnosis & Condition Updaters
  const addDiagnosisCondition = (newCondition) => {
    if (!newCondition || !newCondition.trim()) return;
    const trimmed = newCondition.trim();
    setData(prev => {
      if (prev.patient.conditions.includes(trimmed)) return prev;
      return {
        ...prev,
        patient: {
          ...prev.patient,
          conditions: [...prev.patient.conditions, trimmed]
        }
      };
    });
    showToast('Diagnosis Added', `Added "${trimmed}" to medical profile`, 'success');
  };

  const removeDiagnosisCondition = (conditionToRemove) => {
    setData(prev => ({
      ...prev,
      patient: {
        ...prev.patient,
        conditions: prev.patient.conditions.filter(c => c !== conditionToRemove)
      }
    }));
    showToast('Diagnosis Removed', `Removed "${conditionToRemove}"`, 'info');
  };

  const updateDiagnosisConditions = (newConditionsList) => {
    setData(prev => ({
      ...prev,
      patient: {
        ...prev.patient,
        conditions: newConditionsList
      }
    }));
    showToast('Medical Profile Updated', `Active diagnoses synchronized`, 'success');
  };

  // Mark Dose Status (taken | missed | upcoming)
  const markDose = (medId, status) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedMed = null;

    setData(prev => {
      const patientName = prev.patient.name;
      const caretaker = prev.patient.emergencyContacts[0] || { name: 'Sarah Jenkins', email: 'caretaker@carenet.org' };
      const family = prev.patient.emergencyContacts[1] || { name: 'David Pendelton', email: 'family@carenet.org' };

      const updatedMeds = prev.medications.map(med => {
        if (med.id === medId) {
          const isTaking = status === 'taken';
          const newStock = isTaking && med.stockLeft > 0 ? med.stockLeft - 1 : med.stockLeft;
          updatedMed = {
            ...med,
            status,
            takenAt: isTaking ? nowTimeStr : null,
            stockLeft: newStock
          };
          return updatedMed;
        }
        return med;
      });

      // Automated Email Alert Trigger
      let newEmails = [...prev.emailOutbox];
      if (updatedMed) {
        if (status === 'taken') {
          newEmails.unshift({
            id: 'mail-' + Date.now(),
            recipient: `${caretaker.name} <${caretaker.email}>`,
            subject: `[Elder Care Form] Dose Confirmed: ${updatedMed.name} (${nowTimeStr})`,
            timestamp: `Today at ${nowTimeStr}`,
            category: "DOSE_LOGGED",
            urgency: "SUCCESS",
            bodyHtml: `${patientName} confirmed taking scheduled ${updatedMed.scheduledTime} dose of ${updatedMed.name} (${updatedMed.dosage}). Remaining organizer stock: ${updatedMed.stockLeft} doses.`
          });
        } else if (status === 'missed') {
          newEmails.unshift({
            id: 'mail-' + Date.now(),
            recipient: `${caretaker.name} <${caretaker.email}>, ${family.name} <${family.email}>`,
            subject: `[CRITICAL ALERT] Missed Dose: ${updatedMed.name} - ${patientName}`,
            timestamp: `Today at ${nowTimeStr}`,
            category: "MISSED_DOSE",
            urgency: "HIGH",
            bodyHtml: `URGENT CARE ALERT: ${patientName} missed the scheduled ${updatedMed.scheduledTime} dose of ${updatedMed.name} (${updatedMed.genericName}). Automated notification dispatched to primary caregiver ${caretaker.name}.`
          });
        }
      }

      return {
        ...prev,
        medications: updatedMeds,
        emailOutbox: newEmails
      };
    });

    if (status === 'taken') {
      showToast('Dose Logged', `Marked ${updatedMed?.name || 'Medication'} as taken!`, 'success');
      speakText(`Marked ${updatedMed?.name || 'Medication'} as taken. Good job ${data.patient.name}!`);
    } else if (status === 'missed') {
      showToast('Missed Dose Alert Sent', `Automated alert email sent to Caregiver ${data.patient.emergencyContacts[0]?.name}!`, 'danger');
    }
  };

  // Simulate Missed Dose (Judge Instant Testing Feature)
  const simulateMissedDose = () => {
    const target = data.medications.find(m => m.status === 'upcoming') || data.medications[0];
    if (target) {
      markDose(target.id, 'missed');
      setIsOutboxOpen(true);
    }
  };

  // Simulate Upcoming Dose Reminder
  const simulateUpcomingAlert = (medId) => {
    const med = data.medications.find(m => m.id === medId) || data.medications[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caretaker = data.patient.emergencyContacts[0];

    const newMail = {
      id: 'mail-' + Date.now(),
      recipient: `${data.patient.name} (SMS Alert), ${caretaker.name} <${caretaker.email}>`,
      subject: `[Elder Care Form] Upcoming Dose: ${med.name} due in 30 minutes`,
      timestamp: `Today at ${nowTimeStr}`,
      category: "UPCOMING_ALERT",
      urgency: "INFO",
      bodyHtml: `Friendly reminder: ${med.name} (${med.dosage}) is due at ${med.scheduledTime}. Patient Instructions: ${med.seniorInstructions}`
    };

    setData(prev => ({
      ...prev,
      emailOutbox: [newMail, ...prev.emailOutbox]
    }));

    showToast('Upcoming Reminder Triggered', `Notification dispatched for ${med.name}`, 'info');
    setIsOutboxOpen(true);
  };

  // Emergency SOS Trigger
  const triggerEmergencyAlert = () => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caretaker = data.patient.emergencyContacts[0];

    const emergencyMail = {
      id: 'mail-' + Date.now(),
      recipient: `EMERGENCY DISPATCH: ${caretaker.name} <${caretaker.email}>, Regional EMS (911)`,
      subject: `🚨 [CRITICAL SOS] ${data.patient.name} Activated Emergency Assistance!`,
      timestamp: `Today at ${nowTimeStr}`,
      category: "EMERGENCY_SOS",
      urgency: "CRITICAL",
      bodyHtml: `EMERGENCY ALERT: ${data.patient.name} (${data.patient.age}) triggered the SOS button from residence at ${nowTimeStr}.\n• Primary Contact: ${caretaker.name} (${caretaker.phone})\n• Residence: ${data.patient.location}\n• Active Medical Profile: ${data.patient.conditions.join(', ')}.`
    };

    setData(prev => ({
      ...prev,
      emailOutbox: [emergencyMail, ...prev.emailOutbox]
    }));

    speakText(`Emergency alert has been sent to ${caretaker.name} and local dispatch. Help is being coordinated.`);
    showToast('SOS Alert Sent!', `Emergency alert dispatched to ${caretaker.name} and Emergency EMS`, 'danger');
  };

  // Medication CRUD
  const addMedication = (newMed) => {
    const medWithId = {
      ...newMed,
      id: 'med-' + Date.now(),
      status: 'upcoming',
      takenAt: null
    };
    setData(prev => ({
      ...prev,
      medications: [...prev.medications, medWithId]
    }));
    showToast('Medication Added', `${newMed.name} added to schedule`, 'success');
  };

  const updateMedication = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(m => m.id === id ? { ...m, ...updatedFields } : m)
    }));
    showToast('Medication Updated', 'Changes saved successfully', 'info');
  };

  const deleteMedication = (id) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m.id !== id)
    }));
    showToast('Medication Deleted', 'Removed from schedule', 'info');
  };

  // Appointments CRUD
  const addAppointment = (newApt) => {
    const aptWithId = {
      ...newApt,
      id: 'apt-' + Date.now(),
      status: 'Confirmed'
    };
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, aptWithId]
    }));
    showToast('Appointment Scheduled', `Consultation with ${newApt.doctorName} saved`, 'success');
  };

  const updateAppointment = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, ...updatedFields } : a)
    }));
    showToast('Appointment Updated', 'Changes saved successfully', 'info');
  };

  const deleteAppointment = (id) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.filter(a => a.id !== id)
    }));
    showToast('Appointment Removed', 'Removed from schedule', 'info');
  };

  const sendAppointmentReminderEmail = (aptId) => {
    const apt = data.appointments.find(a => a.id === aptId);
    if (!apt) return;
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caretaker = data.patient.emergencyContacts[0];

    const mail = {
      id: 'mail-' + Date.now(),
      recipient: `${caretaker.name} <${caretaker.email}>`,
      subject: `[Elder Care Form] Clinic Consultation Reminder: ${apt.doctorName}`,
      timestamp: `Today at ${nowTimeStr}`,
      category: "APPOINTMENT",
      urgency: "INFO",
      bodyHtml: `Scheduled Medical Consultation:\n• Patient: ${data.patient.name}\n• Physician: ${apt.doctorName} (${apt.specialty})\n• Facility: ${apt.hospital}\n• Date & Time: ${new Date(apt.dateTime).toLocaleString()}\n• Purpose: ${apt.purpose}\n• Clinical Preparation: ${apt.instructions}`
    };

    setData(prev => ({
      ...prev,
      emailOutbox: [mail, ...prev.emailOutbox]
    }));
    showToast('Appointment Reminder Sent', `Email dispatched to ${caretaker.email}`, 'info');
    setIsOutboxOpen(true);
  };

  // Passcodes & Security
  const updatePasscode = (role, newPin) => {
    setData(prev => ({
      ...prev,
      passcodes: {
        ...prev.passcodes,
        [role]: newPin
      }
    }));
    showToast('Passcode Updated', `${role.toUpperCase()} PIN updated to ${newPin}`, 'success');
  };

  // Reset to default sample data
  const resetToDefaults = () => {
    setData(INITIAL_DATA);
    showToast('Data Restored', 'Reset to clean clinical sample data (Arthur Pendelton)', 'info');
  };

  // Real-time stats
  const totalDosesToday = data.medications.length;
  const takenDosesToday = data.medications.filter(m => m.status === 'taken').length;
  const missedDosesToday = data.medications.filter(m => m.status === 'missed').length;
  const upcomingDosesToday = data.medications.filter(m => m.status === 'upcoming').length;
  const todayAdherencePercentage = totalDosesToday > 0 ? Math.round((takenDosesToday / (takenDosesToday + missedDosesToday || 1)) * 100) : 100;

  return (
    <AppContext.Provider
      value={{
        patient: data.patient,
        passcodes: data.passcodes,
        medications: data.medications,
        appointments: data.appointments,
        emailOutbox: data.emailOutbox,
        weeklyAdherenceHistory: data.weeklyAdherenceHistory,
        aiInsights: data.aiInsights,
        currentRole,
        setCurrentRole,
        isOutboxOpen,
        setIsOutboxOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        activeToast,
        showToast,
        speakText,
        updateNames,
        addDiagnosisCondition,
        removeDiagnosisCondition,
        updateDiagnosisConditions,
        markDose,
        simulateMissedDose,
        simulateUpcomingAlert,
        triggerEmergencyAlert,
        addMedication,
        updateMedication,
        deleteMedication,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        sendAppointmentReminderEmail,
        updatePasscode,
        resetToDefaults,
        stats: {
          total: totalDosesToday,
          taken: takenDosesToday,
          missed: missedDosesToday,
          upcoming: upcomingDosesToday,
          adherenceRate: todayAdherencePercentage
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
