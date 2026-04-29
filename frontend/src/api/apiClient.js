import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — centralized error normalization
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    // Build a normalized error object
    const normalizedError = {
      message: 'An unexpected error occurred. Please try again.',
      status: 0,
      errors: null,
    };

    if (response) {
      normalizedError.message = response.data?.message || normalizedError.message;
      normalizedError.status = response.status;
      normalizedError.errors = response.data?.errors || null;

      // Handle 401 — auto logout
      if (response.status === 401) {
        useAuthStore.getState().logout();
      }
    } else if (error.code === 'ECONNABORTED') {
      normalizedError.message = 'Request timed out. Please check your connection.';
    } else if (!window.navigator.onLine) {
      normalizedError.message = 'No internet connection.';
    }

    // Attach normalized error so UI can display it
    error.normalized = normalizedError;
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const lawyersAPI = {
  getAll: (params) => api.get('/lawyers', { params }),
  getById: (id) => api.get(`/lawyers/${id}`),
  getFeatured: () => api.get('/lawyers/featured'),
  getCategories: () => api.get('/lawyers/categories'),
};

export const resourcesAPI = {
  getAll: (params) => api.get('/resources', { params }),
  getBySlug: (slug) => api.get(`/resources/${slug}`),
  getLatest: () => api.get('/resources/latest'),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export default api;
