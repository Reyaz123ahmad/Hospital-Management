import api from './api'

const adminService = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  changeUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  unblockUser: (id) => api.put(`/admin/users/${id}/unblock`),
  
  // Doctor Management
  createDoctor: (data) => api.post('/admin/doctors', data),
  getDoctors: () => api.get('/admin/doctors'),
  
  // Patient Management
  getPatients: () => api.get('/admin/patients'),
  
  // Appointments
  getAllAppointments: () => api.get('/admin/appointments/all'),
  
  // Dashboard & Reports
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAppointmentReport: (startDate, endDate) => api.get(`/admin/reports/appointments?startDate=${startDate}&endDate=${endDate}`),
  getRevenueReport: (startDate, endDate) => api.get(`/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}`),
  getDoctorPerformance: () => api.get('/admin/reports/doctors'),
}

export default adminService