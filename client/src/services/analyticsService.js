import api from './api';

const analyticsService = {
  // Get unified analytics data for the dashboard
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getActivityAnalytics: async () => {
    const response = await api.get('/analytics/activity');
    return response.data;
  },
};

export default analyticsService;
