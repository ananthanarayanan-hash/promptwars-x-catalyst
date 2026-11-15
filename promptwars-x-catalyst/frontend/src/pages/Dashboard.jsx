import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";
import StatCard from "../components/StatCard";
import ProfileSelector from "../components/ProfileSelector";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { passcode, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const [s, doses, appts] = await Promise.all([
        api.reminders.status(passcode),
        api.doses.list({ status: "pending", to: new Date(Date.now() + 48 * 3600 * 1000).toISOString() }, passcode),
        api.appointments.list({ profile_id: profile?.id }, passcode),
      ]);
      setStats(s);
      setUpcoming(doses);
      setAppointments(appts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [passcode, profile?.id]); // eslint-disable-line

  if (loading || !stats) {
    return <div className="text-slate-400">Loading…</div>;
  }

  const adherencePct = stats.doses.total
    ? Math.round((stats.doses.taken / stats.doses.total) * 100)
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm">Overview for {profile?.name || "selected profile"}</p>
        </div>
        <ProfileSelector />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Adherence rate" value={`${adherencePct}%`} tone={adherencePct >= 80 ? "emerald" : "amber"} hint="of all recorded doses" />
        <StatCard label="Pending doses" value={stats.doses.pending} tone="sky" hint="scheduled and not yet taken" />
        <StatCard label="Missed doses" value={stats.doses.missed} tone="rose" hint="past the scheduled time" />
        <StatCard label="Upcoming appointments" value={appointments.length} tone="slate" hint="in the next weeks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Upcoming doses (48h)</h3>
            <Link to="/medications" className="text-sm text-sky-600 hover:underline">Manage →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming doses in the next 48 hours.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.slice(0, 6).map((d) => (
                <li key={d.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {d.med_name} <span className="text-slate-400">{d.dosage} {d.unit}</span>
                    </p>
                    <p className="text-xs text-slate-400">{new Date(d.scheduled_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <Link
                    to="/adherence"
                    state={{ focus: d.id }}
                    className="btn btn-primary text-xs px-3 py-1.5"
                  >
                    Mark taken
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Upcoming appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-sm text-slate-400">No appointments scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.slice(0, 4).map((a) => (
                <li key={a.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(a.datetime).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {a.doctor && <p className="text-xs text-slate-400">With {a.doctor}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Reminder engine</h3>
            <p className="text-sm text-slate-500">
              Mode: <span className={stats.email.simulationMode ? "text-amber-600" : "text-emerald-600 font-medium"}>{stats.email.simulationMode ? "Simulation" : "Live"}</span>
              {stats.email.ok === false && <span className="ml-2 text-rose-600">SMTP: {stats.email.reason}</span>}
            </p>
          </div>
          <Link to="/reminders" className="btn btn-secondary text-sm">View logs →</Link>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Last sweep: {stats.scheduler.lastTick ? new Date(stats.scheduler.lastTick).toLocaleTimeString("en-IN") : "never"}
        </p>
      </div>
    </div>
  );
}