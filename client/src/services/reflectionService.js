import api from './api';

const getReflection = async (date) => {
  const response = await api.get(`/reflections?date=${date}`);
  return response.data; // null if not yet saved for that date
};

const saveReflection = async (date, data) => {
  const response = await api.post('/reflections', { date, ...data });
  return response.data;
};

const reflectionService = { getReflection, saveReflection };
export default reflectionService;
