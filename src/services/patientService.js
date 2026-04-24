import api from './api'

const patientService = {
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  addMedicalHistory: (data) => api.post('/patients/medical-history', data),
  getMedicalHistory: () => api.get('/patients/medical-history'),
  addFamilyMember: (data) => api.post('/patients/family-member', data),
  getFamilyMembers: () => api.get('/patients/family-members'),
  getPrescriptions: () => api.get('/patients/prescriptions'),
  downloadPrescription: (id) => api.get(`/patients/prescriptions/${id}/download`),
}

export default patientService