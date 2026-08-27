import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

// Request interceptor to attach Bearer token
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("arcl_admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Failed to retrieve token from storage:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / unauthorized access
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes("/auth/");
      const isAdminRoute = window.location.pathname.startsWith("/admin");

      if (!isAuthRoute && isAdminRoute && window.location.pathname !== "/admin/login") {
        localStorage.removeItem("arcl_admin_token");
        localStorage.removeItem("arcl_admin_user");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;