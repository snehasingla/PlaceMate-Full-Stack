import api from './api';

const aiService = {
  analyzeResume: async (resumeText, jobDescription) => {
    const response = await api.post('/ai/resume-review', { resumeText, jobDescription });
    return response.data;
  }
};

export default aiService;
