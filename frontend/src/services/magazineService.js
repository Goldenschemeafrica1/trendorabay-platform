import { apiRequest } from './api';

const magazineService = {
  // Get all magazines with optional filters
  getMagazines: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiRequest.get(`/magazines?${params.toString()}`);
    return response.data;
  },

  // Get magazine by ID
  getMagazineById: async (id) => {
    const response = await apiRequest.get(`/magazines/${id}`);
    return response.data;
  },

  // Get magazines by category
  getMagazinesByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/magazines/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get featured magazines
  getFeaturedMagazines: async (limit = 6) => {
    const response = await apiRequest.get(`/magazines/featured?limit=${limit}`);
    return response.data;
  },

  // Search magazines
  searchMagazines: async (query, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/magazines/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
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
