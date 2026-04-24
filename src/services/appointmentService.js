import api from './api'

const appointmentService = {
  bookAppointment: (data) => api.post('/appointments/book', data),
  getMyAppointments: (params = '') => api.get(`/appointments/my${params ? `?${params}` : ''}`),
  getUpcoming: () => api.get('/appointments/upcoming'),
  getPast: () => api.get('/appointments/past'),
  getAvailableSlots: (doctorId, date) => api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`),
  getById: (id) => api.get(`/appointments/${id}`),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
}

export default appointmentService