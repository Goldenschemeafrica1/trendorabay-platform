import { apiRequest } from './api';

/**
 * Factory that builds a standard CRUD service for a given API resource.
 *
 *   const magazineService = createResourceService('/magazines');
 *
 * Every service exposes: getAll, getById, getByCategory, getFeatured,
 * search, getCategories — the exact same shape the old hand-written
 * services had.  Resource-specific methods can be merged in via `extras`.
 */
const createResourceService = (basePath, extras = {}) => {
  const service = {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiRequest.get(`${basePath}?${params.toString()}`);
      return response.data;
    },

    getById: async (id) => {
      const response = await apiRequest.get(`${basePath}/${id}`);
      return response.data;
    },

    getByCategory: async (category, page = 1, limit = 12) => {
      const response = await apiRequest.get(
        `${basePath}/category/${category}?page=${page}&limit=${limit}`,
      );
      return response.data;
    },

    getFeatured: async (limit = 6) => {
      const response = await apiRequest.get(`${basePath}/featured?limit=${limit}`);
      return response.data;
    },

    search: async (query, page = 1, limit = 12) => {
      const response = await apiRequest.get(
        `${basePath}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      return response.data;
    },

    getCategories: async () => {
      const response = await apiRequest.get(`${basePath}/categories`);
      return response.data;
    },
  };

  return { ...service, ...extras };
};

export default createResourceService;
