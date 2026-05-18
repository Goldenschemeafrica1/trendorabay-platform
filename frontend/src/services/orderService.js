import { apiRequest } from './api';

const orderService = {
  // Create order (guest checkout)
  createOrder: async (orderData) => {
    const response = await apiRequest.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID (guest access with email)
  getOrderById: async (orderId, email) => {
    const response = await apiRequest.get(`/orders/${orderId}?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Get order status
  getOrderStatus: async (orderId, email) => {
    const response = await apiRequest.get(`/orders/${orderId}/status?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Calculate shipping cost
  calculateShipping: async (shippingData) => {
    const response = await apiRequest.post('/orders/shipping-calculate', shippingData);
    return response.data;
  },

  // Apply discount code
  applyDiscountCode: async (code, cartTotal) => {
    const response = await apiRequest.post('/orders/discount', { code, cartTotal });
    return response.data;
  },

  // Validate checkout data
  validateCheckout: async (checkoutData) => {
    const response = await apiRequest.post('/orders/validate', checkoutData);
    return response.data;
  },

  // Get order confirmation
  getOrderConfirmation: async (orderId, email) => {
    const response = await apiRequest.get(`/orders/${orderId}/confirmation?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Resend order confirmation
  resendConfirmation: async (orderId, email) => {
    const response = await apiRequest.post(`/orders/${orderId}/resend-confirmation`, { email });
    return response.data;
  },

  // Track order
  trackOrder: async (trackingNumber) => {
    const response = await apiRequest.get(`/orders/track/${trackingNumber}`);
    return response.data;
  },
};

export default orderService;
