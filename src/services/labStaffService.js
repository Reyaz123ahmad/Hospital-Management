// src/services/labStaffService.js
import api from './api'

const labStaffService = {
  // Token Verification
  verifyToken: (tokenNumber) => api.get(`/lab/verify/${tokenNumber}`),
  
  // Sample/Image Collection
  collectSample: (testId, type) => api.post('/lab/collect-sample', { testId, type }),
  
  // Processing
  startProcessing: (testId, type) => api.post('/lab/start-processing', { testId, type }),
  
  // Report Generation
  generateReport: (testId, type, data) => api.post('/lab/generate-report', { testId, type, ...data }),
}

export default labStaffService