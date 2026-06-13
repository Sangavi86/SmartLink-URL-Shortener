import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartlink_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartlink_token');
      localStorage.removeItem('smartlink_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth Endpoints ──────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ── URL Endpoints ───────────────────────────────
export const urlAPI = {
  create: (data) => api.post('/urls', data),
  getAll: () => api.get('/urls'),
  update: (id, data) => api.put(`/urls/${id}`, data),
  remove: (id) => api.delete(`/urls/${id}`),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/urls/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ── Analytics Endpoints ─────────────────────────
export const analyticsAPI = {
  getPrivate: (shortCode) => api.get(`/analytics/${shortCode}`),
};

// ── Public Stats Endpoint ───────────────────────
export const publicAPI = {
  getStats: (shortCode) => api.get(`/public/${shortCode}`),
};

export default api;
