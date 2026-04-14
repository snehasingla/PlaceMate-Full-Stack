import api from './api';

// Get planner tasks for a date, optionally excluding revisions
const getTasks = async (date, isRevision) => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (isRevision === false) params.append('isRevision', 'false');
  if (isRevision === true) params.append('isRevision', 'true');
  const response = await api.get(`/tasks?${params.toString()}`);
  return response.data;
};

const getRevisions = async () => {
  const response = await api.get('/tasks?isRevision=true');
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (taskId, updatedData) => {
  const response = await api.put(`/tasks/${taskId}`, updatedData);
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

const taskService = { getTasks, getRevisions, createTask, updateTask, deleteTask };
export default taskService;
