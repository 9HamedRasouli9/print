import apiClient from "./apiClient";

export const transactionsApi = {
  create(data) {
    return apiClient.post("/transactions", data);
  },

  getAll(customerId) {
    return apiClient.get("/transactions", {
      params: customerId ? { customerId } : undefined,
    });
  },

  update(id, data) {
    return apiClient.put(`/transactions/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/transactions/${id}`);
  },
};
