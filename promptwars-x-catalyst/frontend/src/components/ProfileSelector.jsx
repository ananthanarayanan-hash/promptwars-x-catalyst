import { useAuth } from "../contexts/AuthContext";

export default function ProfileSelector() {
  const { profiles, profile, selectProfile } = useAuth();
  if (profiles.length <= 1) return null;
  return (
    <select
      value={profile?.id || ""}
      onChange={(e) => selectProfile(e.target.value)}
      className="input w-48 text-sm"
    >
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}