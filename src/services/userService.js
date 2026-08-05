import { apiClient } from "./apiClient";

export const userService = {
  getUsers(params = {}) {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")).toString();
    return apiClient.get(`/users${query ? `?${query}` : ""}`);
  },
};
