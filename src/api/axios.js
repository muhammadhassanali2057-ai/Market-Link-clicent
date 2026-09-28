import axios from "axios";

// Relative baseURL - Vite's dev proxy (see vite.config.js) forwards
// /api to the Express backend, and the same relative path works
// unchanged once built and served behind any reverse proxy in prod.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send the httpOnly auth cookie
  timeout: 15000, // 15s timeout safety fallback
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token if present in localStorage (fallback for third-party cookie restrictions)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ml_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global Response Interceptor for handling expired session / 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid or expired token
      localStorage.removeItem("ml_token");
    }
    return Promise.reject(error);
  }
);

export default api;