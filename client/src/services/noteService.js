import api from './api';

const noteService = {
  // Get all notes, optionally filtered by query params
  getNotes: async (params = {}) => {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Create a new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update a note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  }
};

export default noteService;
