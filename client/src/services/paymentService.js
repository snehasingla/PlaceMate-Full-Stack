import api from './api';

const paymentService = {
  createOrder: async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },

  cancelPremium: async () => {
    const response = await api.post('/payment/cancel');
    return response.data;
  }
};

export default paymentService;
