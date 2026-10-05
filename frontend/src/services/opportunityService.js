import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const opportunityService = {
  // Get all categories
  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/opportunities/categories`);
    return response.data;
  },

  // Get all opportunities
  getOpportunities: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/opportunities`, { params });
    return response.data;
  },

  // Get opportunity by ID
  getOpportunityById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/opportunities/${id}`);
    return response.data;
  },

  // Create opportunity
  createOpportunity: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/opportunities`, data);
    return response.data;
  },

  // Update opportunity
  updateOpportunity: async (id, data) => {
    const response = await axios.put(`${API_BASE_URL}/opportunities/${id}`, data);
    return response.data;
  },

  // Delete opportunity
  deleteOpportunity: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/opportunities/${id}`);
    return response.data;
  }
};

export default opportunityService;