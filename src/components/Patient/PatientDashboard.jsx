// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { FaCalendarAlt, FaFilePrescription, FaUserMd, FaStar, FaClock, FaChevronRight } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'
// import appointmentService from '../../services/appointmentService'
// import patientService from '../../services/patientService'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate, formatCurrency } from '../../utils/helpers'

// const PatientDashboard = () => {
//   const { user } = useAuth()
//   const [stats, setStats] = useState({
//     upcomingAppointments: 0,
//     totalAppointments: 0,
//     prescriptions: 0,
//     reviews: 0
//   })
//   const [upcomingAppointments, setUpcomingAppointments] = useState([])
//   const [recentPrescriptions, setRecentPrescriptions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [profile, setProfile] = useState(null)

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     setLoading(true)
//     try {
//       const [appointmentsRes, prescriptionsRes, profileRes] = await Promise.all([
//         appointmentService.getUpcoming(),
//         patientService.getPrescriptions(),
//         patientService.getProfile()
//       ])

//       const upcoming = appointmentsRes.data.appointments || []
//       const prescriptions = prescriptionsRes.data.prescriptions || []
      
//       setUpcomingAppointments(upcoming.slice(0, 5))
//       setRecentPrescriptions(prescriptions.slice(0, 5))
//       setProfile(profileRes.data.patient)
      
