import api from './api';

const companyService = {
  // Get all company applications
  getApplications: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  // Add a new application
  createApplication: async (applicationData) => {
    const response = await api.post('/companies', applicationData);
    return response.data;
  },

  // Update an application
  updateApplication: async (id, applicationData) => {
    const response = await api.put(`/companies/${id}`, applicationData);
    return response.data;
  },

  // Delete an application
  deleteApplication: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  }
};

export default companyService;
