import axios from 'axios';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for instant responses
const STALE_TTL = 5 * 60 * 1000; // 5 minutes for stale-while-revalidate

// Request deduplication - prevent duplicate in-flight requests
const pendingRequests = new Map();

const getCacheKey = (url, params) => {
  return `${url}?${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      data: cached.data,
      isStale: Date.now() - cached.timestamp > STALE_TTL
    };
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
    // Check cache for GET requests with stale-while-revalidate
    if (config.method === 'get') {
      const cacheKey = getCacheKey(config.url, config.params);
      const cached = getCachedData(cacheKey);
      
      if (cached) {
        // If data is stale, return it immediately but fetch fresh data in background
        if (cached.isStale) {
          // Trigger background refresh without blocking
          api.get(config.url, { ...config, skipCache: true }).then(response => {
            setCachedData(cacheKey, response.data);
          }).catch(() => {
            // Silent fail - user already has stale data
          });
        }
        
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
          cached: true,
          isStale: cached.isStale
        });
        return config;
      }

      // Request deduplication - if same request is in flight, return the existing promise
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
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
    // Cache successful GET responses (skip if this was a background refresh)
    if (response.config.method === 'get' && response.status === 200 && !response.cached && !response.config.skipCache) {
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

// Helper functions for common HTTP methods with request deduplication
export const apiRequest = {
  get: (url, config = {}) => {
    const cacheKey = getCacheKey(url, config.params);
    
    // Check if request is already in flight
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }
    
    // Create and store the request
    const request = api.get(url, config).finally(() => {
      pendingRequests.delete(cacheKey);
    });
    pendingRequests.set(cacheKey, request);
    
    return request;
  },
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
