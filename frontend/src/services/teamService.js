import api from './api';

const teamService = {
  getTeamMembers: async (params = {}) => {
    const response = await api.get('/team', { params });
    return response;
  },

  getTeamMemberById: async (id) => {
    const response = await api.get(`/team/${id}`);
    return response;
  },

  getActiveTeamMembers: async (limit = 20) => {
    const response = await api.get('/team/active', { params: { limit } });
    return response;
  },

  getTeamMembersByRole: async (role) => {
    const response = await api.get(`/team/role/${role}`);
    return response;
  },

  createTeamMember: async (teamMemberData) => {
    const response = await api.post('/team', teamMemberData);
    return response;
  },

  updateTeamMember: async (id, teamMemberData) => {
    const response = await api.put(`/team/${id}`, teamMemberData);
    return response;
  },

  deleteTeamMember: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response;
  }
};

export default teamService;
