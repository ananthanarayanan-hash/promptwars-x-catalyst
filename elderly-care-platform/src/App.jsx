import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlarmClock, ArrowRight, Bell, CalendarDays, Check, CheckCircle2,
  ClipboardList, HeartPulse, Mail, Pill, Plus, RefreshCw, ShieldCheck,
  Siren, Trash2, UserRound, Users, X
} from 'lucide-react';

const STORE = 'elder-care-form-demo-v2';
const CASES = [
  { name: 'Rajeshwari Sundaram', family: 'Priya Nair', condition: 'Hypertension and Type 2 Diabetes' },
  { name: 'Arthur Pendelton', family: 'Eleanor Vance', condition: 'Chronic heart failure and blood pressure monitoring' },
  { name: 'Kenji Takahashi', family: 'Haruto Takahashi', condition: 'Arthritis and osteoporosis' },
  { name: 'Mateo Morales', family: 'Sofia Morales', condition: 'Type 2 Diabetes and neuropathy care' },
  { name: 'Samuel Okafor', family: 'Aisha Okafor', condition: 'COPD and medication review' },
  { name: 'Eleanor Vance', family: 'Arthur Pendelton', condition: 'Post-stroke recovery and mobility support' },
  { name: 'Priya Nair', family: 'Rajeshwari Sundaram', condition: 'Hypertension and cardiac health monitoring' },
];
const MEDS = [
  { name: 'Amlodipine', dose: '5 mg', time: '8:00 AM', instructions: 'Take with a glass of water after breakfast.', status: 'taken' },
  { name: 'Metformin', dose: '500 mg', time: '9:00 AM', instructions: 'Take with food. Do not take on an empty stomach.', status: 'upcoming' },
  { name: 'Vitamin D', dose: '1,000 IU', time: '1:00 PM', instructions: 'Take with lunch and a full glass of water.', status: 'upcoming' },
  { name: 'Atorvastatin', dose: '20 mg', time: '8:00 PM', instructions: 'Take in the evening as directed by your care team.', status: 'missed' },
];
const APPOINTMENTS = [
  { title: 'Cardiology follow-up', when: 'Thursday · 10:30 AM', place: 'City Care Clinic' },
  { title: 'Medication review', when: 'Friday · 2:00 PM', place: 'Community Health Centre' },
];
const initials = (text = '') => text.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
const newCase = (offset = Math.floor(Math.random() * CASES.length)) => {
  const item = CASES[offset % CASES.length];
  return {
    name: item.name, email: `${item.name.toLowerCase().replace(/\s+/g, '.')}@eldercareform.demo`,
    familyName: item.family, familyEmail: `${item.family.toLowerCase().replace(/\s+/g, '.')}@family.demo`,
    staffEmail: 'care.team@eldercareform.demo', diagnosis: item.condition,
    medications: MEDS.map((med, i) => ({ ...med, id: `m-${offset}-${i}` })),
    appointments: APPOINTMENTS.map((event, i) => ({ ...event, id: `a-${offset}-${i}` })),
  };
};
const safeLoad = () => {
  try { const parsed = JSON.parse(localStorage.getItem(STORE) || 'null'); return parsed && parsed.patient ? parsed : null; }
  catch { return null; }
};
const statusLabel = { taken: 'Taken', upcoming: 'Upcoming', missed: 'Missed' };

