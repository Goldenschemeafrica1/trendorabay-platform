import axios from 'axios';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (url, params) => {
  return `${url}?${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for cross-origin requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Check cache for GET requests
    if (config.method === 'get') {
      const cacheKey = getCacheKey(config.url, config.params);
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        config.adapter = () => Promise.resolve({
          data: cachedData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
          cached: true
        });
      }
    }

    // Automatically add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.status === 200 && !response.cached) {
      const cacheKey = getCacheKey(response.config.url, response.config.params);
      setCachedData(cacheKey, response.data);
    }
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Clear expired tokens and redirect to login
      console.log('Token expired or invalid, clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;
