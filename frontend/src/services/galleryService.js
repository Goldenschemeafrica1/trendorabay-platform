import { apiRequest } from './api';

const galleryService = {
  // Get all gallery images with optional filters
  getGalleryImages: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.featured) params.append('featured', filters.featured);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await apiRequest.get(`/gallery?${params.toString()}`);
    const images = response.data?.data || response.data || [];
    
    // Return full response object with pagination info
    return {
      data: images,
      totalPages: response.data?.totalPages || 1,
      total: response.data?.total || 0
    };
  },

  // Get gallery image by ID
  getGalleryImageById: async (id) => {
    const response = await apiRequest.get(`/gallery/${id}`);
    const image = response.data?.data || response.data;
    return image;
  },

  // Create gallery image (admin only)
  createGalleryImage: async (imageData) => {
    const response = await apiRequest.post('/gallery', imageData);
    return response.data;
  },

  // Update gallery image (admin only)
  updateGalleryImage: async (id, imageData) => {
    const response = await apiRequest.put(`/gallery/${id}`, imageData);
    return response.data;
  },

  // Delete gallery image (admin only)
  deleteGalleryImage: async (id) => {
    const response = await apiRequest.delete(`/gallery/${id}`);
    return response.data;
  },

  // Like a gallery image
  likeGalleryImage: async (id) => {
    const response = await apiRequest.post(`/gallery/${id}/like`);
    return response.data;
  },

  // Get likes count for a gallery image
  getGalleryImageLikes: async (id) => {
    const response = await apiRequest.get(`/gallery/${id}/likes`);
    return response.data;
  },

  // Create gallery likes table
  createGalleryLikesTable: async () => {
    const response = await apiRequest.post('/gallery/create-likes-table');
    return response.data;
  },
};

export default galleryService;
