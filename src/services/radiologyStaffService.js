// src/services/radiologyStaffService.js
import api from './api'

const radiologyStaffService = {
  // Token Verification
  verifyToken: (tokenNumber) => api.get(`/radiology/verify/${tokenNumber}`),
  
  // Patient Arrival
  markArrived: (tokenNumber) => api.post(`/radiology/${tokenNumber}/arrive`),
  
  // Images Taken
  imagesTaken: (tokenNumber, data) => api.post(`/radiology/${tokenNumber}/images`, data),
  
  // Radiologist Review
  submitReview: (tokenNumber, data) => api.post(`/radiology/${tokenNumber}/review`, data),
  
  // Complete Test & Send Report
  completeTest: (tokenNumber) => api.post(`/radiology/${tokenNumber}/complete`),
}

export default radiologyStaffService