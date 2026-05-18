import { apiRequest } from './api';

const storyService = {
  // Get all stories with optional filters
  getStories: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    
    const response = await apiRequest.get(`/stories?${params.toString()}`);
    return response.data;
  },

  // Get story by ID
  getStoryById: async (id) => {
    const response = await apiRequest.get(`/stories/${id}`);
    return response.data;
  },

  // Get featured story
  getFeaturedStory: async () => {
    const response = await apiRequest.get('/stories/featured');
    return response.data;
  },

  // Get recent stories
  getRecentStories: async (limit = 10) => {
    const response = await apiRequest.get(`/stories/recent?limit=${limit}`);
    return response.data;
  },

  // Get stories by author
  getStoriesByAuthor: async (authorId, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/stories/author/${authorId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search stories
  searchStories: async (query, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/stories/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get story categories
  getCategories: async () => {
    const response = await apiRequest.get('/stories/categories');
    return response.data;
  },

  // Get authors
  getAuthors: async (page = 1, limit = 20) => {
    const response = await apiRequest.get(`/stories/authors?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get author by ID
  getAuthorById: async (authorId) => {
    const response = await apiRequest.get(`/stories/authors/${authorId}`);
    return response.data;
  },

  // Get popular stories
  getPopularStories: async (limit = 6) => {
    const response = await apiRequest.get(`/stories/popular?limit=${limit}`);
    return response.data;
  },

  // Get stories by category
  getStoriesByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiRequest.get(`/stories/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default storyService;
