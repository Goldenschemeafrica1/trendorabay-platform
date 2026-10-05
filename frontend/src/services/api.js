import axios from 'axios';

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes for instant responses
const STALE_TTL = 5 * 60 * 1000; // 5 minutes for stale-while-revalidate

// Request deduplication - prevent duplicate in-flight requests
const pendingRequests = new Map();

const getCacheKey = (url, params) => {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
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
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000, // Increased timeout to 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials to send httpOnly cookies
});

console.log('API baseURL:', api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API request:', config.method.toUpperCase(), config.baseURL + config.url);

    // Check cache for GET requests with stale-while-revalidate
    if (config.method === 'get' && !config.skipCache) {
      const cacheKey = getCacheKey(config.url, config.params);
      const cached = getCachedData(cacheKey);

      if (cached) {
        console.log('Returning cached data for:', config.url);
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

      // Temporarily disable request deduplication in interceptor to debug
      // if (pendingRequests.has(cacheKey)) {
      //   console.log('Request deduplication: returning existing promise for:', config.url);
      //   return pendingRequests.get(cacheKey);
      // }
    }

    // Token is sent via httpOnly cookie in same-domain scenarios
    // For cross-domain scenarios, use Authorization header from localStorage
    const token = localStorage.getItem('authToken');
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
    console.log('API response received:', response.config.url, response.status);
    // Cache successful GET responses (skip if this was a background refresh)
    if (response.config.method === 'get' && response.status === 200 && !response.cached && !response.config.skipCache) {
      const cacheKey = getCacheKey(response.config.url, response.config.params);
      setCachedData(cacheKey, response.data);
    }
    return response;
  },
  async (error) => {
    console.error('API error:', error.config?.url, error.message, error.response?.status, error.code);
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

    console.log('apiRequest.get called with URL:', url, 'config:', config);

    // Temporarily disable request deduplication to debug hanging requests
    // if (pendingRequests.has(cacheKey)) {
    //   console.log('Request already in flight, returning existing promise');
    //   return pendingRequests.get(cacheKey);
    // }

    // Create and store the request
    const request = api.get(url, config)
      .finally(() => {
        pendingRequests.delete(cacheKey);
      })
      .catch(error => {
        console.error('Request failed for:', url, error);
        throw error;
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
