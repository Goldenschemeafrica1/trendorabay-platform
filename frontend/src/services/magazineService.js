import { apiRequest } from './api';

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
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiRequest.get(`/magazines?${params.toString()}`);
    const magazines = response.data?.data || response.data || [];
    
    // Transform data if it exists
    if (magazines.length > 0) {
      return magazines.map(mag => magazineService.transformMagazine(mag));
    }
    
    return magazines;
  },

  // Get magazine by ID
  getMagazineById: async (id) => {
    const response = await apiRequest.get(`/magazines/${id}`);
    const magazine = response.data?.data || response.data;
    return magazineService.transformMagazine(magazine);
  },

  // Get magazines by category
  getMagazinesByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/magazines/category/${category}?page=${page}&limit=${limit}`);
    const magazines = response.data?.data || response.data || [];
    
    if (magazines.length > 0) {
      return magazines.map(mag => magazineService.transformMagazine(mag));
    }
    
    return magazines;
  },

  // Get featured magazines
  getFeaturedMagazines: async (limit = 6) => {
    const response = await apiRequest.get(`/magazines/featured?limit=${limit}`);
    const magazines = response.data?.data || response.data || [];
    
    if (magazines.length > 0) {
      return magazines.map(mag => magazineService.transformMagazine(mag));
    }
    
    return magazines;
  },

  // Search magazines
  searchMagazines: async (query, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/magazines/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    const magazines = response.data?.data || response.data || [];
    
    if (magazines.length > 0) {
      return magazines.map(mag => magazineService.transformMagazine(mag));
    }
    
    return magazines;
  },

  // Get magazine categories
  getCategories: async () => {
    const response = await apiRequest.get('/magazines/categories');
    return response.data;
  },

  // Get subscription options
  getSubscriptionOptions: async () => {
    const response = await apiRequest.get('/magazines/subscriptions');
    return response.data;
  },

  // Create subscription (guest checkout)
  createSubscription: async (subscriptionData) => {
    const response = await apiRequest.post('/magazines/subscriptions', subscriptionData);
    return response.data;
  },
};

export default magazineService;
