import api from './api';

const getTasks = async (date) => {
  let url = '/tasks';
  if (date) {
    url += `?date=${date}`;
  }
  const response = await api.get(url);
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

const taskService = {
  getTasks,
  getRevisions,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
