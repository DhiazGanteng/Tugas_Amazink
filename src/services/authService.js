import { apiClient } from "./apiClient";

export const authService = {
  async register({ name, email, password, role = "USER" }) {
    return apiClient.post("/auth/register", { name, email, password, role });
  },

  async login(email, password) {
    const data = await apiClient.post("/auth/login", { email, password });

    if (data?.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }

    return data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout", {});
    } catch {
      // tetap bersihkan sesi lokal walau request logout gagal
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },

  async getMe() {
    const user = await apiClient.get("/auth/me");
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  getStoredUser() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};
