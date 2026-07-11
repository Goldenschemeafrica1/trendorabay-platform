import api from './api';

const contributorService = {
  getContributors: async (params = {}) => {
    const response = await api.get('/contributors', { params });
    return response;
  },

  getContributorById: async (id) => {
    const response = await api.get(`/contributors/${id}`);
    return response;
  },

  getContributorsByRole: async (role) => {
    const response = await api.get(`/contributors/role/${role}`);
    return response;
  },

  getActiveContributors: async (limit = 20) => {
    const response = await api.get('/contributors/active', { params: { limit } });
    return response;
  },

  searchContributors: async (query) => {
    const response = await api.get('/contributors/search', { params: { q: query } });
    return response;
  },

  createContributor: async (contributorData) => {
    const response = await api.post('/contributors', contributorData);
    return response;
  },

  updateContributor: async (id, contributorData) => {
    const response = await api.put(`/contributors/${id}`, contributorData);
    return response;
  },

  deleteContributor: async (id) => {
    const response = await api.delete(`/contributors/${id}`);
    return response;
  },

  getContributorArticles: async (id, limit = 10) => {
    const response = await api.get(`/contributors/${id}/articles`, { params: { limit } });
    return response;
  }
};

export default contributorService;
