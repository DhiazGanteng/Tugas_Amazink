import { apiClient } from "./apiClient";

export const ticketService = {
  getTickets(params = {}) {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const query = new URLSearchParams(cleaned).toString();
    return apiClient.get(`/tickets${query ? `?${query}` : ""}`);
  },

  getTicket(id) {
    return apiClient.get(`/tickets/${id}`);
  },

  createTicket(payload) {
    // payload: { type, title, description, priority, module }
    return apiClient.post("/tickets", payload);
  },

  updateTicket(id, payload) {
    return apiClient.patch(`/tickets/${id}`, payload);
  },

  updateStatus(id, status) {
    return apiClient.patch(`/tickets/${id}/status`, { status });
  },

  assignTicket(id, picId) {
    return apiClient.patch(`/tickets/${id}/assign`, { pic_id: picId });
  },

  updatePriority(id, priority) {
    return apiClient.patch(`/tickets/${id}/priority`, { priority });
  },

  getComments(ticketId) {
    return apiClient.get(`/tickets/${ticketId}/comments`);
  },

  addComment(ticketId, content) {
    return apiClient.post(`/tickets/${ticketId}/comments`, { content });
  },

  updateComment(commentId, content) {
    return apiClient.patch(`/comments/${commentId}`, { content });
  },

  deleteComment(commentId) {
    return apiClient.delete(`/comments/${commentId}`);
  },

  getAttachments(ticketId) {
    return apiClient.get(`/tickets/${ticketId}/attachments`);
  },

  uploadAttachment(ticketId, file) {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post(`/tickets/${ticketId}/attachments`, formData);
  },
};