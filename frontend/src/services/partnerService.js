import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const partnerService = {
  // Submit partnership proposal
  submitProposal: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/partners`, data);
    return response.data;
  },

  // Get all proposals
  getProposals: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/partners`, { params });
    return response.data;
  },

  // Get proposal by ID
  getProposalById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/partners/${id}`);
    return response.data;
  },

  // Update proposal status
  updateProposalStatus: async (id, status) => {
    const response = await axios.patch(`${API_BASE_URL}/partners/${id}/status`, { status });
    return response.data;
  },

  // Delete proposal
  deleteProposal: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/partners/${id}`);
    return response.data;
  }
};

export default partnerService;
