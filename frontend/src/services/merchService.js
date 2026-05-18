import { apiRequest } from './api';

const merchService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiRequest.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await apiRequest.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/products/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await apiRequest.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get product categories
  getCategories: async () => {
    const response = await apiRequest.get('/products/categories');
    return response.data;
  },

  // Get product sizes and colors
  getProductOptions: async (productId) => {
    const response = await apiRequest.get(`/products/${productId}/options`);
    return response.data;
  },

  // Check product availability
  checkAvailability: async (productId, size, color) => {
    const response = await apiRequest.get(`/products/${productId}/availability?size=${size}&color=${color}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await apiRequest.get(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  },
};

export default merchService;
