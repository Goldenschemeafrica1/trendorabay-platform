import { apiRequest } from './api';
import createResourceService from './createResourceService';

const merchService = createResourceService('/products', {
  getProductOptions: async (productId) => {
    const response = await apiRequest.get(`/products/${productId}/options`);
    return response.data;
  },

  checkAvailability: async (productId, size, color) => {
    const response = await apiRequest.get(
      `/products/${productId}/availability?size=${size}&color=${color}`,
    );
    return response.data;
  },

  getRelatedProducts: async (productId, limit = 4) => {
    const response = await apiRequest.get(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  },
});

// Re-map generic names → legacy names so callers stay unchanged
merchService.getProducts          = merchService.getAll;
merchService.getProductById       = merchService.getById;
merchService.getProductsByCategory = merchService.getByCategory;
merchService.getFeaturedProducts  = (limit = 8) => merchService.getFeatured(limit);
merchService.searchProducts       = merchService.search;

export default merchService;
