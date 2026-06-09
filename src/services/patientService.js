import api from './api'

const patientService = {
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  addMedicalHistory: (data) => api.post('/patient/medical-history', data),
  getMedicalHistory: () => api.get('/patient/medical-history'),
  addFamilyMember: (data) => api.post('/patient/family-member', data),
  getFamilyMembers: () => api.get('/patient/family-members'),
  getPrescriptions: () => api.get('/patient/prescriptions'),
  downloadPrescription: (id) => api.get(`/patient/prescriptions/${id}/download`),

  // ==================== LAB TESTS (Patient) ====================
  getMyLabTests: () => api.get('/patient/lab-tests'),
  getLabTestStatus: (testId) => api.get(`/patient/lab-tests/${testId}/status`),
  getMyLabReports: () => api.get('/patient/lab-reports'),
  
  // ==================== RADIOLOGY TESTS (Patient) ====================
  getMyRadiologyTests: () => api.get('/patient/radiology-tests'),
  getRadiologyTestStatus: (testId) => api.get(`/patient/radiology-tests/${testId}/status`),
  getMyRadiologyReports: () => api.get('/patient/radiology-reports'),


}

export default patientService