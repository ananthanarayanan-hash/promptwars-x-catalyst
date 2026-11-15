import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'eldercareform_state_v1';

const NAME_BANK = {
  first: [
    'Rajeshwari', 'Priya', 'Arthur', 'Eleanor', 'Kenji', 'Mateo', 'Samuel', 'Aisha',
    'Ananya', 'Haruto', 'María', 'Olivia', 'Ramesh', 'Sofia', 'Daniel', 'Grace'
  ],
  last: [
    'Sundaram', 'Nair', 'Pendelton', 'Vance', 'Takahashi', 'Morales', 'Okafor', 'Ahmed',
    'Patel', 'Müller', 'Fernandez', 'Johnson', 'Kumar', 'Martinez', 'Nguyen', 'Wong'
  ]
};

const DIAGNOSES = [
  'Hypertension and Type 2 Diabetes',
  'Chronic Heart Failure and Arrhythmia',
  'Arthritis and Osteoporosis',
  'COPD and Medication Review',
  'Parkinsons Disease and Mobility Care',
  'Post-Stroke Recovery and Blood Pressure Support'
];

const MEDICATION_TEMPLATES = [
  { name: 'Amlodipine', dose: '5 mg', time: '08:00', instructions: 'Take with water after breakfast.', status: 'upcoming' },
  { name: 'Metformin', dose: '500 mg', time: '08:30', instructions: 'Take with food and a full glass of water.', status: 'upcoming' },
  { name: 'Atorvastatin', dose: '20 mg', time: '19:00', instructions: 'Take at bedtime with a light snack.', status: 'upcoming' },
  { name: 'Vitamin D', dose: '1000 IU', time: '12:30', instructions: 'Take after lunch with calcium-rich food.', status: 'upcoming' },
  { name: 'Ibuprofen', dose: '200 mg', time: '18:00', instructions: 'Only if pain is present; avoid on an empty stomach.', status: 'taken' }
];

const APPOINTMENT_TEMPLATES = [
  { title: 'Cardiology Follow-up', time: 'Thu, 10:30 AM', location: 'City Care Clinic' },
  { title: 'Pharmacist Review', time: 'Fri, 2:00 PM', location: 'Medication Centre' },
  { title: 'Home Nurse Visit', time: 'Mon, 9:15 AM', location: 'Patient Residence' }
];

