// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa'
// import doctorService from '../../services/doctorService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import toast from 'react-hot-toast'

// const AddPrescription = () => {
//   const navigate = useNavigate()
//   const [appointments, setAppointments] = useState([])
//   const [selectedAppointment, setSelectedAppointment] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     diagnosis: '',
//     advice: '',
//     medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
//     followUpDate: '',
//     tests: ['']
//   })

//   useEffect(() => {
//     fetchAppointments()
//   }, [])

//   const fetchAppointments = async () => {
//     try {
//       const response = await doctorService.getMyAppointments('status=confirmed')
//       setAppointments(response.data.appointments || [])
//     } catch (error) {
//       console.error('Error fetching appointments:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleAddMedicine = () => {
//     setFormData(prev => ({
//       ...prev,
//       medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
//     }))
//   }

//   const handleRemoveMedicine = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }))
//   }

//   const handleMedicineChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       medicines: prev.medicines.map((med, i) => i === index ? { ...med, [field]: value } : med)
//     }))
//   }

//   const handleAddTest = () => {
//     setFormData(prev => ({
//       ...prev,
//       tests: [...prev.tests, '']
//     }))
//   }

//   const handleTestChange = (index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       tests: prev.tests.map((t, i) => i === index ? value : t)
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!selectedAppointment) {
//       toast.error('Please select an appointment')
//       return
//     }
//     if (!formData.diagnosis) {
//       toast.error('Please enter diagnosis')
//       return
//     }

//     setSubmitting(true)
//     try {
//       await doctorService.addPrescription({
//         appointmentId: selectedAppointment,
//         ...formData,
//         tests: formData.tests.filter(t => t.trim())
//       })
//       toast.success('Prescription added successfully')
//       navigate('/doctor/appointments')
//     } catch (error) {
//       console.error('Error adding prescription:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-3xl">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
//           <FaArrowLeft /> Back
//         </button>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold">Add Prescription</h1>
//             <p className="text-white/80 mt-1">Create a new prescription for your patient</p>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-5">
//             {/* Select Appointment */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Select Appointment *</label>
//               <select
//                 value={selectedAppointment}
//                 onChange={(e) => setSelectedAppointment(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 required
//               >
//                 <option value="">Select an appointment</option>
//                 {appointments.map(apt => (
//                   <option key={apt._id} value={apt._id}>
//                     {apt.patientId?.name} - {new Date(apt.date).toLocaleDateString()} - {apt.timeSlot}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Diagnosis */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
//               <textarea
//                 value={formData.diagnosis}
//                 onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
//                 rows="3"
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Enter diagnosis..."
//                 required
//               />
//             </div>

//             {/* Medicines */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
//               {formData.medicines.map((med, idx) => (
//                 <div key={idx} className="border rounded-lg p-4 mb-3 bg-gray-50">
//                   <div className="flex justify-between items-center mb-3">
//                     <span className="font-medium">Medicine {idx + 1}</span>
//                     {idx > 0 && (
//                       <button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-red-500">
//                         <FaTrash />
//                       </button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <input
//                       type="text"
//                       placeholder="Medicine name"
//                       value={med.name}
//                       onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Dosage (e.g., 500mg)"
//                       value={med.dosage}
//                       onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Frequency (e.g., Twice daily)"
//                       value={med.frequency}
//                       onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Duration (e.g., 5 days)"
//                       value={med.duration}
//                       onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Additional notes"
//                     value={med.notes}
//                     onChange={(e) => handleMedicineChange(idx, 'notes', e.target.value)}
//                     className="w-full mt-3 px-3 py-2 border rounded-lg"
//                   />
//                 </div>
//               ))}
//               <Button type="button" variant="secondary" size="sm" onClick={handleAddMedicine} icon={FaPlus}>
//                 Add Medicine
//               </Button>
//             </div>

//             {/* Advice */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
//               <textarea
//                 value={formData.advice}
//                 onChange={(e) => setFormData(prev => ({ ...prev, advice: e.target.value }))}
//                 rows="3"
//                 className="w-full px-3 py-2 border rounded-lg"
//                 placeholder="Diet, exercise, lifestyle advice..."
//               />
//             </div>

//             {/* Tests */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Tests</label>
//               {formData.tests.map((test, idx) => (
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
//                       setFormData(prev => ({
//                         ...prev,
//                         tests: prev.tests.filter((_, i) => i !== idx)
//                       }))
//                     }} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg">Remove</button>
//                   )}
//                 </div>
//               ))}
//               <Button type="button" variant="secondary" size="sm" onClick={handleAddTest} icon={FaPlus}>
//                 Add Test
//               </Button>
//             </div>

//             {/* Follow-up Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
//               <input
//                 type="date"
//                 value={formData.followUpDate}
//                 onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>

//             <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} icon={FaSave}>
//               Save Prescription
//             </Button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default AddPrescription



import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const AddPrescription = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    diagnosis: '',
    advice: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    followUpDate: '',
    tests: ['']
  })

  // ✅ Cleanup flag ke saath Effect
  useEffect(() => {
    let isMounted = true
    
    const fetchAppointments = async () => {
      try {
        const response = await doctorService.getMyAppointments('status=confirmed')
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
  }, [])

  // ✅ refreshAppointments function HATADO - koi use nahi hai

  const handleAddMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]
    }))
  }

  const handleRemoveMedicine = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const handleMedicineChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => i === index ? { ...med, [field]: value } : med)
    }))
  }

  const handleAddTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }))
  }

  const handleTestChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tests: prev.tests.map((t, i) => i === index ? value : t)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAppointment) {
      toast.error('Please select an appointment')
      return
    }
    if (!formData.diagnosis) {
      toast.error('Please enter diagnosis')
      return
    }

    setSubmitting(true)
    try {
      await doctorService.addPrescription({
        appointmentId: selectedAppointment,
        ...formData,
        tests: formData.tests.filter(t => t.trim())
      })
      toast.success('Prescription added successfully')
      navigate('/doctor/appointments')
    } catch (error) {
      console.error('Error adding prescription:', error)
      toast.error('Failed to add prescription')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Add Prescription</h1>
            <p className="text-white/80 mt-1">Create a new prescription for your patient</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Select Appointment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Appointment *</label>
              <select
                value={selectedAppointment}
                onChange={(e) => setSelectedAppointment(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select an appointment</option>
                {appointments.map(apt => (
                  <option key={apt._id} value={apt._id}>
                    {apt.patientId?.name} - {new Date(apt.date).toLocaleDateString()} - {apt.timeSlot}
                  </option>
                ))}
              </select>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter diagnosis..."
                required
              />
            </div>

            {/* Medicines */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
              {formData.medicines.map((med, idx) => (
                <div key={idx} className="border rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Medicine {idx + 1}</span>
                    {idx > 0 && (
                      <button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Twice daily)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 5 days)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Additional notes"
                    value={med.notes}
                    onChange={(e) => handleMedicineChange(idx, 'notes', e.target.value)}
                    className="w-full mt-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddMedicine} icon={FaPlus}>
                Add Medicine
              </Button>
            </div>

            {/* Advice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
              <textarea
                value={formData.advice}
                onChange={(e) => setFormData(prev => ({ ...prev, advice: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Diet, exercise, lifestyle advice..."
              />
            </div>

            {/* Tests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Tests</label>
              {formData.tests.map((test, idx) => (
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
                      setFormData(prev => ({
                        ...prev,
                        tests: prev.tests.filter((_, i) => i !== idx)
                      }))
                    }} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Remove</button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTest} icon={FaPlus}>
                Add Test
              </Button>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} icon={FaSave}>
              Save Prescription
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddPrescription