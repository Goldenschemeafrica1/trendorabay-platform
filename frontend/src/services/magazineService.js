import { apiRequest } from './api';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCached = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const magazineService = {
  // Transform magazine data from backend to frontend format
  transformMagazine: (mag) => {
    if (!mag) return mag;
    // Backend already transforms URLs, so use them directly if they exist
    let previewPages = null;
    if (mag.previewPages || mag.preview_pages) {
      const previewData = mag.preview_pages || mag.previewPages;
      // Only try to parse if it's not already an object and doesn't look like a file path
      if (typeof previewData === 'object') {
        previewPages = previewData;
      } else if (typeof previewData === 'string' && !previewData.startsWith('/uploads/')) {
        try {
          previewPages = JSON.parse(previewData);
        } catch (e) {
          previewPages = null;
        }
      }
    }
    
    return {
      ...mag,
      coverImage: mag.coverImage || mag.cover_image_url || '/music.jpeg',
      previewPages
    };
  },

  // Get all magazines with optional filters
  getMagazines: async (filters = {}) => {
    const cacheKey = `magazines_${JSON.stringify(filters)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await apiRequest.get(`/magazines?${params.toString()}`);
    const magazines = response.data?.data || response.data || [];

    // Transform data if it exists
    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Get magazine by ID
  getMagazineById: async (id) => {
    const cacheKey = `magazine_${id}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/${id}`);
    const magazine = response.data?.data || response.data;
    const result = magazineService.transformMagazine(magazine);

    setCached(cacheKey, result);
    return result;
  },

  // Get magazine by slug
  getMagazineBySlug: async (slug) => {
    const cacheKey = `magazine_${slug}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/${slug}`);
    const magazine = response.data?.data || response.data;
    const result = magazineService.transformMagazine(magazine);

    setCached(cacheKey, result);
    return result;
  },

  // Get magazines by category
  getMagazinesByCategory: async (category, page = 1, limit = 12) => {
    const cacheKey = `magazines_category_${category}_${page}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/category/${category}?page=${page}&limit=${limit}`);
    const magazines = response.data?.data || response.data || [];

    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Get featured magazines
  getFeaturedMagazines: async (limit = 6) => {
    const cacheKey = `magazines_featured_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/featured?limit=${limit}`);
    const magazines = response.data?.data || response.data || [];

    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Search magazines
  searchMagazines: async (query, page = 1, limit = 12) => {
    const cacheKey = `magazines_search_${query}_${page}_${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get(`/magazines/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    const magazines = response.data?.data || response.data || [];

    const result = magazines.length > 0
      ? magazines.map(mag => magazineService.transformMagazine(mag))
      : magazines;

    setCached(cacheKey, result);
    return result;
  },

  // Get magazine categories
  getCategories: async () => {
    const cacheKey = 'magazines_categories';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get('/magazines/categories');
    setCached(cacheKey, response.data);
    return response.data;
  },

  // Get subscription options
  getSubscriptionOptions: async () => {
    const cacheKey = 'magazines_subscriptions';
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const response = await apiRequest.get('/magazines/subscriptions');
    setCached(cacheKey, response.data);
    return response.data;
  },

  // Create subscription (guest checkout)
  createSubscription: async (subscriptionData) => {
    const response = await apiRequest.post('/magazines/subscriptions', subscriptionData);
    return response.data;
  },
};

export default magazineService;
