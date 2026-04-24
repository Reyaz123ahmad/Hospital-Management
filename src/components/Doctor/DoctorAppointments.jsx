// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaCalendarAlt, FaClock, FaUser, FaRupeeSign, FaEye, FaFilePrescription, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'
// import doctorService from '../../services/doctorService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const DoctorAppointments = () => {
//   const { user } = useAuth()
//   const [appointments, setAppointments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedAppointment, setSelectedAppointment] = useState(null)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
//   const [filterStatus, setFilterStatus] = useState('all')
//   const [prescriptionData, setPrescriptionData] = useState({
//     diagnosis: '',
//     advice: '',
//     medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//     followUpDate: '',
//     tests: ['']
//   })
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchAppointments()
//   }, [filterStatus])

//   const fetchAppointments = async () => {
//     setLoading(true)
//     try {
//       const params = filterStatus !== 'all' ? `status=${filterStatus}` : ''
//       const response = await doctorService.getMyAppointments(params)
//       setAppointments(response.data.appointments || [])
//     } catch (error) {
//       console.error('Error fetching appointments:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (id, status) => {
//     try {
//       await doctorService.updateAppointmentStatus(id, status)
//       toast.success(`Appointment ${status}`)
//       fetchAppointments()
//     } catch (error) {
//       console.error('Error updating status:', error)
//     }
//   }

//   const handleAddMedicine = () => {
//     setPrescriptionData(prev => ({
//       ...prev,
//       medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
//     }))
//   }

//   const handleRemoveMedicine = (index) => {
//     setPrescriptionData(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }))
//   }

//   const handleMedicineChange = (index, field, value) => {
//     setPrescriptionData(prev => ({
//       ...prev,
//       medicines: prev.medicines.map((med, i) => i === index ? { ...med, [field]: value } : med)
//     }))
//   }

//   const handleAddTest = () => {
//     setPrescriptionData(prev => ({
//       ...prev,
//       tests: [...prev.tests, '']
//     }))
//   }

//   const handleTestChange = (index, value) => {
//     setPrescriptionData(prev => ({
//       ...prev,
//       tests: prev.tests.map((t, i) => i === index ? value : t)
//     }))
//   }

//   const handleSubmitPrescription = async (e) => {
//     e.preventDefault()
//     if (!prescriptionData.diagnosis) {
//       toast.error('Please enter diagnosis')
//       return
//     }
//     setSubmitting(true)
//     try {
//       await doctorService.addPrescription({
//         appointmentId: selectedAppointment._id,
//         ...prescriptionData,
//         tests: prescriptionData.tests.filter(t => t.trim())
//       })
//       toast.success('Prescription added successfully')
//       setShowPrescriptionModal(false)
//       setPrescriptionData({
//         diagnosis: '',
//         advice: '',
//         medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//         followUpDate: '',
//         tests: ['']
//       })
//       fetchAppointments()
//     } catch (error) {
//       console.error('Error adding prescription:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const statuses = [
//     { id: 'all', label: 'All' },
//     { id: 'pending', label: 'Pending' },
//     { id: 'confirmed', label: 'Confirmed' },
//     { id: 'completed', label: 'Completed' },
//     { id: 'cancelled', label: 'Cancelled' }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold">Appointments</h1>
//             <p className="text-white/80 mt-1">Manage your patient appointments</p>
//           </div>

//           {/* Status Filters */}
//           <div className="flex flex-wrap gap-2 p-4 border-b">
//             {statuses.map(status => (
//               <button
//                 key={status.id}
//                 onClick={() => setFilterStatus(status.id)}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                   filterStatus === status.id
//                     ? 'bg-primary-500 text-white'
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 {status.label}
//               </button>
//             ))}
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : appointments.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No appointments found</p>
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
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                             <FaUser className="text-primary-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">{apt.patientId?.name}</h3>
//                             <p className="text-sm text-gray-500">{apt.patientId?.phone}</p>
//                           </div>
//                         </div>
//                         <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//                           <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(apt.date)}</span>
//                           <span className="flex items-center gap-1"><FaClock /> {apt.timeSlot}</span>
//                           <span className="flex items-center gap-1"><FaRupeeSign /> {formatCurrency(apt.amount)}</span>
//                         </div>
//                         {apt.symptoms?.length > 0 && (
//                           <div className="flex flex-wrap gap-1 mt-2">
//                             {apt.symptoms.map((s, i) => (
//                               <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{s}</span>
//                             ))}
//                           </div>
//                         )}
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
//                               <Button size="sm" variant="primary" onClick={() => {
//                                 setSelectedAppointment(apt)
//                                 setShowPrescriptionModal(true)
//                               }}>
//                                 <FaFilePrescription /> Prescription
//                               </Button>
//                               <Button size="sm" variant="success" onClick={() => handleStatusUpdate(apt._id, 'completed')}>
//                                 <FaCheckCircle /> Complete
//                               </Button>
//                             </>
//                           )}
//                           {apt.status === 'pending' && (
//                             <>
//                               <Button size="sm" variant="success" onClick={() => handleStatusUpdate(apt._id, 'confirmed')}>
//                                 Confirm
//                               </Button>
//                               <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(apt._id, 'cancelled')}>
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

