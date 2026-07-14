import { apiRequest } from './api';

const storyService = {
  // Transform story data to ensure slug exists
  transformStory: (story) => {
    if (!story) return story;
    // Preserve the slug from backend, only generate from title if slug doesn't exist
    const cleanTitle = story.title?.trim() || '';
    const slug = story.slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || String(story.id || story._id || story.story_id);
    return {
      ...story,
      slug,
      id: story.id || story._id || story.story_id,
    };
  },

  // Get all stories with optional filters
  getStories: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.author) params.append('author', filters.author);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.featured) params.append('featured', filters.featured);
    
    const response = await apiRequest.get(`/stories?${params.toString()}`);
    const stories = response.data?.data || response.data || [];
    const transformedStories = Array.isArray(stories) ? stories.map(storyService.transformStory) : stories;
    
    // Return full response object with pagination info
    return {
      data: transformedStories,
      totalPages: response.data?.totalPages || 1,
      total: response.data?.total || 0
    };
  },

  // Get story by ID
  getStoryById: async (id) => {
    const response = await apiRequest.get(`/stories/${id}`);
    const story = response.data?.data || response.data;
    return storyService.transformStory(story);
  },

  // Get story by slug
  getStoryBySlug: async (slug) => {
    if (!slug || slug === 'null' || slug === 'undefined') return null;
    const response = await apiRequest.get(`/stories/${slug}`);
    const story = response.data?.data || response.data;
    return storyService.transformStory(story);
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
