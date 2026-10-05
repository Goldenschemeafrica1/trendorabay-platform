import api from './api';

const writeApplicationService = {
  // Submit a writer application
  submitApplication: async (applicationData) => {
    const response = await api.post('/write-applications', applicationData);
    return response.data;
  },

  // Get all applications (admin)
  getAllApplications: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/write-applications', { params });
    return response.data;
  },

  // Get application by ID (admin)
  getApplicationById: async (id) => {
    const response = await api.get(`/write-applications/${id}`);
    return response.data;
  },

  // Update application status (admin)
  updateApplicationStatus: async (id, status) => {
    const response = await api.patch(`/write-applications/${id}/status`, { status });
    return response.data;
  },

  // Delete application (admin)
  deleteApplication: async (id) => {
    const response = await api.delete(`/write-applications/${id}`);
    return response.data;
  }
};

export default writeApplicationService;
