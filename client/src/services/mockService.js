import api from './api';

const mockService = {
  // Get all mock interview sessions
  getSessions: async () => {
    const response = await api.get('/mock');
    return response.data;
  },

  // Create a new mock session
  createSession: async (sessionData) => {
    const response = await api.post('/mock', sessionData);
    return response.data;
  },

  // Update a mock session
  updateSession: async (id, sessionData) => {
    const response = await api.put(`/mock/${id}`, sessionData);
    return response.data;
  },

  // Delete a mock session
  deleteSession: async (id) => {
    const response = await api.delete(`/mock/${id}`);
    return response.data;
  }
};

export default mockService;