//       setStats({
//         upcomingAppointments: upcoming.length,
//         totalAppointments: appointmentsRes.data.count || 0,
//         prescriptions: prescriptions.length,
//         reviews: 0
//       })
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const quickActions = [
//     { icon: <FaCalendarAlt />, title: 'Book Appointment', link: '/patient/book-appointment', color: 'from-blue-500 to-blue-600' },
//     { icon: <FaUserMd />, title: 'Find Doctors', link: '/doctors', color: 'from-green-500 to-green-600' },
//     { icon: <FaFilePrescription />, title: 'My Prescriptions', link: '/patient/prescriptions', color: 'from-purple-500 to-purple-600' },
//     { icon: <FaStar />, title: 'Write Review', link: '/patient/reviews', color: 'from-yellow-500 to-yellow-600' },
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
//           <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}!</h1>
//           <p className="text-white/80 mt-1">Your health is our priority. Here's what's happening today.</p>
//         </motion.div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: 'bg-blue-500' },
//             { label: 'Total Appointments', value: stats.totalAppointments, color: 'bg-green-500' },
//             { label: 'Prescriptions', value: stats.prescriptions, color: 'bg-purple-500' },
//             { label: 'Reviews Given', value: stats.reviews, color: 'bg-yellow-500' },
//           ].map((stat, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: idx * 0.1 }}
//               className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <p className="text-gray-500 text-sm">{stat.label}</p>
//               <p className={`text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
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

//             {/* Profile Card */}
//             {profile && (
//               <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
//                 <h3 className="font-semibold text-gray-800 mb-3">Profile Info</h3>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-gray-500">Blood Group:</span> {profile.bloodGroup || 'Not added'}</p>
//                   <p><span className="text-gray-500">Allergies:</span> {profile.allergies?.length || 0} recorded</p>
//                   <p><span className="text-gray-500">Family Members:</span> {profile.familyMembers?.length || 0}</p>
//                   <Link to="/patient/profile" className="text-primary-600 text-sm hover:underline">Update Profile →</Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Upcoming Appointments */}
//           <div className="lg:col-span-2">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
//               <Link to="/patient/appointments" className="text-primary-600 text-sm hover:underline">View All</Link>
//             </div>
            
//             {upcomingAppointments.length === 0 ? (
//               <div className="bg-white rounded-xl p-8 text-center">
//                 <p className="text-gray-500">No upcoming appointments</p>
//                 <Link to="/patient/book-appointment" className="text-primary-600 mt-2 inline-block">Book one now →</Link>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {upcomingAppointments.map((apt, idx) => (
//                   <motion.div
//                     key={apt._id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                     className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex flex-wrap justify-between items-center gap-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//                           <FaUserMd className="text-primary-600 text-xl" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{apt.doctorId?.userId?.name}</h3>
//                           <p className="text-sm text-gray-500">{apt.doctorId?.specialization}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4 text-sm">
//                         <div className="flex items-center gap-1 text-gray-500">
//                           <FaCalendarAlt />
//                           <span>{formatDate(apt.date)}</span>
//                         </div>
//                         <div className="flex items-center gap-1 text-gray-500">
//                           <FaClock />
//                           <span>{apt.timeSlot}</span>
//                         </div>
//                         <div className="font-semibold text-green-600">{formatCurrency(apt.amount)}</div>
//                       </div>
//                       <Link to={`/patient/appointments`} className="text-primary-600 text-sm hover:underline">
//                         View Details →
//                       </Link>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}

//             {/* Recent Prescriptions */}
//             <div className="mt-8">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">Recent Prescriptions</h2>
//                 <Link to="/patient/prescriptions" className="text-primary-600 text-sm hover:underline">View All</Link>
//               </div>
              
//               {recentPrescriptions.length === 0 ? (
//                 <div className="bg-white rounded-xl p-8 text-center">
//                   <p className="text-gray-500">No prescriptions yet</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {recentPrescriptions.map((pres, idx) => (
//                     <div key={pres._id} className="bg-white rounded-xl p-4 shadow-sm">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-medium text-gray-800">Dr. {pres.doctorId?.userId?.name}</p>
//                           <p className="text-sm text-gray-500">{formatDate(pres.createdAt)}</p>
//                         </div>
//                         <Link to={`/patient/prescriptions`} className="text-primary-600 text-sm">View →</Link>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PatientDashboard












import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaFilePrescription, FaUserMd, FaStar, FaClock, FaChevronRight } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import appointmentService from '../../services/appointmentService'
import patientService from '../../services/patientService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const PatientDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    prescriptions: 0,
    reviews: 0
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // ✅ Cleanup flag ke saath Effect - fetchDashboardData ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [appointmentsRes, prescriptionsRes, profileRes] = await Promise.all([
          appointmentService.getUpcoming(),
          patientService.getPrescriptions(),
          patientService.getProfile()
        ])

        if (isMounted) {
          const upcoming = appointmentsRes.data.appointments || []
          const prescriptions = prescriptionsRes.data.prescriptions || []
          
          setUpcomingAppointments(upcoming.slice(0, 5))
          setRecentPrescriptions(prescriptions.slice(0, 5))
          setProfile(profileRes.data.patient)
          
          setStats({
            upcomingAppointments: upcoming.length,
            totalAppointments: appointmentsRes.data.count || 0,
            prescriptions: prescriptions.length,
            reviews: 0
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

  const refreshDashboardData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes, profileRes] = await Promise.all([
        appointmentService.getUpcoming(),
        patientService.getPrescriptions(),
        patientService.getProfile()
      ])

      const upcoming = appointmentsRes.data.appointments || []
      const prescriptions = prescriptionsRes.data.prescriptions || []
      
      setUpcomingAppointments(upcoming.slice(0, 5))
      setRecentPrescriptions(prescriptions.slice(0, 5))
      setProfile(profileRes.data.patient)
      
      setStats({
        upcomingAppointments: upcoming.length,
        totalAppointments: appointmentsRes.data.count || 0,
        prescriptions: prescriptions.length,
        reviews: 0
      })
    } catch (error) {
      console.error('Error refreshing dashboard data:', error)
    }
  }

  const quickActions = [
    { icon: <FaCalendarAlt />, title: 'Book Appointment', link: '/patient/book-appointment', color: 'from-blue-500 to-blue-600' },
    { icon: <FaUserMd />, title: 'Find Doctors', link: '/doctors', color: 'from-green-500 to-green-600' },
    { icon: <FaFilePrescription />, title: 'My Prescriptions', link: '/patient/prescriptions', color: 'from-purple-500 to-purple-600' },
    { icon: <FaStar />, title: 'Write Review', link: '/patient/reviews', color: 'from-yellow-500 to-yellow-600' },
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
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-white/80 mt-1">Your health is our priority. Here's what's happening today.</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upcoming Appointments', value: stats.upcomingAppointments, color: 'bg-blue-500' },
            { label: 'Total Appointments', value: stats.totalAppointments, color: 'bg-green-500' },
            { label: 'Prescriptions', value: stats.prescriptions, color: 'bg-purple-500' },
            { label: 'Reviews Given', value: stats.reviews, color: 'bg-yellow-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</p>
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

            {/* Profile Card */}
            {profile && (
              <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">Profile Info</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Blood Group:</span> {profile.bloodGroup || 'Not added'}</p>
                  <p><span className="text-gray-500">Allergies:</span> {profile.allergies?.length || 0} recorded</p>
                  <p><span className="text-gray-500">Family Members:</span> {profile.familyMembers?.length || 0}</p>
                  <Link to="/patient/profile" className="text-primary-600 text-sm hover:underline">Update Profile →</Link>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
              <Link to="/patient/appointments" className="text-primary-600 text-sm hover:underline">View All</Link>
            </div>
            
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">No upcoming appointments</p>
                <Link to="/patient/book-appointment" className="text-primary-600 mt-2 inline-block">Book one now →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt, idx) => (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaUserMd className="text-primary-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{apt.doctorId?.userId?.name}</h3>
                          <p className="text-sm text-gray-500">{apt.doctorId?.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaCalendarAlt />
                          <span>{formatDate(apt.date)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <FaClock />
                          <span>{apt.timeSlot}</span>
                        </div>
                        <div className="font-semibold text-green-600">{formatCurrency(apt.amount)}</div>
                      </div>
                      <Link to={`/patient/appointments`} className="text-primary-600 text-sm hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recent Prescriptions */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Prescriptions</h2>
                <Link to="/patient/prescriptions" className="text-primary-600 text-sm hover:underline">View All</Link>
              </div>
              
              {recentPrescriptions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-500">No prescriptions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPrescriptions.map((pres, idx) => (
                    <div key={pres._id} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Dr. {pres.doctorId?.userId?.name}</p>
                          <p className="text-sm text-gray-500">{formatDate(pres.createdAt)}</p>
                        </div>
                        <Link to={`/patient/prescriptions`} className="text-primary-600 text-sm">View →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard