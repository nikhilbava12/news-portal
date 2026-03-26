import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/admin/login', { email, password });
    return response.data;
  },
};

// Dashboard Stats API
export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
};

// News APIs
export const newsAPI = {
  getAll: async (page = 1, limit = 10, category = '', status = '', search = '') => {
    const response = await apiClient.get(`/admin/news?page=${page}&limit=${limit}&category=${category}&status=${status}&search=${search}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/admin/news/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/admin/news', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/admin/news/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/admin/news/${id}`);
    return response.data;
  },
};

// Category APIs
export const categoryAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/categories');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/admin/categories', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

// Tags APIs
export const tagsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/tags');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/admin/tags', data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/admin/tags/${id}`);
    return response.data;
  },
};

// Messages APIs
export const messageAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/messages');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await apiClient.put(`/admin/messages/${id}`, { status: 'read' });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/admin/messages/${id}`);
    return response.data;
  },
};

// Pages APIs
export const pagesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/pages');
    return response.data;
  },
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/admin/pages?slug=${slug}`);
    return response.data;
  },
  update: async (data) => {
    const response = await apiClient.put('/admin/pages', data);
    return response.data;
  },
};

// Settings APIs
export const settingsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
  update: async (data) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data;
  },
};

export default apiClient;
