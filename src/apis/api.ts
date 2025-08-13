import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // 👈 change to your backend URL
  withCredentials: true, // 👈 important: includes cookies
});

const API_BASE = "api/v1/users";

const forceLogout = async () => {
  try {
    await api.post(`${API_BASE}/logout`);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        console.log("attempt to refresh the token");
        // Attempt to refresh the token
        await api.post(`${API_BASE}/refresh-token`);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        await forceLogout();

        // Optionally: redirect to login or show message
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
