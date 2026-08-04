/*
 * api.js
 * ------------------------------------------------------------------
 * Thin fetch wrapper around the OneCaroyroyan Express/MySQL backend.
 * Handles the JWT Authorization header, JSON parsing, and turning
 * non-2xx responses into thrown Errors with a readable message.
 *
 * Set VITE_API_URL in a .env file at the project root to point this
 * at your backend (defaults to http://localhost:5000/api for local
 * dev — see backend/SETUP_GUIDE.md).
 * ------------------------------------------------------------------
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "oc_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, params } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. network error page) — fall through with data = null
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.detail = data;
    throw err;
  }

  return data;
}

/* ---------------------------- Auth ---------------------------- */
export const authApi = {
  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),
  me: () => request("/auth/me"),
  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } }),
};

/* -------------------------- Residents -------------------------- */
export const residentsApi = {
  list: (params) => request("/residents", { params }),
  get: (id) => request(`/residents/${id}`),
  create: (payload) => request("/residents", { method: "POST", body: payload }),
  update: (id, payload) => request(`/residents/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/residents/${id}`, { method: "DELETE" }),
};

/* ------------------------- Certificates ------------------------- */
export const certificatesApi = {
  list: (params) => request("/certificates", { params }),
  get: (id) => request(`/certificates/${id}`),
  create: (payload) => request("/certificates", { method: "POST", body: payload }),
  verify: (id) => request(`/certificates/${id}/verify`, { method: "PATCH" }),
  issue: (id) => request(`/certificates/${id}/issue`, { method: "PATCH" }),
  cancel: (id) => request(`/certificates/${id}/cancel`, { method: "PATCH" }),
};

/* --------------------------- Payments --------------------------- */
export const paymentsApi = {
  list: (params) => request("/payments", { params }),
  create: (payload) => request("/payments", { method: "POST", body: payload }),
  validate: (id) => request(`/payments/${id}/validate`, { method: "PATCH" }),
};

/* -------------------------- Complaints -------------------------- */
export const complaintsApi = {
  list: (params) => request("/complaints", { params }),
  create: (payload) => request("/complaints", { method: "POST", body: payload }),
  updateStatus: (id, status) => request(`/complaints/${id}/status`, { method: "PATCH", body: { status } }),
};

/* ------------------------ Correspondence ------------------------ */
export const correspondenceApi = {
  list: (params) => request("/correspondence", { params }),
  create: (payload) => request("/correspondence", { method: "POST", body: payload }),
  updateStatus: (id, status) => request(`/correspondence/${id}/status`, { method: "PATCH", body: { status } }),
};

/* ---------------------------- Settings --------------------------- */
export const settingsApi = {
  getBarangayInfo: () => request("/settings/barangay-info"),
  updateBarangayInfo: (payload) => request("/settings/barangay-info", { method: "PUT", body: payload }),

  getOfficials: () => request("/settings/officials"),
  updateOfficial: (key, fullName) => request(`/settings/officials/${key}`, { method: "PUT", body: { fullName } }),

  getSignatories: () => request("/settings/signatories"),
  updateSignatory: (key, value) => request(`/settings/signatories/${key}`, { method: "PUT", body: { value } }),

  getFees: () => request("/settings/fees"),
  updateFee: (id, fee, indigentRate) =>
    request(`/settings/fees/${id}`, { method: "PUT", body: { fee, indigentRate } }),

  getCertTemplates: () => request("/settings/cert-templates"),
  updateCertTemplate: (id, validity) =>
    request(`/settings/cert-templates/${id}`, { method: "PUT", body: { validity } }),

  getNumbering: () => request("/settings/numbering"),
  updateNumbering: (key, payload) => request(`/settings/numbering/${key}`, { method: "PUT", body: payload }),

  getUsers: () => request("/settings/users"),
  createUser: (payload) => request("/settings/users", { method: "POST", body: payload }),
  setUserStatus: (id, status) => request(`/settings/users/${id}/status`, { method: "PATCH", body: { status } }),
  resetUserPassword: (id) => request(`/settings/users/${id}/reset-password`, { method: "POST" }),

  getAuditLogs: (limit) => request("/settings/audit-logs", { params: { limit } }),
  getLastBackup: () => request("/settings/backup/last"),
  triggerBackup: () => request("/settings/backup", { method: "POST" }),
};

/* --------------------------- Dashboard --------------------------- */
export const dashboardApi = {
  admin: () => request("/dashboard/admin"),
  secretary: () => request("/dashboard/secretary"),
  accounting: () => request("/dashboard/accounting"),
  treasurer: () => request("/dashboard/treasurer"),
  captain: () => request("/dashboard/captain"),
  monthlyTrend: () => request("/dashboard/monthly-trend"),
};
