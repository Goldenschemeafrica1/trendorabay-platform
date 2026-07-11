import api from './api';

const podcastHostService = {
  getHosts: async (params = {}) => {
    const response = await api.get('/podcast-hosts', { params });
    return response;
  },

  getHostById: async (id) => {
    const response = await api.get(`/podcast-hosts/${id}`);
    return response;
  },

  getHostPodcasts: async (id) => {
    const response = await api.get(`/podcast-hosts/${id}/podcasts`);
    return response;
  },

  getFeaturedGuests: async (limit = 10) => {
    const response = await api.get('/podcast-hosts/featured/list', { params: { limit } });
    return response;
  },

  createHost: async (hostData) => {
    const response = await api.post('/podcast-hosts', hostData);
    return response;
  },

  updateHost: async (id, hostData) => {
    const response = await api.put(`/podcast-hosts/${id}`, hostData);
    return response;
  },

  deleteHost: async (id) => {
    const response = await api.delete(`/podcast-hosts/${id}`);
    return response;
  }
};

export default podcastHostService;
