import api from './api';

const subjectService = {
  // Get all subject progress
  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  // Get progress for a single subject by name
  getSubjectProgress: async (subjectName) => {
    const response = await api.get('/subjects/progress', {
      params: { subject: subjectName },
    });
    return response.data;
  },

  // Create a new subject progress document for the user
  upsertSubject: async (subjectData) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  // Update a specific topic within a subject progress document
  updateTopic: async (id, topicData) => {
    const response = await api.put(`/subjects/${id}/topics`, topicData);
    return response.data;
  },

  // Update resources for a subject progress document
  updateResources: async (id, resourcesData) => {
    const response = await api.put(`/subjects/${id}/resources`, resourcesData);
    return response.data;
  },

  // Enable or disable tracking for a subject
  updateTracking: async (id, trackingData) => {
    const response = await api.put(`/subjects/${id}/tracking`, trackingData);
    return response.data;
  },

  // Delete subject tracker
  deleteSubject: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  }
};

export default subjectService;
