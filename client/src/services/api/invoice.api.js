import apiClient from "./apiClient";

export const invoicesApi = {
  create(data) {
    return apiClient.post("/invoices", data);
  },

  getAll() {
    return apiClient.get("/invoices");
  },

  getById(id) {
    return apiClient.get(`/invoices/${id}`);
  },

  update(id, data) {
    return apiClient.put(`/invoices/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/invoices/${id}`);
  },
};
