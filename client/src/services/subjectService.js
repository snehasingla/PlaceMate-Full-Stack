import api from './api';

const subjectService = {
  // Get all subject progress
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  // Create or update progress for a specific subject
  upsertSubject: async (subjectData) => {
    // Assuming POST to /subjects creates or updates based on the controller logic
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  // Update a specific node/topic within a subject
  updateTopic: async (id, topicData) => {
    const response = await api.put(`/subjects/${id}`, topicData);
    return response.data;
  },
  
  // Delete subject tracker
  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  }
};

export default subjectService;
