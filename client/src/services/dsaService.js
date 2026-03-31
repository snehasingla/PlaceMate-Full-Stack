import api from './api';

const dsaService = {
  // Get all DSA problems for the user
  getProblems: async () => {
    const response = await api.get('/dsa');
    return response.data;
  },

  // Add a new DSA problem
  createProblem: async (problemData) => {
    const response = await api.post('/dsa', problemData);
    return response.data;
  },

  // Update a DSA problem
  updateProblem: async (id, problemData) => {
    const response = await api.put(`/dsa/${id}`, problemData);
    return response.data;
  },

  // Delete a DSA problem
  deleteProblem: async (id) => {
    const response = await api.delete(`/dsa/${id}`);
    return response.data;
  }
};

export default dsaService;
