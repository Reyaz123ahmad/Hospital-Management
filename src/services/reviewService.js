import api from './api'

const reviewService = {
  addReview: (data) => api.post('/reviews', data),
  getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
  getMyReviews: () => api.get('/reviews/my'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
}

export default reviewService