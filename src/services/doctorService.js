import api from './api'

const doctorService = {
  // Public
  getDoctors: (params = '') => api.get(`/doctors${params ? `?${params}` : ''}`),
  getTopRated: () => api.get('/doctors/top-rated'),
  getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailability: (id, date) => api.get(`/doctors/${id}/availability?date=${date}`),
  
  // Doctor only
  getMyAppointments: (params = '') => api.get(`/doctors/appointments/my${params ? `?${params}` : ''}`),
  getTodayAppointments: () => api.get('/doctors/appointments/today'),
  updateAppointmentStatus: (id, status) => api.put(`/doctors/appointments/${id}/status`, { status }),
  addPrescription: (data) => api.post('/doctors/prescriptions', data),
  getPatientHistory: (patientId) => api.get(`/doctors/patients/${patientId}/history`),
  updateAvailability: (id, data) => api.put(`/doctors/${id}/availability`, data),
  updateProfile: (id, data) => api.put(`/doctors/${id}/profile`, data),
}

export default doctorService