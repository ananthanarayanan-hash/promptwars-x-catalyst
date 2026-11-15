const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, passcode } = {}) {
  const headers = {};
  if (passcode) headers["x-passcode"] = passcode;
  if (body) {
    headers["content-type"] = "application/json";
    body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}/api${path}`, { method, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  health: () => request("/health"),
  verifyPasscode: (passcode) => request("/caregivers/verify", { method: "POST", body: { passcode } }),
  profiles: {
    list: (passcode) => request("/profiles", { headers: { "x-passcode": passcode } }),
    get: (id, passcode) => request(`/${id}`, { headers: { "x-passcode": passcode } }),
    create: (data, passcode) => request("/", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
    update: (id, data, passcode) => request(`/${id}`, { method: "PUT", body: data, headers: { "x-passcode": passcode } }),
    remove: (id, passcode) => request(`/${id}`, { method: "DELETE", headers: { "x-passcode": passcode } }),
  },
  medications: {
    list: (passcode) => request("/medications", { headers: { "x-passcode": passcode } }),
    get: (id, passcode) => request(`/medications/${id}`, { headers: { "x-passcode": passcode } }),
    create: (data, passcode) => request("/medications", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
    update: (id, data, passcode) => request(`/medications/${id}`, { method: "PUT", body: data, headers: { "x-passcode": passcode } }),
    remove: (id, passcode) => request(`/medications/${id}`, { method: "DELETE", headers: { "x-passcode": passcode } }),
    schedule: (id, data, passcode) => request(`/medications/${id}/schedule`, { method: "POST", body: data, headers: { "x-passcode": passcode } }),
  },
  doses: {
    list: (params, passcode) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/doses${qs ? `?${qs}` : ""}`, { headers: { "x-passcode": passcode } });
    },
    update: (id, data, passcode) => request(`/doses/${id}`, { method: "PATCH", body: data, headers: { "x-passcode": passcode } }),
    bulkTake: (data, passcode) => request("/doses/bulk-take", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
  },
  appointments: {
    list: (params, passcode) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/appointments${qs ? `?${qs}` : ""}`, { headers: { "x-passcode": passcode } });
    },
    create: (data, passcode) => request("/appointments", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
    update: (id, data, passcode) => request(`/appointments/${id}`, { method: "PUT", body: data, headers: { "x-passcode": passcode } }),
    remove: (id, passcode) => request(`/appointments/${id}`, { method: "DELETE", headers: { "x-passcode": passcode } }),
  },
  caregivers: {
    list: (passcode) => request("/caregivers", { headers: { "x-passcode": passcode } }),
    create: (data, passcode) => request("/caregivers", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
    update: (id, data, passcode) => request(`/caregivers/${id}`, { method: "PUT", body: data, headers: { "x-passcode": passcode } }),
    remove: (id, passcode) => request(`/caregivers/${id}`, { method: "DELETE", headers: { "x-passcode": passcode } }),
  },
  reminders: {
    run: (passcode) => request("/reminders/run", { method: "POST", headers: { "x-passcode": passcode } }),
    status: (passcode) => request("/reminders/status", { headers: { "x-passcode": passcode } }),
    logs: (passcode) => request("/reminders/email-logs", { headers: { "x-passcode": passcode } }),
    testEmail: (data, passcode) => request("/reminders/email/test", { method: "POST", body: data, headers: { "x-passcode": passcode } }),
  },
};

export default api;