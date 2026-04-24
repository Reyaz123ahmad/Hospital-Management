// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaCalendarAlt, FaClock, FaUserMd, FaRupeeSign, FaEye, FaFilePrescription, FaTimesCircle, FaCalendarPlus } from 'react-icons/fa'
// import appointmentService from '../../services/appointmentService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import Modal from '../Common/Modal'
// import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const MyAppointments = () => {
//   const [appointments, setAppointments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('upcoming')
//   const [selectedAppointment, setSelectedAppointment] = useState(null)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [cancelReason, setCancelReason] = useState('')
//   const [showCancelModal, setShowCancelModal] = useState(false)
//   const [cancelLoading, setCancelLoading] = useState(false)

//   useEffect(() => {
//     fetchAppointments()
//   }, [activeTab])

//   const fetchAppointments = async () => {
//     setLoading(true)
//     try {
//       let response
//       if (activeTab === 'upcoming') {
//         response = await appointmentService.getUpcoming()
//       } else if (activeTab === 'past') {
//         response = await appointmentService.getPast()
//       } else {
//         response = await appointmentService.getMyAppointments()
//       }
//       setAppointments(response.data.appointments || [])
//     } catch (error) {
//       console.error('Error fetching appointments:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCancel = async () => {
//     if (!cancelReason.trim()) {
//       toast.error('Please provide a reason for cancellation')
//       return
//     }
//     setCancelLoading(true)
//     try {
//       await appointmentService.cancel(selectedAppointment._id, cancelReason)
//       toast.success('Appointment cancelled successfully')
//       setShowCancelModal(false)
//       fetchAppointments()
//     } catch (error) {
//       console.error('Error cancelling appointment:', error)
//     } finally {
//       setCancelLoading(false)
//     }
//   }

//   const handleReschedule = async (appointment) => {
//     // Navigate to reschedule page or open modal
//     toast.info('Reschedule feature coming soon')
//   }

//   const tabs = [
//     { id: 'upcoming', label: 'Upcoming' },
//     { id: 'past', label: 'Past' },
//     { id: 'all', label: 'All' }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-5xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold">My Appointments</h1>
//             <p className="text-white/80 mt-1">View and manage your appointments</p>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b px-6">
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-4 py-3 font-medium transition-colors ${
//                   activeTab === tab.id
//                     ? 'text-primary-600 border-b-2 border-primary-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : appointments.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No {activeTab} appointments found</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {appointments.map((apt, idx) => (
//                   <motion.div
//                     key={apt._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex flex-wrap justify-between items-start gap-4">
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                           <FaUserMd className="text-primary-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-800">{apt.doctorId?.userId?.name}</h3>
//                           <p className="text-sm text-gray-500">{apt.doctorId?.specialization}</p>
//                           <div className="flex flex-wrap gap-3 mt-1 text-sm">
//                             <span className="flex items-center gap-1 text-gray-500"><FaCalendarAlt size={12} />{formatDate(apt.date)}</span>
//                             <span className="flex items-center gap-1 text-gray-500"><FaClock size={12} />{apt.timeSlot}</span>
//                             <span className="flex items-center gap-1 text-primary-600 font-medium"><FaRupeeSign size={12} />{formatCurrency(apt.amount)}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end gap-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
//                           {apt.status}
//                         </span>
//                         <div className="flex gap-2">
//                           <Button size="sm" variant="outline" onClick={() => {
//                             setSelectedAppointment(apt)
//                             setShowDetailsModal(true)
//                           }}>
//                             <FaEye /> Details
//                           </Button>
//                           {apt.status === 'confirmed' && (
//                             <>
//                               <Button size="sm" variant="secondary" onClick={() => handleReschedule(apt)}>
//                                 <FaCalendarPlus /> Reschedule
//                               </Button>
//                               <Button size="sm" variant="danger" onClick={() => {
//                                 setSelectedAppointment(apt)
//                                 setShowCancelModal(true)
//                               }}>
//                                 <FaTimesCircle /> Cancel
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Details Modal */}
//       <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details" size="lg">
//         {selectedAppointment && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Doctor</p>
//                 <p className="font-medium">{selectedAppointment.doctorId?.userId?.name}</p>
//                 <p className="text-sm text-gray-500">{selectedAppointment.doctorId?.specialization}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Date & Time</p>
//                 <p className="font-medium">{formatDate(selectedAppointment.date)} at {selectedAppointment.timeSlot}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Consultation Fee</p>
//                 <p className="font-medium text-primary-600">{formatCurrency(selectedAppointment.amount)}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Status</p>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
//                   {selectedAppointment.status}
//                 </span>
//               </div>
//             </div>
//             {selectedAppointment.symptoms?.length > 0 && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Symptoms</p>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedAppointment.symptoms.map((s, i) => (
//                     <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{s}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {selectedAppointment.notes && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Notes</p>
//                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
//               </div>
//             )}
//             {selectedAppointment.prescriptionId && (
//               <Button variant="primary" onClick={() => window.location.href = '/patient/prescriptions'}>
//                 <FaFilePrescription /> View Prescription
//               </Button>
//             )}
//           </div>
//         )}
//       </Modal>

