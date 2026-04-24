import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUsers, FaUserMd, FaCalendarAlt, FaRupeeSign, FaChartLine, FaChevronRight } from 'react-icons/fa'
import adminService from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats()
        // Only update state if component is still mounted
        if (isMounted) {
          setStats(response.data.stats)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        if (isMounted) {
          toast.error('Failed to load dashboard stats')
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [isMounted]) // Empty dependency array - runs once on mount

  const statCards = [
    { icon: <FaUserMd />, label: 'Total Doctors', value: stats.totalDoctors, color: 'bg-blue-500', link: '/admin/doctors' },
    { icon: <FaUsers />, label: 'Total Patients', value: stats.totalPatients, color: 'bg-green-500', link: '/admin/patients' },
    { icon: <FaCalendarAlt />, label: 'Total Appointments', value: stats.totalAppointments, color: 'bg-purple-500', link: '/admin/appointments' },
    { icon: <FaCalendarAlt />, label: "Today's Appointments", value: stats.todayAppointments, color: 'bg-orange-500', link: '/admin/appointments' },
    { icon: <FaRupeeSign />, label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'bg-yellow-500', link: '/admin/reports' },
  ]

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 mb-8 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-white/80 mt-1">Overview of your hospital management system</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, idx) => (
            <Link to={stat.link} key={idx}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`${stat.color} rounded-xl p-4 text-white hover:shadow-lg transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <FaChevronRight className="opacity-70" />
                </div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/doctors" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="font-medium">➕ Add New Doctor</span>
                <p className="text-sm text-gray-500">Create a new doctor account</p>
              </Link>
              <Link to="/admin/symptoms" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="font-medium">🏥 Manage Symptoms</span>
                <p className="text-sm text-gray-500">Add or update symptoms database</p>
              </Link>
              <Link to="/admin/symptom-mappings" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="font-medium">🔗 Symptom Mappings</span>
                <p className="text-sm text-gray-500">Map symptoms to specializations</p>
              </Link>
              <Link to="/admin/reports" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <span className="font-medium">📊 View Reports</span>
                <p className="text-sm text-gray-500">Generate revenue and appointment reports</p>
              </Link>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Doctor-Patient Ratio</p>
                  <p className="text-sm text-gray-500">Doctors available for consultation</p>
                </div>
                <span className="text-primary-600 font-bold">
                  {stats.totalDoctors}:{stats.totalPatients > 0 && stats.totalDoctors > 0 
                    ? Math.ceil(stats.totalPatients / stats.totalDoctors) 
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Total Appointments</p>
                  <p className="text-sm text-gray-500">All time appointments</p>
                </div>
                <span className="text-primary-600 font-bold">{stats.totalAppointments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Today's Appointments</p>
                  <p className="text-sm text-gray-500">Scheduled for today</p>
                </div>
                <span className="text-orange-600 font-bold">{stats.todayAppointments}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Total Users</p>
                  <p className="text-sm text-gray-500">Registered users in system</p>
                </div>
                <span className="text-primary-600 font-bold">{stats.totalDoctors + stats.totalPatients}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard