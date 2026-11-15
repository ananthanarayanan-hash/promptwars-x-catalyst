import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import Adherence from "./pages/Adherence";
import Appointments from "./pages/Appointments";
import Caregivers from "./pages/Caregivers";
import Reminders from "./pages/Reminders";

export default function App() {
  const { loading, passcode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-400 animate-pulse" />
      </div>
    );
  }

  if (!passcode) {
    return <Login />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/adherence" element={<Adherence />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/caregivers" element={<Caregivers />} />
        <Route path="/reminders" element={<Reminders />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}