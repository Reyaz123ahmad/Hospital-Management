// import api from './api'

// const doctorService = {
//   // Public
//   getDoctors: (params = '') => api.get(`/doctors${params ? `?${params}` : ''}`),
//   getTopRated: () => api.get('/doctors/top-rated'),
//   getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
//   getById: (id) => api.get(`/doctors/${id}`),
//   getAvailability: (id, date) => api.get(`/doctors/${id}/availability?date=${date}`),
  
//   // Doctor only
//   getMyAppointments: (params = '') => api.get(`/doctors/appointments/my${params ? `?${params}` : ''}`),
//   getTodayAppointments: () => api.get('/doctors/appointments/today'),
//   updateAppointmentStatus: (id, status) => api.put(`/doctors/appointments/${id}/status`, { status }),
//   addPrescription: (data) => api.post('/doctors/prescriptions', data),
//   getPatientHistory: (patientId) => api.get(`/doctors/patients/${patientId}/history`),
//   updateAvailability: (id, data) => api.put(`/doctors/${id}/availability`, data),
//   updateProfile: (id, data) => api.put(`/doctors/${id}/profile`, data),

//   // ==================== LAB TESTS (Doctor) ====================
//   createLabTest: (data) => api.post('/doctor/lab-tests', data),
//   getMyLabTests: () => api.get('/doctor/lab-tests'),
//   getLabReport: (reportId) => api.get(`/doctor/lab-reports/${reportId}`),
  
//   // ==================== RADIOLOGY TESTS (Doctor) ====================
//   createRadiologyTest: (data) => api.post('/doctor/radiology-tests', data),
//   getMyRadiologyTests: () => api.get('/doctor/radiology-tests'),
//   getRadiologyReport: (reportId) => api.get(`/doctor/radiology-reports/${reportId}`),
// }

// export default doctorService





import api from './api'

const doctorService = {
  // Public routes (these use '/doctors' - keep as is)
  getDoctors: (params = '') => api.get(`/doctor${params ? `?${params}` : ''}`),
  getTopRated: () => api.get('/doctors/top-rated'),
  getBySpecialization: (spec) => api.get(`/doctors/specialization/${spec}`),
  getById: (id) => api.get(`/doctor/${id}`),
  getAvailability: (id, date) => api.get(`/doctor/${id}/availability?date=${date}`),
  
  // Doctor only routes (CHANGE from '/doctors' to '/doctor')
  getMyAppointments: (params = '') => api.get(`/doctor/appointments/my${params ? `?${params}` : ''}`),
  getTodayAppointments: () => api.get('/doctor/appointments/today'),
  updateAppointmentStatus: (id, status) => api.put(`/doctor/appointments/${id}/status`, { status }),
  addPrescription: (data) => api.post('/doctor/prescriptions', data),
  getPatientHistory: (patientId) => api.get(`/doctor/patients/${patientId}/history`),
  updateAvailability: (id, data) => api.put(`/doctor/${id}/availability`, data),
  updateProfile: (id, data) => api.put(`/doctor/${id}/profile`, data),

  // ==================== LAB TESTS (Doctor) ====================
  createLabTest: (data) => api.post('/doctor/lab-tests', data),
  getMyLabTests: () => api.get('/doctor/lab-tests'),
  getLabReport: (reportId) => api.get(`/doctor/lab-reports/${reportId}`),
  
  // ==================== RADIOLOGY TESTS (Doctor) ====================
  createRadiologyTest: (data) => api.post('/doctor/radiology-tests', data),
  getMyRadiologyTests: () => api.get('/doctor/radiology-tests'),
  getRadiologyReport: (reportId) => api.get(`/doctor/radiology-reports/${reportId}`),
}

export default doctorService