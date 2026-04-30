import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '';
// Remove trailing slash if present to avoid double slashes like //api
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const API = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
