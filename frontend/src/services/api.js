import axios from 'axios';
import authService from './authService';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Properties
export const getProperties = () => api.get('/properties').then(res => res.data);
export const getProperty = (id) => api.get(`/properties/${id}`).then(res => res.data);
export const createProperty = (data) => api.post('/properties', data).then(res => res.data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data).then(res => res.data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`).then(res => res.data);
export const getMyListings = () => api.get('/properties/my-listings').then(res => res.data);

// Reports
export const getReports = () => api.get('/reports').then(res => res.data);
export const createReport = (data) => api.post('/reports', data).then(res => res.data);
export const updateReport = (id, data) => api.patch(`/reports/${id}`, data).then(res => res.data);
export const deleteReport = (id) => api.delete(`/reports/${id}`).then(res => res.data);

// Analytics
export const getOverview = () => api.get('/analytics/overview').then(res => res.data);
export const getTrends = () => api.get('/analytics/trends').then(res => res.data);
export const getRiskDistribution = () => api.get('/analytics/risk-distribution').then(res => res.data);

// User Profile
export const getProfile = () => api.get('/auth/me').then(res => res.data); // Assuming auth/me returns profile

export default api;
