import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const { login, error } = useAuth();

  async function submit(e) {
    e.preventDefault();
    try {
      await login(code);
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-emerald-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400 flex items-center justify-center text-3xl shadow-lg">
            🏥
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Catalyst Care</h1>
          <p className="mt-1 text-slate-500">Elderly Care & Medication Management</p>
          <p className="mt-3 text-xs text-slate-400">PromptWars × Catalyst Hackathon</p>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Authorized access</h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the shared passcode to view and manage a care profile.
          </p>

          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label className="label">Passcode</label>
              <input
                type={show ? "text" : "password"}
                inputMode="numeric"
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter passcode"
                className="input text-center tracking-[0.3em]"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Enter</button>
            <button type="button" onClick={() => setShow(!show)} className="btn btn-ghost w-full text-xs">
              {show ? "Hide" : "Show"} passcode
            </button>
            {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">Demo accounts (seed data):</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "1234", label: "Demo passcode" },
                { code: "1234", label: "Same code" },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setCode(a.code)}
                  className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Default passcode is <code className="rounded bg-slate-100 px-1">1234</code>. Set{" "}
              <code className="rounded bg-slate-100 px-1">CAREGIVER_PASSCODE</code> in the backend to change it.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Built for students, developers, designers and emerging builders across India.
        </p>
      </div>
    </div>
  );
}