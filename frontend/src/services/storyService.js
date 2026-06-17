import { apiRequest } from './api';
import createResourceService from './createResourceService';

const storyService = createResourceService('/stories', {
  getFeaturedStory: async () => {
    const response = await apiRequest.get('/stories/featured');
    return response.data;
  },

  getRecentStories: async (limit = 10) => {
    const response = await apiRequest.get(`/stories/recent?limit=${limit}`);
    return response.data;
  },

  getStoriesByAuthor: async (authorId, page = 1, limit = 12) => {
    const response = await apiRequest.get(
      `/stories/author/${authorId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getAuthors: async (page = 1, limit = 20) => {
    const response = await apiRequest.get(`/stories/authors?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAuthorById: async (authorId) => {
    const response = await apiRequest.get(`/stories/authors/${authorId}`);
    return response.data;
  },

  getPopularStories: async (limit = 6) => {
    const response = await apiRequest.get(`/stories/popular?limit=${limit}`);
    return response.data;
  },

  getStoriesByCategory: async (category, page = 1, limit = 12) => {
    const response = await apiRequest.get(
      `/stories/category/${category}?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
});

// Re-map generic names → legacy names so callers stay unchanged
storyService.getStories    = storyService.getAll;
storyService.getStoryById  = storyService.getById;
storyService.searchStories = storyService.search;

export default storyService;
