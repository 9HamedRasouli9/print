import apiClient from "./apiClient";

export const authApi = {
  login(data) {
    return apiClient.post("/auth/login", data);
  },

  register(data) {
    return apiClient.post("/auth/register", data);
  },

  logout() {
    return apiClient.post("/auth/logout");
  },

  getMe() {
    return apiClient.get("/auth/me");
  },
};