function App() {
  const [persisted] = useState(safeLoad);
  const [patient, setPatient] = useState(() => persisted?.patient || newCase(0));
  const [outbox, setOutbox] = useState(() => persisted?.outbox || []);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('elderly');
  const [form, setForm] = useState({ name: '', email: '', staffName: '', staffEmail: '', patientName: '', patientEmail: '', familyEmail: '', diagnosis: '' });
  const [caseIndex, setCaseIndex] = useState(0);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ patient, outbox })); } catch { /* Storage may be disabled or full. */ }
  }, [patient, outbox]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const adherence = useMemo(() => {
    const total = patient.medications.length;
    return total ? Math.round(patient.medications.filter((item) => item.status === 'taken').length * 100 / total) : 0;
  }, [patient.medications]);
  const missed = patient.medications.filter((item) => item.status === 'missed');
  const contacts = [...new Set([patient.staffEmail, patient.familyEmail].filter(Boolean))];

  const queueEmail = (subject, body, recipients = contacts) => {
    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const messages = recipients.map((to, i) => ({ id: `${Date.now()}-${i}-${Math.random()}`, to, timestamp, subject, body }));
    setOutbox((previous) => [...messages, ...previous].slice(0, 40));
    setNotice(`Email alert queued for ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}.`);
  };

  const openRole = (role, overrides = {}) => {
    setPatient((current) => ({ ...current, ...overrides }));
    setSession({ role, view: role === 'judge' ? 'elderly' : role, judge: role === 'judge' });
  };
  const launchJudge = () => {
    const next = (caseIndex + 1) % CASES.length;
    setCaseIndex(next);
    setPatient(newCase(next));
    setSession({ role: 'judge', view: 'elderly', judge: true });
    setNotice('Judge demo launched with a sample patient case.');
  };
  const generateCase = () => {
    const next = (caseIndex + 1) % CASES.length;
    setCaseIndex(next);
    setPatient(newCase(next));
    setNotice('A new sample clinical case is ready.');
  };
  const login = (role) => {
    if (role === 'elderly') openRole(role, { name: form.name.trim() || patient.name, email: form.email.trim() || patient.email });
    else if (role === 'family') openRole(role, { familyName: form.name.trim() || patient.familyName, familyEmail: form.email.trim() || patient.familyEmail });
    else openRole('staff', { staffEmail: form.staffEmail.trim() || patient.staffEmail });
  };
  const registerPatient = () => {
    const name = form.patientName.trim();
    const email = form.patientEmail.trim();
    const familyEmail = form.familyEmail.trim();
    if (!name || !email || !familyEmail || !form.diagnosis.trim() || !form.staffEmail.trim()) {
      setNotice('Complete each registration field, including the staff email.');
      return;
    }
    const registered = {
      ...newCase(caseIndex), name, email, familyEmail, diagnosis: form.diagnosis.trim(), staffEmail: form.staffEmail.trim(),
      medications: [], appointments: [],
    };
    setPatient(registered);
    setSession({ role: 'staff', view: 'staff', judge: false });
  };
  const updateMed = (id, patch) => setPatient((current) => ({ ...current, medications: current.medications.map((med) => med.id === id ? { ...med, ...patch } : med) }));
  const markDose = (med, status) => {
    updateMed(med.id, { status });
    if (status === 'missed') queueEmail(`Missed dose: ${med.name}`, `${patient.name} has a missed ${med.name} dose (${med.dose}) scheduled for ${med.time}. Please check in and follow the prescribed care plan.`);
  };
  const simulateMiss = () => {
    const med = patient.medications.find((item) => item.status !== 'missed') || patient.medications[0];
    if (!med) { setNotice('Add a medication before simulating a missed dose.'); return; }
    markDose(med, 'missed');
  };
  const addMedication = () => setPatient((current) => ({ ...current, medications: [...current.medications, { id: `m-${Date.now()}`, name: 'New medication', dose: 'As prescribed', time: '9:00 AM', instructions: 'Follow the instructions from your care team.', status: 'upcoming' }] }));
  const addAppointment = () => setPatient((current) => ({ ...current, appointments: [...current.appointments, { id: `a-${Date.now()}`, title: 'New appointment', when: 'Add date and time', place: 'Add location' }] }));
  const updateAppointment = (id, patch) => setPatient((current) => ({ ...current, appointments: current.appointments.map((item) => item.id === id ? { ...item, ...patch } : item) }));

  if (!session) return (
    <div className="app-shell bg-slate-50 text-slate-900">
      <div className="login-layout">
        <section className="flex min-h-0 flex-col justify-center overflow-auto px-6 py-7 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white"><HeartPulse size={27} /></div>
              <div><p className="text-xs font-bold uppercase tracking-[.24em] text-slate-500">Connected care</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Elder Care Form</h1></div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7">
              <div className="mb-5"><p className="text-sm font-bold uppercase tracking-[.16em] text-slate-500">Enterprise portal</p><h2 className="mt-1 text-2xl font-extrabold">Sign in to your care space</h2><p className="mt-1 text-sm text-slate-500">Choose your role to continue with your name and email.</p></div>
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
                {[['elderly', 'Patient', UserRound], ['family', 'Family', Users], ['staff', 'Medical staff', ShieldCheck]].map(([key, label, Icon]) => (
                  <button key={key} type="button" onClick={() => setTab(key)} className={`flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-sm font-bold transition ${tab === key ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-white'}`}><Icon size={17} />{label}</button>
                ))}
              </div>
              {tab !== 'staff' ? <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); login(tab); }}>
                <label className="block text-sm font-bold text-slate-700">{tab === 'elderly' ? 'Patient name' : 'Your name'}<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={tab === 'elderly' ? 'Enter your name' : 'Enter your name'} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium outline-none focus:border-slate-900" /></label>
                <label className="block text-sm font-bold text-slate-700">Email address<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium outline-none focus:border-slate-900" /></label>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-base font-extrabold text-white hover:bg-slate-800">Continue to {tab === 'elderly' ? 'Today' : 'Family dashboard'}<ArrowRight size={18} /></button>
              </form> : <div className="panel-scroll max-h-[58vh] space-y-4 pr-1">
                <div className="rounded-2xl border border-slate-200 p-4"><h3 className="font-extrabold">Medical staff login</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Staff name<input value={form.staffName} onChange={(event) => setForm({ ...form, staffName: event.target.value })} placeholder="Your name" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700">Staff email<input type="email" value={form.staffEmail} onChange={(event) => setForm({ ...form, staffEmail: event.target.value })} placeholder="staff@example.com" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label></div><button type="button" onClick={() => login('staff')} className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800">Open staff dashboard</button></div>
                <div className="rounded-2xl border border-slate-200 p-4"><div className="mb-3 flex items-center gap-2"><ClipboardList size={18} /><h3 className="font-extrabold">Manual patient registration</h3></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Patient name<input value={form.patientName} onChange={(event) => setForm({ ...form, patientName: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700">Patient email<input type="email" value={form.patientEmail} onChange={(event) => setForm({ ...form, patientEmail: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700">Family member email<input type="email" value={form.familyEmail} onChange={(event) => setForm({ ...form, familyEmail: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700">Staff email for alerts<input type="email" value={form.staffEmail} onChange={(event) => setForm({ ...form, staffEmail: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label><label className="text-sm font-bold text-slate-700 sm:col-span-2">Diagnosed medical condition(s)<textarea rows="2" value={form.diagnosis} onChange={(event) => setForm({ ...form, diagnosis: event.target.value })} placeholder="Enter clinician-provided diagnosis" className="mt-1 w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label></div><button type="button" onClick={registerPatient} className="mt-3 w-full rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-600">Register patient and open dashboard</button></div>
              </div>}
              <p className="mt-4 text-center text-xs text-slate-500">No password or PIN required for this demo portal.</p>
            </div>
          </div>
        </section>
        <aside className="flex min-h-[360px] flex-col justify-center bg-slate-900 px-7 py-9 text-white sm:px-12 lg:px-14">
          <div className="mx-auto w-full max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-200"><Activity size={14} /> Judge quick start</div>
            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">Experience connected care in one click.</h2>
            <p className="mt-3 max-w-md leading-relaxed text-slate-300">Launch a complete sample care plan, view real-time adherence and alerts, and switch between patient, family, and staff dashboards.</p>
            <div className="my-6 space-y-3">{['Instant clinical demo case', 'Three role-specific views', 'Medication and email alert simulation'].map((text) => <p key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-200"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Check size={14} /></span>{text}</p>)}</div>
            <button type="button" onClick={launchJudge} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-4 text-base font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-amber-300"><Activity size={19} />Launch Judge Mode (Instant Demo)</button>
            <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-400"><ShieldCheck size={16} className="mt-0.5 shrink-0" />Sample data only. This demo does not deliver email and is not a medical record or source of medical advice.</div>
          </div>
        </aside>
      </div>
      {notice && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}
    </div>
  );

  const view = session.view;
  const isElder = view === 'elderly';
  const topbar = <header className="flex h-[64px] shrink-0 items-center justify-between bg-slate-900 px-4 text-white sm:px-6">
    <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><HeartPulse size={21} /></div><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-300">Elder Care Form</p><p className="text-sm font-extrabold">{session.judge ? 'Live judge demo' : view === 'elderly' ? 'Today · Patient care' : view === 'family' ? 'Family care view' : 'Medical staff dashboard'}</p></div></div>
    <div className="flex items-center gap-2">{session.judge && <><span className="mr-1 hidden rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 sm:inline-flex">Judge mode</span>{[['elderly', 'Elderly View'], ['family', 'Family View'], ['staff', 'Staff View']].map(([key, label]) => <button key={key} onClick={() => setSession((current) => ({ ...current, view: key }))} className={`rounded-lg px-2.5 py-2 text-xs font-bold sm:px-3 ${view === key ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-100 hover:bg-slate-700'}`}>{label}</button>)}<button title="Generate new random case" onClick={generateCase} className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300"><RefreshCw size={17} /></button></>}
      <button onClick={() => setSession(null)} className="ml-1 rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-800">Log out</button>
    </div>
  </header>;

  const statusPill = (status) => <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${status === 'taken' ? 'bg-emerald-100 text-emerald-800' : status === 'missed' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}><span className={`h-1.5 w-1.5 rounded-full ${status === 'taken' ? 'bg-emerald-600' : status === 'missed' ? 'bg-red-600' : 'bg-amber-600'}`} />{statusLabel[status]}</span>;
  const outboxPanel = <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h3 className="font-extrabold">Email alert outbox</h3><p className="text-xs text-slate-500">Queued messages · demo only</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{outbox.length}</span></div><div className="panel-scroll space-y-2">{outbox.length ? outbox.slice(0, 8).map((mail) => <article key={mail.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1 font-bold text-slate-700"><Mail size={12} />{mail.to}</span><span>{mail.timestamp}</span></div><p className="mt-1.5 text-sm font-bold text-slate-900">{mail.subject}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{mail.body}</p></article>) : <div className="grid h-full min-h-20 place-items-center rounded-xl border border-dashed border-slate-300 px-4 text-center text-sm text-slate-500">No email alerts queued yet.</div>}</div><p className="mt-2 text-[10px] text-slate-400">Frontend simulation. No messages are delivered.</p></section>;

  const elderView = <main className="elder-grid min-h-0 flex-1 bg-slate-50">
    <section className="flex min-h-0 flex-col border-r border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-4 flex shrink-0 items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-slate-500">Today’s plan</p><h1 className="compact-title mt-1 text-3xl font-black tracking-tight sm:text-4xl">Your medications</h1><p className="mt-1 text-sm text-slate-500">Hello, {patient.name}. Here is everything scheduled for today.</p></div><div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-right sm:block"><p className="text-xs font-bold uppercase text-slate-500">Daily progress</p><p className="text-xl font-black">{adherence}%</p></div></div>
      <div className="panel-scroll space-y-3 pr-1">{patient.medications.length ? patient.medications.map((med) => <article key={med.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-extrabold sm:text-2xl">{med.name}</h2>{statusPill(med.status)}</div><p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-slate-600"><Pill size={16} />{med.dose}<span className="text-slate-300">·</span><AlarmClock size={16} />{med.time}</p><p className="mt-2 text-sm leading-relaxed text-slate-700 sm:text-base">{med.instructions}</p></div><button disabled={med.status === 'taken'} onClick={() => markDose(med, 'taken')} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-600 disabled:cursor-default disabled:bg-emerald-100 disabled:text-emerald-800 sm:min-w-40 sm:text-base"><CheckCircle2 size={19} />{med.status === 'taken' ? 'Taken' : 'Mark as Taken'}</button></div></article>) : <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-600">No medication schedule has been added yet.</div>}</div>
      <div className="mt-3 flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600"><ShieldCheck size={16} className="shrink-0" />Follow the current directions from your clinician. Contact your care team with questions.</div>
    </section>
    <aside className="panel-scroll flex min-h-0 flex-col gap-3 bg-slate-900 p-4 text-white sm:p-6"><div className="rounded-2xl border border-slate-700 bg-slate-800 p-5"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-lg font-black">{initials(patient.name)}</div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Today’s care status</p><h2 className="text-xl font-black sm:text-2xl">{patient.name}</h2></div></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-300">Daily adherence</p><p className="mt-1 text-3xl font-black text-emerald-300">{adherence}%</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-300">Needs attention</p><p className="mt-1 text-3xl font-black text-amber-300">{missed.length}</p></div></div><p className="mt-4 rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-slate-200"><span className="font-bold text-white">Care note: </span>{patient.diagnosis}</p><button onClick={() => queueEmail('Help requested by patient', `${patient.name} requested a care team check-in. Please contact the patient and family to confirm support.`, contacts)} className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-lg font-black text-white hover:bg-red-500"><Siren size={21} />Alert Staff via Email</button></div>
      <div className="grid grid-cols-2 gap-3"><button onClick={simulateMiss} className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-sm font-bold text-white hover:bg-slate-700">Simulate Missed Dose</button><button onClick={() => queueEmail('Upcoming medication reminder', `Reminder: ${patient.name} has medication doses scheduled today. Please check the care plan.`, contacts)} className="rounded-xl border border-slate-600 bg-slate-800 px-3 py-3 text-sm font-bold text-white hover:bg-slate-700">Send Dose Reminder</button></div>{outboxPanel}</aside>
  </main>;

  const insightText = missed.length ? `There ${missed.length === 1 ? 'is' : 'are'} ${missed.length} missed dose${missed.length === 1 ? '' : 's'} to review alongside ${patient.diagnosis}. Contact the patient to understand barriers and follow the clinician-approved plan.` : `No missed doses are currently recorded. Continue the planned routine and monitor care needs associated with ${patient.diagnosis}.`;
  const dashboard = <div className="dashboard-layout min-h-0 flex-1 bg-slate-50">
    <aside className="flex min-h-0 flex-col bg-slate-900 p-4 text-white"><div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><HeartPulse size={22} /></div><div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Elder Care Form</p><p className="font-extrabold">{view === 'staff' ? 'Care team' : 'Family view'}</p></div></div><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Patient</p><p className="mt-1 text-xl font-black">{patient.name}</p><p className="mt-1 break-all text-xs text-slate-400">{patient.email}</p></div><div className="mt-3 rounded-2xl bg-white/5 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Adherence today</p><p className="mt-1 text-4xl font-black text-emerald-300">{adherence}<span className="text-xl">%</span></p><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${adherence}%` }} /></div></div><div className="mt-auto rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs leading-relaxed text-slate-300"><Mail size={15} className="mb-1" />Alerts are addressed to the registered staff and family emails.</div></aside>
    <main className="dashboard-grid min-h-0 overflow-hidden p-3 sm:p-4">
      <section className="panel-scroll rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black sm:text-xl"><Pill size={19} />Medication schedule</h2><p className="text-xs text-slate-500">Edit details and record today’s status.</p></div>{view === 'staff' && <button onClick={addMedication} className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Plus size={15} />Add</button>}</div><div className="space-y-2">{patient.medications.length ? patient.medications.map((med) => <article key={med.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="grid gap-2 sm:grid-cols-[minmax(100px,1fr)_90px_95px_auto]">{view === 'staff' ? <input aria-label="Medication name" value={med.name} onChange={(event) => updateMed(med.id, { name: event.target.value })} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-bold" /> : <p className="self-center text-sm font-bold">{med.name}</p>}{view === 'staff' ? <input aria-label="Dose" value={med.dose} onChange={(event) => updateMed(med.id, { dose: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs" /> : <p className="self-center text-xs text-slate-600">{med.dose}</p>}{view === 'staff' ? <input aria-label="Dose time" value={med.time} onChange={(event) => updateMed(med.id, { time: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs" /> : <p className="self-center text-xs text-slate-600">{med.time}</p>}<div className="flex items-center gap-1">{statusPill(med.status)}{view === 'staff' && <button title="Delete medication" onClick={() => setPatient((current) => ({ ...current, medications: current.medications.filter((item) => item.id !== med.id) }))} className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /></button>}</div></div>{view === 'staff' ? <div className="mt-2 flex flex-wrap items-center gap-2"><input aria-label="Medication instructions" value={med.instructions} onChange={(event) => updateMed(med.id, { instructions: event.target.value })} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" /><button onClick={() => markDose(med, 'taken')} className="rounded-lg bg-emerald-700 px-2.5 py-2 text-xs font-bold text-white">Taken</button><button onClick={() => markDose(med, 'missed')} className="rounded-lg bg-red-700 px-2.5 py-2 text-xs font-bold text-white">Missed</button><button onClick={() => updateMed(med.id, { status: 'upcoming' })} className="rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-bold">Upcoming</button></div> : <p className="mt-1 text-xs text-slate-500">{med.instructions}</p>}</article>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No medicines added. Medical staff can add the prescribed schedule.</p>}</div></section>
      <section className="panel-scroll rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black sm:text-xl"><UserRound size={19} />Patient & care plan</h2><p className="text-xs text-slate-500">{view === 'staff' ? 'Staff can update the record.' : 'Current registered care details.'}</p></div></div><div className="space-y-3"><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Patient name<input readOnly={view !== 'staff'} value={patient.name} onChange={(event) => setPatient((current) => ({ ...current, name: event.target.value }))} className={`mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold ${view === 'staff' ? 'bg-white' : 'bg-slate-50'}`} /></label><label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Diagnosed medical condition(s)<textarea readOnly={view !== 'staff'} rows="2" value={patient.diagnosis} onChange={(event) => setPatient((current) => ({ ...current, diagnosis: event.target.value }))} className={`mt-1 block w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium ${view === 'staff' ? 'bg-white' : 'bg-slate-50'}`} /></label><div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-50 p-2.5"><p className="text-[10px] font-bold uppercase text-slate-500">Staff email</p><p className="mt-1 break-all text-xs font-semibold">{patient.staffEmail || 'Not registered'}</p></div><div className="rounded-lg bg-slate-50 p-2.5"><p className="text-[10px] font-bold uppercase text-slate-500">Family email</p><p className="mt-1 break-all text-xs font-semibold">{patient.familyEmail || 'Not registered'}</p></div></div><div className="flex gap-2"><button onClick={simulateMiss} className="flex-1 rounded-lg bg-red-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-red-600">Simulate missed dose</button><button onClick={() => queueEmail('Upcoming dose reminder', `${patient.name} has scheduled medication doses coming up. Please help support the current care plan.`)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-bold hover:bg-slate-50">Email reminder</button></div></div></section>
      <section className="panel-scroll rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black sm:text-xl"><CalendarDays size={19} />Upcoming appointments</h2><p className="text-xs text-slate-500">Care visits and follow-ups.</p></div>{view === 'staff' && <button onClick={addAppointment} className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Plus size={15} />Add</button>}</div><div className="space-y-2">{patient.appointments.map((appt) => <article key={appt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><input aria-label="Appointment title" readOnly={view !== 'staff'} value={appt.title} onChange={(event) => updateAppointment(appt.id, { title: event.target.value })} className="w-full bg-transparent text-sm font-extrabold outline-none" /><div className="mt-2 grid grid-cols-2 gap-2"><input aria-label="Appointment date and time" readOnly={view !== 'staff'} value={appt.when} onChange={(event) => updateAppointment(appt.id, { when: event.target.value })} className="min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs" /><input aria-label="Appointment location" readOnly={view !== 'staff'} value={appt.place} onChange={(event) => updateAppointment(appt.id, { place: event.target.value })} className="min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs" /></div><button onClick={() => queueEmail(`Appointment reminder: ${appt.title}`, `${patient.name} has ${appt.title} scheduled for ${appt.when} at ${appt.place}. Please confirm reminder and transport needs.`)} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-950"><Bell size={13} />Email appointment alert</button></article>)}{!patient.appointments.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No upcoming appointments recorded.</p>}</div></section>
      <section className="panel-scroll rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3"><h2 className="flex items-center gap-2 text-lg font-black sm:text-xl"><Activity size={19} />AI Care Insights & Routine Advisor</h2><p className="text-xs text-slate-500">Rule-based demo observations · not medical advice</p></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-3"><div className="flex items-center gap-2 text-sm font-extrabold text-amber-900"><Siren size={16} />{missed.length ? `${missed.length} missed dose${missed.length > 1 ? 's' : ''} need review` : 'Routine currently on track'}</div><p className="mt-2 text-xs leading-relaxed text-slate-700">{insightText}</p></div><div className="mt-2 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-700">Condition entered</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{patient.diagnosis}. Use the clinician-approved schedule; seek advice from the care team for any changes.</p></div></section>
      {outboxPanel}
    </main>
  </div>;

  return <div className="app-shell flex flex-col bg-slate-50 text-slate-900">{topbar}{isElder ? elderView : dashboard}{notice && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}</div>;
}

export default App;
