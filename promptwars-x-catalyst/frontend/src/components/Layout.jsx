import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const nav = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/medications", label: "Medications", icon: "💊" },
  { to: "/adherence", label: "Adherence", icon: "✅" },
  { to: "/appointments", label: "Appointments", icon: "📅" },
  { to: "/caregivers", label: "Caregivers", icon: "👥" },
  { to: "/reminders", label: "Reminders", icon: "🔔" },
];

export default function Layout({ children }) {
  const { profile, passcode, clearAuth, isDemo } = useAuth();
  const loc = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-xl"> careg</div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Catalyst Care</h1>
              <p className="text-[11px] text-slate-400">Elderly Care Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = loc.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-sky-600 text-white" : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="rounded-lg bg-slate-800/60 p-3">
            <p className="text-xs text-slate-400">Caring for</p>
            <p className="text-white font-semibold">{profile?.name || "—"}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              {isDemo ? "Demo mode" : "Live mode"}
            </p>
          </div>
          <button
            onClick={clearAuth}
            className="mt-2 w-full text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-4">
          <h2 className="text-xl font-bold text-slate-900">
            {nav.find((n) => n.to === loc.pathname)?.label || "Catalyst Care"}
          </h2>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}