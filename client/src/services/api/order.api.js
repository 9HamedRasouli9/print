import apiClient from "./apiClient";

export const ordersApi = {
  create(data) {
    return apiClient.post("/orders", data);
  },

  getAll() {
    return apiClient.get("/orders");
  },

  getById(id) {
    return apiClient.get(`/orders/${id}`);
  },

  update(id, data) {
    return apiClient.put(`/orders/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/orders/${id}`);
  },
};
