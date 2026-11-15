import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [passcode, setPasscode] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("catalyst_passcode");
    const savedProfile = localStorage.getItem("catalyst_profile");
    if (saved) {
      api.verifyPasscode(saved).then((r) => {
        if (r.ok) {
          setPasscode(saved);
          loadProfiles(saved);
          if (savedProfile) setSelectedProfileId(savedProfile);
        } else {
          localStorage.removeItem("catalyst_passcode");
        }
      }).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfiles(code) {
    try {
      const list = await api.profiles.list(code);
      setProfiles(list);
      if (!selectedProfileId && list.length) setSelectedProfileId(list[0].id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function login(code) {
    setError("");
    try {
      const r = await api.verifyPasscode(code);
      if (!r.ok) throw new Error("Invalid passcode");
      setPasscode(code);
      localStorage.setItem("catalyst_passcode", code);
      const list = await api.profiles.list(code);
      setProfiles(list);
      if (list.length) {
        setSelectedProfileId(list[0].id);
        localStorage.setItem("catalyst_profile", list[0].id);
      }
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  function logout() {
    setPasscode("");
    setProfiles([]);
    setSelectedProfileId("");
    localStorage.removeItem("catalyst_passcode");
    localStorage.removeItem("catalyst_profile");
  }

  function selectProfile(id) {
    setSelectedProfileId(id);
    localStorage.setItem("catalyst_profile", id);
  }

  const profile = useMemo(
    () => profiles.find((p) => p.id === selectedProfileId) || null,
    [profiles, selectedProfileId]
  );

  const value = {
    passcode,
    profiles,
    profile,
    selectedProfileId,
    selectProfile,
    login,
    logout,
    loading,
    error,
    isDemo: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}