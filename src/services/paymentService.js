import api from './api'

const paymentService = {
  createOrder: (appointmentId) => api.post('/payments/create-order', { appointmentId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentStatus: (appointmentId) => api.get(`/payments/status/${appointmentId}`),
  getPaymentHistory: () => api.get('/payments/history'),
  refundPayment: (appointmentId, reason) => api.post('/payments/refund', { appointmentId, reason }),
}

export default paymentService