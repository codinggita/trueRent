import axios from 'axios';

const API_URL = '/api/auth/';

// Create an axios instance with credentials support for httpOnly cookies
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const signup = async (userData) => {
  const response = await api.post('signup', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('login', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('me');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post(`reset-password/${token}`, { password });
  return response.data;
};

// Expose api for direct use if needed
export default api;
