// frontend/src/api/apiClient.js
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true, // ← sends HTTP-only cookies on every request automatically
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// No need to attach Bearer token anymore — cookie is sent automatically
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = []; // queue requests that failed while refresh was in progress

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response, config } = error;

    const normalizedError = {
      message: "An unexpected error occurred. Please try again.",
      status: 0,
      errors: null,
    };

    if (response) {
      normalizedError.message =
        response.data?.message || normalizedError.message;
      normalizedError.status = response.status;
      normalizedError.errors = response.data?.errors || null;

      // 401 on any route EXCEPT /auth/refresh itself → try silent refresh
      if (
        response.status === 401 &&
        !config._retry &&
        config.url !== "/auth/refresh"
      ) {
        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(config)) // retry original request
            .catch((err) => Promise.reject(err));
        }

        config._retry = true;
        isRefreshing = true;

        try {
          await api.post("/auth/refresh"); // refresh token cookie is sent automatically
          processQueue(null);
          return api(config); // retry original request with new access token
        } catch (refreshError) {
          processQueue(refreshError);
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Refresh itself failed or other 401 — force logout
      if (response.status === 401 && config.url === "/auth/refresh") {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    } else if (error.code === "ECONNABORTED") {
      normalizedError.message =
        "Request timed out. Please check your connection.";
    } else if (!window.navigator.onLine) {
      normalizedError.message = "No internet connection.";
    }

    error.normalized = normalizedError;
    return Promise.reject(error);
  },
);

// ─── API Methods ──────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.patch("/auth/change-password", data),
};

export const lawyersAPI = {
  getAll: (params) => api.get("/lawyers", { params }),
  getById: (id) => api.get(`/lawyers/${id}`),
  getFeatured: () => api.get("/lawyers/featured"),
  getCategories: () => api.get("/lawyers/categories"),
};

export const resourcesAPI = {
  getAll: (params) => api.get("/resources", { params }),
  getBySlug: (slug) => api.get(`/resources/${slug}`),
  getLatest: () => api.get("/resources/latest"),
};

export const contactAPI = {
  submit: (data) => api.post("/contact", data),
};

export default api;
