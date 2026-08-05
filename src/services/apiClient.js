// Base URL backend FastAPI kamu.
// Bikin file .env di root project lalu isi:
// VITE_API_BASE_URL=http://localhost:8000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(`Tidak dapat terhubung ke server API (${BASE_URL}). Pastikan backend sedang berjalan dan VITE_API_BASE_URL benar.`);
  }

  // 401 -> token expired / belum login, tendang ke halaman login
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  if (response.status === 204) return null;

  let data;
  try {
    data = await response.json();
  } catch {
    // Respons kosong atau bukan JSON tidak perlu diparsing.
  }

  if (!response.ok) {
    let message = "Terjadi kesalahan pada server";

    if (data?.detail) {
      message = Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data.detail;
    }

    throw new Error(message);
  }

  return data;
}

export const apiClient = {
  get: (endpoint) => request(endpoint, { method: "GET" }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export { BASE_URL, getToken };
