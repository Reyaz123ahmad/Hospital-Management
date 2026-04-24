// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { FaCalendarAlt, FaUsers, FaRupeeSign, FaStar, FaClock, FaChevronRight, FaFilePrescription } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'
// import doctorService from '../../services/doctorService'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate, formatCurrency } from '../../utils/helpers'

// const DoctorDashboard = () => {
//   const { user } = useAuth()
//   const [stats, setStats] = useState({
//     todayAppointments: 0,
//     totalAppointments: 0,
//     totalPatients: 0,
//     totalRevenue: 0,
//     rating: 0
//   })
//   const [todayAppointments, setTodayAppointments] = useState([])
//   const [recentAppointments, setRecentAppointments] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     setLoading(true)
//     try {
//       const [todayRes, allRes] = await Promise.all([
//         doctorService.getTodayAppointments(),
//         doctorService.getMyAppointments()
//       ])

//       const today = todayRes.data.appointments || []
//       const all = allRes.data.appointments || []
      
//       setTodayAppointments(today.slice(0, 5))
//       setRecentAppointments(all.slice(0, 5))
      
//       const uniquePatients = new Set(all.map(apt => apt.patientId?._id))
//       const completed = all.filter(apt => apt.status === 'completed')
//       const revenue = completed.reduce((sum, apt) => sum + (apt.amount || 0), 0)
      
//       setStats({
//         todayAppointments: today.length,
//         totalAppointments: all.length,
//         totalPatients: uniquePatients.size,
//         totalRevenue: revenue,
//         rating: 4.5
//       })
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const quickActions = [
//     { icon: <FaCalendarAlt />, title: 'Today\'s Schedule', link: '/doctor/appointments', color: 'from-blue-500 to-blue-600' },
//     { icon: <FaFilePrescription />, title: 'Add Prescription', link: '/doctor/prescription/new', color: 'from-green-500 to-green-600' },
//     { icon: <FaClock />, title: 'Set Availability', link: '/doctor/availability', color: 'from-purple-500 to-purple-600' },
//     { icon: <FaUsers />, title: 'Patient History', link: '/doctor/appointments', color: 'from-orange-500 to-orange-600' },
//   ]

//   if (loading) return <LoadingSpinner fullScreen />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Welcome Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 mb-8 text-white"
//         >
//           <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Dr. {user?.name}!</h1>
//           <p className="text-white/80 mt-1">Here's your practice at a glance.</p>
//         </motion.div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Today\'s Appointments', value: stats.todayAppointments, color: 'text-blue-500' },
//             { label: 'Total Appointments', value: stats.totalAppointments, color: 'text-green-500' },
//             { label: 'Total Patients', value: stats.totalPatients, color: 'text-purple-500' },
//             { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-yellow-500' },
//           ].map((stat, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white rounded-xl p-4 shadow-sm"
//             >
//               <p className="text-gray-500 text-sm">{stat.label}</p>
//               <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Quick Actions */}
//           <div className="lg:col-span-1">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="space-y-3">
//               {quickActions.map((action, idx) => (
//                 <Link to={action.link} key={idx}>
//                   <motion.div
//                     whileHover={{ x: 5 }}
//                     className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white flex items-center justify-between cursor-pointer`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="text-xl">{action.icon}</span>
//                       <span className="font-medium">{action.title}</span>
//                     </div>
//                     <FaChevronRight />
//                   </motion.div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Today's Appointments */}
//           <div className="lg:col-span-2">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
//               <Link to="/doctor/appointments" className="text-primary-600 text-sm hover:underline">View All</Link>
//             </div>
            
//             {todayAppointments.length === 0 ? (
//               <div className="bg-white rounded-xl p-8 text-center">
//                 <p className="text-gray-500">No appointments scheduled for today</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {todayAppointments.map((apt, idx) => (
//                   <motion.div
//                     key={apt._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                     className="bg-white rounded-xl p-4 shadow-sm"
//                   >
//                     <div className="flex flex-wrap justify-between items-center gap-3">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{apt.patientId?.name}</h3>
//                         <p className="text-sm text-gray-500">{apt.timeSlot}</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {apt.status}
//                         </span>
//                         <Link to={`/doctor/appointments`}>
//                           <button className="text-primary-600 text-sm">View →</button>
//                         </Link>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DoctorDashboard








import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaUsers, FaRupeeSign, FaClock, FaChevronRight, FaFilePrescription } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import doctorService from '../../services/doctorService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    totalRevenue: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ Cleanup flag ke saath Effect - fetchDashboardData ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [todayRes, allRes] = await Promise.all([
          doctorService.getTodayAppointments(),
          doctorService.getMyAppointments()
        ])

        if (isMounted) {
          const today = todayRes.data.appointments || []
          const all = allRes.data.appointments || []
          
          setTodayAppointments(today.slice(0, 5))
          setRecentAppointments(all.slice(0, 5))
          
          const uniquePatients = new Set(all.map(apt => apt.patientId?._id))
          const completed = all.filter(apt => apt.status === 'completed')
          const revenue = completed.reduce((sum, apt) => sum + (apt.amount || 0), 0)
          
          setStats({
            todayAppointments: today.length,
            totalAppointments: all.length,
            totalPatients: uniquePatients.size,
            totalRevenue: revenue,
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchDashboardData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const quickActions = [
    { icon: <FaCalendarAlt />, title: 'Today\'s Schedule', link: '/doctor/appointments', color: 'from-blue-500 to-blue-600' },
    { icon: <FaFilePrescription />, title: 'Add Prescription', link: '/doctor/prescription/new', color: 'from-green-500 to-green-600' },
    { icon: <FaClock />, title: 'Set Availability', link: '/doctor/availability', color: 'from-purple-500 to-purple-600' },
    { icon: <FaUsers />, title: 'Patient History', link: '/doctor/appointments', color: 'from-orange-500 to-orange-600' },
  ]

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 mb-8 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Dr. {user?.name}!</h1>
          <p className="text-white/80 mt-1">Here's your practice at a glance.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Today\'s Appointments', value: stats.todayAppointments, color: 'text-blue-500' },
            { label: 'Total Appointments', value: stats.totalAppointments, color: 'text-green-500' },
            { label: 'Total Patients', value: stats.totalPatients, color: 'text-purple-500' },
            { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'text-yellow-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, idx) => (
                <Link to={action.link} key={idx}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white flex items-center justify-between cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{action.icon}</span>
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <FaChevronRight />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
              <Link to="/doctor/appointments" className="text-primary-600 text-sm hover:underline">View All</Link>
            </div>
            
            {todayAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt, idx) => (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{apt.patientId?.name}</h3>
                        <p className="text-sm text-gray-500">{apt.timeSlot}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apt.status}
                        </span>
                        <Link to={`/doctor/appointments`}>
                          <button className="text-primary-600 text-sm">View →</button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard