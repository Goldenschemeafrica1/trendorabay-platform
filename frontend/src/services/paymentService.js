import { apiRequest } from './api';

const paymentService = {
  // Process payment (guest checkout)
  processPayment: async (paymentData) => {
    const response = await apiRequest.post('/payments/process', paymentData);
    return response.data;
  },

  // Create payment intent
  createPaymentIntent: async (amount, currency = 'USD') => {
    const response = await apiRequest.post('/payments/create-intent', { amount, currency });
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    const response = await apiRequest.post('/payments/confirm', { paymentIntentId, paymentMethodId });
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await apiRequest.get('/payments/methods');
    return response.data;
  },

  // Validate payment data
  validatePaymentData: async (paymentData) => {
    const response = await apiRequest.post('/payments/validate', paymentData);
    return response.data;
  },

  // Refund payment
  refundPayment: async (paymentId, amount) => {
    const response = await apiRequest.post('/payments/refund', { paymentId, amount });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await apiRequest.get(`/payments/${paymentId}/status`);
    return response.data;
  },

  // Calculate tax
  calculateTax: async (amount, state, country) => {
    const response = await apiRequest.post('/payments/calculate-tax', { amount, state, country });
    return response.data;
  },

  // Create customer (guest)
  createGuestCustomer: async (customerData) => {
    const response = await apiRequest.post('/payments/guest-customer', customerData);
    return response.data;
  },
};

export default paymentService;