const EMAIL_TEMPLATES = {
  missedDose: (patientName, medName) => ({
    subject: `Missed dose alert for ${patientName}`,
    body: `${patientName} missed the ${medName} dose. Please confirm whether it was delayed, skipped, or rescheduled. Follow-up required to prevent medication gaps and monitor adherence.`
  }),
  reminder: (patientName, medName, time) => ({
    subject: `Upcoming medication reminder for ${patientName}`,
    body: `This is a reminder that ${patientName} is scheduled for ${medName} at ${time}. Please ensure the dose is prepared and supervised if required.`
  }),
  appointment: (patientName, title, time) => ({
    subject: `Appointment alert for ${patientName}`,
    body: `${patientName} has an upcoming appointment: ${title} on ${time}. Please confirm a reminder and any transport or follow-up needs.`
  }),
  helpRequest: (patientName) => ({
    subject: `Urgent help request from ${patientName}`,
    body: `${patientName} has requested immediate assistance. Please contact the patient and confirm the next care step. This request was sent through the Elder Care Form alert system.`
  })
};

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'patient';
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateRandomCase() {
  const firstName = randomItem(NAME_BANK.first);
  const lastName = randomItem(NAME_BANK.last);
  const familyFirst = randomItem(NAME_BANK.first);
  const familyLast = randomItem(NAME_BANK.last);
  const patientName = `${firstName} ${lastName}`;
  const familyName = `${familyFirst} ${familyLast}`;

  const medications = MEDICATION_TEMPLATES.map((med, index) => ({
    id: `med-${index + 1}`,
    ...med,
    status: index === 4 ? 'missed' : index === 3 ? 'upcoming' : 'taken'
  }));

  medications[1].status = 'upcoming';
  medications[2].status = 'upcoming';

  return {
    patientName,
    patientEmail: `${slugify(patientName)}@eldercareform.com`,
    familyName,
    familyEmail: `${slugify(familyName)}@familymail.com`,
    staffEmail: 'care.team@eldercareform.com',
    diagnosis: randomItem(DIAGNOSES),
    medications,
    appointments: APPOINTMENT_TEMPLATES.map((item, index) => ({
      id: `appt-${index + 1}`,
      ...item
    }))
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function getAdherencePercent(medications) {
  if (!medications || !medications.length) return 0;
  const taken = medications.filter((med) => med.status === 'taken').length;
  return Math.round((taken / medications.length) * 100);
}

function getStatusClasses(status) {
  if (status === 'taken') {
    return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
  }
  if (status === 'missed') {
    return 'bg-red-100 text-red-700 border border-red-300';
  }
  return 'bg-amber-100 text-amber-700 border border-amber-300';
}

function App() {
  const [state, setState] = useState(() => {
    const saved = loadState();
    if (saved) return saved;
    return {
      session: null,
      patient: generateRandomCase(),
      alerts: []
    };
  });

  const [loginTab, setLoginTab] = useState('elderly');
  const [loginData, setLoginData] = useState({
    elderlyName: '',
    elderlyEmail: '',
    familyName: '',
    familyEmail: '',
    staffName: '',
    staffEmail: '',
    patientName: '',
    patientEmail: '',
    familyMemberEmail: '',
    diagnosis: ''
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const patient = state.patient || generateRandomCase();
  const adherence = useMemo(() => getAdherencePercent(patient.medications), [patient.medications]);

  const createAlert = (to, subject, body, source = 'system') => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      time: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      to,
      subject,
      body,
      source
    };

    setState((prev) => ({
      ...prev,
      alerts: [entry, ...(prev.alerts || [])]
    }));
  };

  const updatePatient = (updates) => {
    setState((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        ...updates
      }
    }));
  };

  const updateMedication = (id, updates) => {
    setState((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        medications: (prev.patient?.medications || []).map((med) =>
          med.id === id ? { ...med, ...updates } : med
        )
      }
    }));
  };

  const markMedication = (id, status) => {
    updateMedication(id, { status });

    const med = patient.medications.find((item) => item.id === id);
    if (status === 'missed') {
      createAlert(
        patient.staffEmail,
        `Missed medication: ${med.name}`,
        `${patient.patientName} missed the ${med.name} dose scheduled for ${med.time}. This dose should be reviewed and followed up by the care team.`
      );
      createAlert(
        patient.familyEmail,
        `Missed medication: ${med.name}`,
        `${patient.patientName} missed the ${med.name} dose scheduled for ${med.time}. Please contact the care team if additional support is needed.`
      );
    }
  };

  const simulateMissedDose = () => {
    const med = patient.medications.find((item) => item.status !== 'missed') || patient.medications[0];
    if (!med) return;

    markMedication(med.id, 'missed');
    createAlert(
      patient.staffEmail,
      `Missed dose alert: ${med.name}`,
      `${patient.patientName} missed the scheduled ${med.name} dose at ${med.time}. Please review adherence and provide follow-up support.`
    );
  };

  const sendEmailAlert = (type, payload) => {
    const target = type === 'family' ? patient.familyEmail : patient.staffEmail;
    const template = EMAIL_TEMPLATES[type]?.(payload.patientName || patient.patientName, payload.medName || payload.title || payload.name || patient.diagnosis, payload.time || 'today');
    if (template) {
      createAlert(target, template.subject, template.body);
    }
  };

  const handleLogin = (mode) => {
    const sessionMap = {
      elderly: { role: 'elderly', activeView: 'elderly', judgeMode: false },
      family: { role: 'family', activeView: 'family', judgeMode: false },
      staff: { role: 'staff', activeView: 'staff', judgeMode: false }
    };

    const draftPatient = {
      ...patient,
      patientName: loginData.patientName || patient.patientName,
      patientEmail: loginData.patientEmail || patient.patientEmail,
      familyEmail: loginData.familyMemberEmail || patient.familyEmail,
      staffEmail: loginData.staffEmail || patient.staffEmail,
      diagnosis: loginData.diagnosis || patient.diagnosis,
      patientName: mode === 'staff' && loginData.patientName ? loginData.patientName : patient.patientName,
      familyEmail: mode === 'staff' && loginData.familyMemberEmail ? loginData.familyMemberEmail : patient.familyEmail
    };

    if (mode === 'staff') {
      const manualPatient = {
        ...patient,
        patientName: loginData.patientName || patient.patientName,
        patientEmail: loginData.patientEmail || patient.patientEmail,
        familyEmail: loginData.familyMemberEmail || patient.familyEmail,
        staffEmail: loginData.staffEmail || patient.staffEmail,
        diagnosis: loginData.diagnosis || patient.diagnosis
      };

      setState((prev) => ({
        ...prev,
        patient: manualPatient,
        session: { ...sessionMap.staff }
      }));
      return;
    }

    if (mode === 'elderly') {
      const elderlyPatient = {
        ...patient,
        patientName: loginData.elderlyName || patient.patientName,
        patientEmail: loginData.elderlyEmail || patient.patientEmail
      };

      setState((prev) => ({
        ...prev,
        patient: elderlyPatient,
        session: { ...sessionMap.elderly }
      }));
      return;
    }

    const familyPatient = {
      ...patient,
      patientName: patient.patientName,
      familyEmail: loginData.familyEmail || patient.familyEmail,
      patientEmail: patient.patientEmail,
      staffEmail: patient.staffEmail
    };

    setState((prev) => ({
      ...prev,
      patient: familyPatient,
      session: { ...sessionMap.family }
    }));
  };

  const launchJudgeMode = () => {
    const freshPatient = generateRandomCase();
    setState((prev) => ({
      ...prev,
      patient: freshPatient,
      session: {
        role: 'judge',
        activeView: 'elderly',
        judgeMode: true
      }
    }));
  };

  const switchView = (nextView) => {
    setState((prev) => ({
      ...prev,
      session: {
        ...prev.session,
        activeView: nextView
      }
    }));
  };

  const addMedication = () => {
    setState((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        medications: [
          ...((prev.patient?.medications) || []),
          {
            id: `med-${Date.now()}`,
            name: 'New Medication',
            dose: 'As directed',
            time: '09:00',
            instructions: 'Take as prescribed.',
            status: 'upcoming'
          }
        ]
      }
    }));
  };

  const deleteMedication = (id) => {
    setState((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        medications: (prev.patient?.medications || []).filter((med) => med.id !== id)
      }
    }));
  };

  const addAppointment = () => {
    setState((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        appointments: [
          ...((prev.patient?.appointments) || []),
          {
            id: `appt-${Date.now()}`,
            title: 'New Review',
            time: 'Tue, 3:00 PM',
            location: 'Care Team Office'
          }
        ]
      }
    }));
  };

  const loginScreen = (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="grid h-full w-full grid-cols-[1.5fr_0.9fr]">
        <div className="border-r border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Enterprise access</p>
              <h1 className="mt-2 text-5xl font-black text-slate-900">Elder Care Form</h1>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
            <div className="mb-4 flex gap-2">
              {[
                ['elderly', 'Elderly Patient'],
                ['family', 'Family Member'],
                ['staff', 'Medical Staff']
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLoginTab(key)}
                  className={`flex-1 rounded-2xl px-4 py-3 text-base font-bold transition ${
                    loginTab === key ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15' : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loginTab === 'elderly' && (
              <div className="space-y-4 rounded-2xl bg-white p-5">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Patient Name</label>
                  <input
                    value={loginData.elderlyName}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, elderlyName: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Email</label>
                  <input
                    type="email"
                    value={loginData.elderlyEmail}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, elderlyEmail: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                    placeholder="patient@email.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleLogin('elderly')}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-lg font-black text-white transition hover:bg-emerald-500"
                >
                  Open Patient View
                </button>
              </div>
            )}

            {loginTab === 'family' && (
              <div className="space-y-4 rounded-2xl bg-white p-5">
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Family Member Name</label>
                  <input
                    value={loginData.familyName}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, familyName: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Email</label>
                  <input
                    type="email"
                    value={loginData.familyEmail}
                    onChange={(event) => setLoginData((prev) => ({ ...prev, familyEmail: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                    placeholder="family@email.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleLogin('family')}
                  className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-lg font-black text-white transition hover:bg-sky-500"
                >
                  Open Family Dashboard
                </button>
              </div>
            )}

            {loginTab === 'staff' && (
              <div className="space-y-4 rounded-2xl bg-white p-5">
                <div className="space-y-4 border-b border-slate-200 pb-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Staff Name</label>
                    <input
                      value={loginData.staffName}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, staffName: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="Enter staff member name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Staff Email</label>
                    <input
                      type="email"
                      value={loginData.staffEmail}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, staffEmail: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="staff@eldercareform.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLogin('staff')}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-lg font-black text-white transition hover:bg-slate-700"
                  >
                    Staff Login
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-black text-slate-900">Manual Patient Registration</h3>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Patient Name</label>
                    <input
                      value={loginData.patientName}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, patientName: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="Patient full name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Patient Email</label>
                    <input
                      type="email"
                      value={loginData.patientEmail}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, patientEmail: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="patient@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Family Member Email</label>
                    <input
                      type="email"
                      value={loginData.familyMemberEmail}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, familyMemberEmail: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="family@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Diagnosed Medical Condition(s)</label>
                    <textarea
                      value={loginData.diagnosis}
                      onChange={(event) => setLoginData((prev) => ({ ...prev, diagnosis: event.target.value }))}
                      rows={3}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base outline-none ring-0 focus:border-slate-900"
                      placeholder="e.g. Hypertension, Type 2 Diabetes"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="bg-slate-900 p-6 text-white">
          <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-5 shadow-2xl shadow-slate-900/20">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Judge quick-start</p>
            <h2 className="mt-3 text-3xl font-black text-white">Instant demo mode</h2>
            <ul className="mt-5 space-y-3 text-base text-slate-200">
              <li>• Launch a complete clinical case in one click.</li>
              <li>• Switch between elderly, family, and staff views instantly.</li>
              <li>• View live adherence, email alerts, and medication management.</li>
            </ul>
            <button
              type="button"
              onClick={launchJudgeMode}
              className="mt-6 w-full rounded-2xl bg-amber-400 px-4 py-3 text-lg font-black text-slate-900 transition hover:bg-amber-300"
            >
              Launch Judge Mode (Instant Demo)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );

  const toolbar = state.session?.judgeMode ? (
    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-3 text-white shadow-lg shadow-slate-900/10">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-amber-400 px-2 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-900">Judge</div>
        <h2 className="text-xl font-black">Elder Care Form</h2>
      </div>

      <div className="flex items-center gap-2">
        {['elderly', 'family', 'staff'].map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => switchView(view)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              state.session?.activeView === view
                ? 'bg-white text-slate-900'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            }`}
          >
            {view === 'elderly' ? 'Elderly View' : view === 'family' ? 'Family View' : 'Staff View'}
          </button>
        ))}
        <button
          type="button"
          onClick={launchJudgeMode}
          className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 transition hover:bg-amber-300"
        >
          Generate New Random Case
        </button>
      </div>
    </div>
  ) : null;

  const renderElderly = (
    <div className="grid h-full grid-cols-[1.4fr_0.9fr] gap-0 bg-slate-50">
      <section className="border-r border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Today</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900">Medication Command Center</h2>
          </div>
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, session: null }))}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            Log Out
          </button>
        </div>

        <div className="space-y-4">
          {patient.medications.map((med) => (
            <div key={med.id} className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900">{med.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${getStatusClasses(med.status)}`}>
                      {med.status}
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-slate-600">{med.dose} • {med.time}</p>
                  <p className="mt-2 text-lg text-slate-700">{med.instructions}</p>
                </div>
                <button
                  type="button"
                  onClick={() => markMedication(med.id, 'taken')}
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-lg font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
                >
                  Mark as Taken
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="bg-slate-900 p-6 text-white">
        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">Care status</p>
          <h3 className="mt-3 text-3xl font-black text-white">{patient.patientName}</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Adherence</p>
              <p className="mt-2 text-4xl font-black text-emerald-300">{adherence}%</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-300">Today</p>
              <p className="mt-2 text-3xl font-black text-amber-300">{patient.medications.filter((med) => med.status === 'upcoming').length}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-700 p-4">
            <p className="text-sm text-slate-300">Diagnosis</p>
            <p className="mt-2 text-lg font-semibold text-white">{patient.diagnosis}</p>
          </div>

          <button
            type="button"
            onClick={() => sendEmailAlert('staff', { patientName: patient.patientName, title: 'Request for care check-in', time: 'now' })}
            className="mt-5 w-full rounded-2xl bg-rose-600 px-4 py-3 text-lg font-black text-white transition hover:bg-rose-500"
          >
            Alert Staff via Email
          </button>

          <button
            type="button"
            onClick={simulateMissedDose}
            className="mt-3 w-full rounded-2xl border border-slate-500 bg-slate-700 px-4 py-3 text-lg font-black text-white transition hover:bg-slate-600"
          >
            Simulate Missed Dose
          </button>
        </div>
      </aside>
    </div>
  );

  const renderFamily = (
    <div className="grid h-full grid-cols-[260px_1fr] bg-slate-50">
      <aside className="border-r border-slate-200 bg-slate-900 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">Family view</p>
        <h2 className="mt-3 text-3xl font-black text-white">{patient.patientName}</h2>
        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-slate-300">Adherence today</p>
          <p className="mt-2 text-5xl font-black text-emerald-300">{adherence}%</p>
        </div>
        <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
          <p className="font-bold text-white">Care team email</p>
          <p className="mt-2">{patient.staffEmail}</p>
          <p className="mt-4 font-bold text-white">Family email</p>
          <p className="mt-2">{patient.familyEmail}</p>
        </div>
      </aside>

      <main className="grid grid-cols-2 gap-5 p-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900">Medication adherence</h3>
          <div className="mt-4 space-y-3">
            {patient.medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-slate-800">{med.name}</p>
                  <p className="text-sm text-slate-500">{med.time}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${getStatusClasses(med.status)}`}>
                  {med.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900">Upcoming appointments</h3>
          <div className="mt-4 space-y-3">
            {patient.appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-bold text-slate-800">{appointment.title}</p>
                <p className="mt-1 text-sm text-slate-600">{appointment.time}</p>
                <p className="mt-1 text-sm text-slate-500">{appointment.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900">Email alert outbox</h3>
          <div className="mt-4 max-h-[270px] space-y-3 overflow-auto pr-2">
            {(state.alerts || []).slice(0, 6).map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">To: {alert.to}</span>
                  <span className="text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-2 font-bold text-slate-900">{alert.subject}</p>
                <p className="mt-2 text-sm text-slate-600">{alert.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  const renderStaff = (
    <div className="grid h-full grid-cols-[260px_1fr] bg-slate-50">
      <aside className="border-r border-slate-200 bg-slate-900 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-300">Staff dashboard</p>
        <h2 className="mt-3 text-3xl font-black text-white">{patient.patientName}</h2>
        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-slate-300">Adherence score</p>
          <p className="mt-2 text-5xl font-black text-emerald-300">{adherence}%</p>
        </div>
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={simulateMissedDose}
            className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-base font-black text-white transition hover:bg-rose-500"
          >
            Simulate Missed Dose
          </button>
          <button
            type="button"
            onClick={() => sendEmailAlert('staff', { patientName: patient.patientName, title: 'Doctor appointment review', time: 'today' })}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-3 text-base font-black text-white transition hover:bg-slate-700"
          >
            Send Appointment Alert
          </button>
        </div>
      </aside>

      <main className="grid gap-5 p-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900">Patient details</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Patient Name</label>
              <input
                value={patient.patientName}
                onChange={(event) => updatePatient({ patientName: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-900"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Diagnosed Medical Condition(s)</label>
              <textarea
                value={patient.diagnosis}
                rows={3}
                onChange={(event) => updatePatient({ diagnosis: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Medication schedule manager</h3>
            <button
              type="button"
              onClick={addMedication}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Add Medication
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {patient.medications.map((med) => (
              <div key={med.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="grid grid-cols-[1fr_100px_110px] gap-2">
                  <input
                    value={med.name}
                    onChange={(event) => updateMedication(med.id, { name: event.target.value })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                  />
                  <input
                    value={med.time}
                    onChange={(event) => updateMedication(med.id, { time: event.target.value })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => markMedication(med.id, 'taken')} className="rounded-xl bg-emerald-600 px-2 py-2 text-xs font-bold text-white">Taken</button>
                    <button type="button" onClick={() => markMedication(med.id, 'missed')} className="rounded-xl bg-red-600 px-2 py-2 text-xs font-bold text-white">Missed</button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={med.instructions}
                    onChange={(event) => updateMedication(med.id, { instructions: event.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                  />
                  <button type="button" onClick={() => deleteMedication(med.id)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Appointments</h3>
            <button
              type="button"
              onClick={addAppointment}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Add Appointment
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {patient.appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl bg-slate-50 p-3">
                <input
                  value={appointment.title}
                  onChange={(event) => {
                    setState((prev) => ({
                      ...prev,
                      patient: {
                        ...prev.patient,
                        appointments: prev.patient.appointments.map((item) =>
                          item.id === appointment.id ? { ...item, title: event.target.value } : item
                        )
                      }
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    value={appointment.time}
                    onChange={(event) => {
                      setState((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          appointments: prev.patient.appointments.map((item) =>
                            item.id === appointment.id ? { ...item, time: event.target.value } : item
                          )
                        }
                      }));
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                  />
                  <input
                    value={appointment.location}
                    onChange={(event) => {
                      setState((prev) => ({
                        ...prev,
                        patient: {
                          ...prev.patient,
                          appointments: prev.patient.appointments.map((item) =>
                            item.id === appointment.id ? { ...item, location: event.target.value } : item
                          )
                        }
                      }));
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-2xl font-black text-slate-900">AI Care Insights & Routine Advisor</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Adherence insight</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {adherence >= 80 ? 'Strong daily adherence with minor follow-up needed.' : 'Medication gaps detected. Review missed doses and patient support needs.'}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Diagnosis alignment</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{patient.diagnosis} requires consistent monitoring and hydration support.</p>
            </div>
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">Risk alert</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {patient.medications.filter((med) => med.status === 'missed').length > 0 ? 'Missed dose pattern requires staff outreach.' : 'No severe missed-dose risk identified today.'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-2xl font-black text-slate-900">Email alert outbox</h3>
          <div className="mt-4 max-h-[280px] space-y-3 overflow-auto pr-2">
            {(state.alerts || []).slice(0, 8).map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">To: {alert.to}</span>
                  <span className="text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-2 font-bold text-slate-900">{alert.subject}</p>
                <p className="mt-2 text-sm text-slate-600">{alert.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  if (!state.session) {
    return loginScreen;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      {toolbar}
      <div className="h-[calc(100vh-72px)] overflow-hidden">
        {state.session.activeView === 'elderly' ? renderElderly : state.session.activeView === 'family' ? renderFamily : renderStaff}
      </div>
    </div>
  );
}

export default App;
