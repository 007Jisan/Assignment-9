import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage or cookies
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pizzahub_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        const msg = String(error.response?.data?.message || '');
        if (
          msg.includes('No token provided') ||
          msg.includes('Token expired') ||
          msg.includes('Invalid token') ||
          msg.includes('session invalid')
        ) {
          localStorage.removeItem('pizzahub_token');
          localStorage.removeItem('pizzahub_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
