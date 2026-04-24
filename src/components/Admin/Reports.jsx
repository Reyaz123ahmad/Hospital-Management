import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaCalendarAlt, FaDownload, FaRupeeSign, FaUsers, FaUserMd } from 'react-icons/fa'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import adminService from '../../services/adminService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Reports = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [appointmentReport, setAppointmentReport] = useState(null)
  const [revenueReport, setRevenueReport] = useState(null)
  const [doctorPerformance, setDoctorPerformance] = useState([])

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }
    setLoading(true)
    try {
      const [appointmentRes, revenueRes, doctorRes] = await Promise.all([
        adminService.getAppointmentReport(startDate, endDate),
        adminService.getRevenueReport(startDate, endDate),
        adminService.getDoctorPerformance()
      ])
      setAppointmentReport(appointmentRes.data.report)
      setRevenueReport(revenueRes.data.report)
      setDoctorPerformance(doctorRes.data.performance || [])
    } catch (error) {
      console.error('Error generating reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const pieColors = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b']

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaChartLine /> Reports & Analytics
            </h1>
            <p className="text-white/80 mt-1">Generate and view hospital statistics</p>
          </div>

          <div className="p-6">
            {/* Date Range Selector */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <Button onClick={handleGenerateReport} icon={FaCalendarAlt}>
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            {appointmentReport && revenueReport && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600">Total Appointments</p>
                    <p className="text-2xl font-bold text-blue-700">{appointmentReport.total}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{appointmentReport.completed}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-sm text-red-600">Cancelled</p>
                    <p className="text-2xl font-bold text-red-700">{appointmentReport.cancelled}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <p className="text-sm text-yellow-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-yellow-700">{formatCurrency(revenueReport.totalRevenue)}</p>
                  </div>
                </div>

                {/* Appointment Status Pie Chart */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Status Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: appointmentReport.completed },
                            { name: 'Cancelled', value: appointmentReport.cancelled },
                            { name: 'Pending', value: appointmentReport.pending }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {appointmentReport.completed && <Cell fill="#22c55e" />}
                          {appointmentReport.cancelled && <Cell fill="#ef4444" />}
                          {appointmentReport.pending && <Cell fill="#f59e0b" />}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Revenue Chart */}
                {revenueReport.monthlyRevenue && revenueReport.monthlyRevenue.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueReport.monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="_id" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Bar dataKey="total" fill="#6366f1" name="Revenue (₹)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Doctor Performance Table */}
                {doctorPerformance.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Specialization</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Appointments</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Completed</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Revenue</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {doctorPerformance.map((doctor, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{doctor.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{doctor.specialization}</td>
                              <td className="px-4 py-3">{doctor.totalAppointments}</td>
                              <td className="px-4 py-3 text-green-600">{doctor.completedAppointments}</td>
                              <td className="px-4 py-3 text-primary-600">{formatCurrency(doctor.totalRevenue)}</td>
                              <td className="px-4 py-3">⭐ {doctor.rating || 'New'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {!appointmentReport && !loading && (
              <div className="text-center py-12">
                <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select date range and click Generate Report</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Reports