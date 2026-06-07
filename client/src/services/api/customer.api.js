import apiClient from "./apiClient";

export const customersApi = {
  create(data) {
    return apiClient.post("/customers", data);
  },

  getAll() {
    return apiClient.get("/customers");
  },

  update(id, data) {
    return apiClient.put(`/customers/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/customers/${id}`);
  },
};
