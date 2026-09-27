import axios from 'axios';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes for instant responses


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
  withCredentials: true, // Enable credentials to send httpOnly cookies
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

    // Token is now sent via httpOnly cookie, no need for Authorization header
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
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Token is in httpOnly cookie, clear user data and redirect to login
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle network errors - retry with exponential backoff
    if (!error.response && error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('Network Error')) {
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }
      
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;
        const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(originalRequest);
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

// Clear cache function
api.clearCache = () => {
  cache.clear();
};

export default api;