//       {/* Cancel Modal */}
//       <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Appointment">
//         <div className="space-y-4">
//           <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
//           <textarea
//             placeholder="Reason for cancellation..."
//             value={cancelReason}
//             onChange={(e) => setCancelReason(e.target.value)}
//             rows="3"
//             className="w-full px-3 py-2 border rounded-lg resize-none"
//           />
//           <div className="flex gap-3">
//             <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No, Go Back</Button>
//             <Button variant="danger" onClick={handleCancel} loading={cancelLoading}>Yes, Cancel Appointment</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   )
// }

// export default MyAppointments











import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaUserMd, FaRupeeSign, FaEye, FaFilePrescription, FaTimesCircle, FaCalendarPlus } from 'react-icons/fa'
import appointmentService from '../../services/appointmentService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'
import toast from 'react-hot-toast'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchAppointments ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchAppointments = async () => {
      setLoading(true)
      try {
        let response
        if (activeTab === 'upcoming') {
          response = await appointmentService.getUpcoming()
        } else if (activeTab === 'past') {
          response = await appointmentService.getPast()
        } else {
          response = await appointmentService.getMyAppointments()
        }
        if (isMounted) {
          setAppointments(response.data.appointments || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchAppointments()
    
    return () => {
      isMounted = false
    }
  }, [activeTab])

  const refreshAppointments = async () => {
    try {
      let response
      if (activeTab === 'upcoming') {
        response = await appointmentService.getUpcoming()
      } else if (activeTab === 'past') {
        response = await appointmentService.getPast()
      } else {
        response = await appointmentService.getMyAppointments()
      }
      setAppointments(response.data.appointments || [])
    } catch (error) {
      console.error('Error refreshing appointments:', error)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    setCancelLoading(true)
    try {
      await appointmentService.cancel(selectedAppointment._id, cancelReason)
      toast.success('Appointment cancelled successfully')
      setShowCancelModal(false)
      setCancelReason('')
      await refreshAppointments()
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error('Failed to cancel appointment')
    } finally {
      setCancelLoading(false)
    }
  }

  const handleReschedule = async (appointment) => {
    // Navigate to reschedule page or open modal
    toast.info('Reschedule feature coming soon')
  }

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'all', label: 'All' }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="text-white/80 mt-1">View and manage your appointments</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt, idx) => (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FaUserMd className="text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{apt.doctorId?.userId?.name}</h3>
                          <p className="text-sm text-gray-500">{apt.doctorId?.specialization}</p>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm">
                            <span className="flex items-center gap-1 text-gray-500"><FaCalendarAlt size={12} />{formatDate(apt.date)}</span>
                            <span className="flex items-center gap-1 text-gray-500"><FaClock size={12} />{apt.timeSlot}</span>
                            <span className="flex items-center gap-1 text-primary-600 font-medium"><FaRupeeSign size={12} />{formatCurrency(apt.amount)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedAppointment(apt)
                            setShowDetailsModal(true)
                          }}>
                            <FaEye /> Details
                          </Button>
                          {apt.status === 'confirmed' && (
                            <>
                              <Button size="sm" variant="secondary" onClick={() => handleReschedule(apt)}>
                                <FaCalendarPlus /> Reschedule
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => {
                                setSelectedAppointment(apt)
                                setShowCancelModal(true)
                              }}>
                                <FaTimesCircle /> Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details" size="lg">
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selectedAppointment.doctorId?.userId?.name}</p>
                <p className="text-sm text-gray-500">{selectedAppointment.doctorId?.specialization}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(selectedAppointment.date)} at {selectedAppointment.timeSlot}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="font-medium text-primary-600">{formatCurrency(selectedAppointment.amount)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
            </div>
            {selectedAppointment.symptoms?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAppointment.symptoms.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
              </div>
            )}
            {selectedAppointment.prescriptionId && (
              <Button variant="primary" onClick={() => window.location.href = '/patient/prescriptions'}>
                <FaFilePrescription /> View Prescription
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Appointment">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
          <textarea
            placeholder="Reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No, Go Back</Button>
            <Button variant="danger" onClick={handleCancel} loading={cancelLoading}>Yes, Cancel Appointment</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyAppointments