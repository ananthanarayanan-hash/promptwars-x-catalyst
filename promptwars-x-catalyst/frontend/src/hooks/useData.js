import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function useApi(fn, deps = []) {
  const { passcode } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const r = await fn(passcode);
      setData(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, deps); // eslint-disable-line

  return { data, loading, error, reload: load, setData };
}