//       {/* Appointment Details Modal */}
//       <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details" size="lg">
//         {selectedAppointment && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Patient Name</p>
//                 <p className="font-medium">{selectedAppointment.patientId?.name}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="font-medium">{selectedAppointment.patientId?.phone}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{selectedAppointment.patientId?.email}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Date & Time</p>
//                 <p className="font-medium">{formatDate(selectedAppointment.date)} at {selectedAppointment.timeSlot}</p>
//               </div>
//             </div>
//             {selectedAppointment.notes && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Patient Notes</p>
//                 <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//       {/* Prescription Modal */}
//       <Modal isOpen={showPrescriptionModal} onClose={() => setShowPrescriptionModal(false)} title="Add Prescription" size="xl">
//         {selectedAppointment && (
//           <form onSubmit={handleSubmitPrescription} className="space-y-4 max-h-[70vh] overflow-y-auto">
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Patient: <span className="font-medium">{selectedAppointment.patientId?.name}</span></p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
//               <textarea
//                 value={prescriptionData.diagnosis}
//                 onChange={(e) => setPrescriptionData(prev => ({ ...prev, diagnosis: e.target.value }))}
//                 rows="2"
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Enter diagnosis..."
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
//               {prescriptionData.medicines.map((med, idx) => (
//                 <div key={idx} className="border rounded-lg p-3 mb-3">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm font-medium">Medicine {idx + 1}</span>
//                     {idx > 0 && (
//                       <button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-red-500 text-sm">Remove</button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       type="text"
//                       placeholder="Medicine name"
//                       value={med.name}
//                       onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
//                       className="px-2 py-1 border rounded text-sm"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Dosage (e.g., 500mg)"
//                       value={med.dosage}
//                       onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
//                       className="px-2 py-1 border rounded text-sm"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Frequency (e.g., Twice daily)"
//                       value={med.frequency}
//                       onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
//                       className="px-2 py-1 border rounded text-sm"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Duration (e.g., 5 days)"
//                       value={med.duration}
//                       onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
//                       className="px-2 py-1 border rounded text-sm"
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Additional notes"
//                     value={med.notes}
//                     onChange={(e) => handleMedicineChange(idx, 'notes', e.target.value)}
//                     className="w-full mt-2 px-2 py-1 border rounded text-sm"
//                   />
//                 </div>
//               ))}
//               <Button type="button" variant="secondary" size="sm" onClick={handleAddMedicine}>+ Add Medicine</Button>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
//               <textarea
//                 value={prescriptionData.advice}
//                 onChange={(e) => setPrescriptionData(prev => ({ ...prev, advice: e.target.value }))}
//                 rows="3"
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Diet, exercise, lifestyle advice..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Tests</label>
//               {prescriptionData.tests.map((test, idx) => (
//                 <div key={idx} className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={test}
//                     onChange={(e) => handleTestChange(idx, e.target.value)}
//                     className="flex-1 px-3 py-2 border rounded-lg"
//                     placeholder="e.g., CBC, X-Ray, ECG"
//                   />
//                   {idx > 0 && (
//                     <button type="button" onClick={() => {
//                       setPrescriptionData(prev => ({
//                         ...prev,
//                         tests: prev.tests.filter((_, i) => i !== idx)
//                       }))
//                     }} className="text-red-500">Remove</button>
//                   )}
//                 </div>
//               ))}
//               <Button type="button" variant="secondary" size="sm" onClick={handleAddTest}>+ Add Test</Button>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
//               <input
//                 type="date"
//                 value={prescriptionData.followUpDate}
//                 onChange={(e) => setPrescriptionData(prev => ({ ...prev, followUpDate: e.target.value }))}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <Button type="button" variant="secondary" onClick={() => setShowPrescriptionModal(false)}>Cancel</Button>
//               <Button type="submit" variant="primary" loading={submitting}>Save Prescription</Button>
//             </div>
//           </form>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default DoctorAppointments




import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaUser, FaRupeeSign, FaEye, FaFilePrescription, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers'
import toast from 'react-hot-toast'

const DoctorAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    advice: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    followUpDate: '',
    tests: ['']
  })
  const [submitting, setSubmitting] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchAppointments ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchAppointments = async () => {
      setLoading(true)
      try {
        const params = filterStatus !== 'all' ? `status=${filterStatus}` : ''
        const response = await doctorService.getMyAppointments(params)
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
  }, [filterStatus])

  const refreshAppointments = async () => {
    try {
      const params = filterStatus !== 'all' ? `status=${filterStatus}` : ''
      const response = await doctorService.getMyAppointments(params)
      setAppointments(response.data.appointments || [])
    } catch (error) {
      console.error('Error refreshing appointments:', error)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, status)
      toast.success(`Appointment ${status}`)
      await refreshAppointments()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleAddMedicine = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
    }))
  }

  const handleRemoveMedicine = (index) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => i === index ? { ...med, [field]: value } : med)
    }))
  }

  const handleAddTest = () => {
    setPrescriptionData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }))
  }

  const handleTestChange = (index, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      tests: prev.tests.map((t, i) => i === index ? value : t)
    }))
  }

  const handleSubmitPrescription = async (e) => {
    e.preventDefault()
    if (!prescriptionData.diagnosis) {
      toast.error('Please enter diagnosis')
      return
    }
    setSubmitting(true)
    try {
      await doctorService.addPrescription({
        appointmentId: selectedAppointment._id,
        ...prescriptionData,
        tests: prescriptionData.tests.filter(t => t.trim())
      })
      toast.success('Prescription added successfully')
      setShowPrescriptionModal(false)
      setPrescriptionData({
        diagnosis: '',
        advice: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
        followUpDate: '',
        tests: ['']
      })
      await refreshAppointments()
    } catch (error) {
      console.error('Error adding prescription:', error)
      toast.error('Failed to add prescription')
    } finally {
      setSubmitting(false)
    }
  }

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-white/80 mt-1">Manage your patient appointments</p>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 p-4 border-b">
            {statuses.map(status => (
              <button
                key={status.id}
                onClick={() => setFilterStatus(status.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {loading ? (
              <LoadingSpinner />
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No appointments found</p>
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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{apt.patientId?.name}</h3>
                            <p className="text-sm text-gray-500">{apt.patientId?.phone}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(apt.date)}</span>
                          <span className="flex items-center gap-1"><FaClock /> {apt.timeSlot}</span>
                          <span className="flex items-center gap-1"><FaRupeeSign /> {formatCurrency(apt.amount)}</span>
                        </div>
                        {apt.symptoms?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {apt.symptoms.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{s}</span>
                            ))}
                          </div>
                        )}
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
                              <Button size="sm" variant="primary" onClick={() => {
                                setSelectedAppointment(apt)
                                setShowPrescriptionModal(true)
                              }}>
                                <FaFilePrescription /> Prescription
                              </Button>
                              <Button size="sm" variant="success" onClick={() => handleStatusUpdate(apt._id, 'completed')}>
                                <FaCheckCircle /> Complete
                              </Button>
                            </>
                          )}
                          {apt.status === 'pending' && (
                            <>
                              <Button size="sm" variant="success" onClick={() => handleStatusUpdate(apt._id, 'confirmed')}>
                                Confirm
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(apt._id, 'cancelled')}>
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

      {/* Appointment Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details" size="lg">
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-medium">{selectedAppointment.patientId?.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedAppointment.patientId?.phone}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedAppointment.patientId?.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{formatDate(selectedAppointment.date)} at {selectedAppointment.timeSlot}</p>
              </div>
            </div>
            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Patient Notes</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Prescription Modal */}
      <Modal isOpen={showPrescriptionModal} onClose={() => setShowPrescriptionModal(false)} title="Add Prescription" size="xl">
        {selectedAppointment && (
          <form onSubmit={handleSubmitPrescription} className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Patient: <span className="font-medium">{selectedAppointment.patientId?.name}</span></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
              <textarea
                value={prescriptionData.diagnosis}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                rows="2"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter diagnosis..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
              {prescriptionData.medicines.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Medicine {idx + 1}</span>
                    {idx > 0 && (
                      <button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-red-500 text-sm">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Twice daily)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 5 days)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Additional notes"
                    value={med.notes}
                    onChange={(e) => handleMedicineChange(idx, 'notes', e.target.value)}
                    className="w-full mt-2 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddMedicine}>+ Add Medicine</Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
              <textarea
                value={prescriptionData.advice}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, advice: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Diet, exercise, lifestyle advice..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Tests</label>
              {prescriptionData.tests.map((test, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={test}
                    onChange={(e) => handleTestChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., CBC, X-Ray, ECG"
                  />
                  {idx > 0 && (
                    <button type="button" onClick={() => {
                      setPrescriptionData(prev => ({
                        ...prev,
                        tests: prev.tests.filter((_, i) => i !== idx)
                      }))
                    }} className="text-red-500">Remove</button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTest}>+ Add Test</Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={prescriptionData.followUpDate}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => setShowPrescriptionModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>Save Prescription</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default DoctorAppointments