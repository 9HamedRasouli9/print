import apiClient from "./apiClient";

export const printJobsApi = {
  create(data) {
    return apiClient.post("/print-jobs", data);
  },

  getAll() {
    return apiClient.get("/print-jobs");
  },

  getById(id) {
    return apiClient.get(`/print-jobs/${id}`);
  },

  update(id, data) {
    return apiClient.put(`/print-jobs/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/print-jobs/${id}`);
  },
};
