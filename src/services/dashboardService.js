import { apiClient } from "./apiClient";

export const dashboardService = {
  getSummary() {
    return apiClient.get("/dashboard/summary");
  },

  getActivityLogs(limit = 10) {
    return apiClient.get(`/activity-logs?limit=${limit}`);
  },

  getNotifications(limit = 10) {
    return apiClient.get(`/notifications?limit=${limit}`);
  },
};