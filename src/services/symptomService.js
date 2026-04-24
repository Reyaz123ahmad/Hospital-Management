import api from './api'

const symptomService = {
  // Public
  getAllSymptoms: () => api.get('/symptoms'),
  analyzeSymptoms: (data) => api.post('/symptoms/analyze', data),
  searchSymptoms: (query) => api.get(`/symptoms/search?q=${query}`),
  getByCategory: () => api.get('/symptoms/by-category'),
  
  // Admin only
  createSymptom: (data) => api.post('/symptoms', data),
  updateSymptom: (id, data) => api.put(`/symptoms/${id}`, data),
  deleteSymptom: (id) => api.delete(`/symptoms/${id}`),
  
  // Symptom Mappings (Admin)
  getMappings: () => api.get('/symptoms/mappings'),
  getMappingById: (id) => api.get(`/symptoms/mappings/${id}`),
  createMapping: (data) => api.post('/symptoms/mappings', data),
  updateMapping: (id, data) => api.put(`/symptoms/mappings/${id}`, data),
  deleteMapping: (id) => api.delete(`/symptoms/mappings/${id}`),
  toggleMapping: (id) => api.patch(`/symptoms/mappings/${id}/toggle`),
  bulkCreateMappings: (data) => api.post('/symptoms/mappings/bulk', data),
  getEmergencyMappings: () => api.get('/symptoms/emergency-mappings'),
}

export default symptomService