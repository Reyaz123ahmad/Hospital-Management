// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaHistory, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaStethoscope } from 'react-icons/fa'
// import patientService from '../../services/patientService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const MedicalHistory = () => {
//   const [medicalHistory, setMedicalHistory] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [formData, setFormData] = useState({
//     disease: '',
//     diagnosedDate: '',
//     treatedBy: '',
//     notes: ''
//   })
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchMedicalHistory()
//   }, [])

//   const fetchMedicalHistory = async () => {
//     try {
//       const response = await patientService.getMedicalHistory()
//       setMedicalHistory(response.data.medicalHistory || [])
//     } catch (error) {
//       console.error('Error fetching medical history:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!formData.disease) {
//       toast.error('Please enter disease name')
//       return
//     }
//     setSubmitting(true)
//     try {
//       await patientService.addMedicalHistory(formData)
//       toast.success('Medical history added')
//       setShowAddModal(false)
//       setFormData({ disease: '', diagnosedDate: '', treatedBy: '', notes: '' })
//       fetchMedicalHistory()
//     } catch (error) {
//       console.error('Error adding medical history:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold flex items-center gap-2">
//                 <FaHistory /> Medical History
//               </h1>
//               <p className="text-white/80 mt-1">Track your health conditions and treatments</p>
//             </div>
//             <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
//               Add Record
//             </Button>
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : medicalHistory.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No medical history records found</p>
//                 <Button onClick={() => setShowAddModal(true)} className="mt-4">Add Your First Record</Button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {medicalHistory.map((record, idx) => (
//                   <motion.div
//                     key={idx}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-lg text-gray-800">{record.disease}</h3>
//                         <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
//                           {record.diagnosedDate && (
//                             <span className="flex items-center gap-1"><FaCalendarAlt /> Diagnosed: {formatDate(record.diagnosedDate)}</span>
//                           )}
//                           {record.treatedBy && (
//                             <span className="flex items-center gap-1"><FaStethoscope /> Treated by: Dr. {record.treatedBy}</span>
//                           )}
//                         </div>
//                         {record.notes && <p className="text-gray-600 mt-2 text-sm">{record.notes}</p>}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Add Medical History Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Medical History">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Disease / Condition *</label>
//             <input
//               type="text"
//               name="disease"
//               value={formData.disease}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               placeholder="e.g., Hypertension, Diabetes"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
//             <input
//               type="date"
//               name="diagnosedDate"
//               value={formData.diagnosedDate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Treated By (Doctor Name)</label>
//             <input
//               type="text"
//               name="treatedBy"
//               value={formData.treatedBy}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               placeholder="Doctor's name"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border rounded-lg resize-none"
//               placeholder="Any additional information..."
//             />
//           </div>
//           <div className="flex gap-3">
//             <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Save Record</Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default MedicalHistory










import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaHistory, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaStethoscope } from 'react-icons/fa'
import patientService from '../../services/patientService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const MedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    disease: '',
    diagnosedDate: '',
    treatedBy: '',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchMedicalHistory ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchMedicalHistory = async () => {
      try {
        const response = await patientService.getMedicalHistory()
        if (isMounted) {
          setMedicalHistory(response.data.medicalHistory || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching medical history:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchMedicalHistory()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshMedicalHistory = async () => {
    try {
      const response = await patientService.getMedicalHistory()
      setMedicalHistory(response.data.medicalHistory || [])
    } catch (error) {
      console.error('Error refreshing medical history:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.disease) {
      toast.error('Please enter disease name')
      return
    }
    setSubmitting(true)
    try {
      await patientService.addMedicalHistory(formData)
      toast.success('Medical history added')
      setShowAddModal(false)
      setFormData({ disease: '', diagnosedDate: '', treatedBy: '', notes: '' })
      await refreshMedicalHistory()
    } catch (error) {
      console.error('Error adding medical history:', error)
      toast.error('Failed to add medical history')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaHistory /> Medical History
              </h1>
              <p className="text-white/80 mt-1">Track your health conditions and treatments</p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
              Add Record
            </Button>
          </div>

          <div className="p-6">
            {medicalHistory.length === 0 ? (
              <div className="text-center py-12">
                <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No medical history records found</p>
                <Button onClick={() => setShowAddModal(true)} className="mt-4">Add Your First Record</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalHistory.map((record, idx) => (
                  <motion.div
                    key={record._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{record.disease}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          {record.diagnosedDate && (
                            <span className="flex items-center gap-1"><FaCalendarAlt /> Diagnosed: {formatDate(record.diagnosedDate)}</span>
                          )}
                          {record.treatedBy && (
                            <span className="flex items-center gap-1"><FaStethoscope /> Treated by: Dr. {record.treatedBy}</span>
                          )}
                        </div>
                        {record.notes && <p className="text-gray-600 mt-2 text-sm">{record.notes}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Medical History Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Medical History">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disease / Condition *</label>
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Hypertension, Diabetes"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
            <input
              type="date"
              name="diagnosedDate"
              value={formData.diagnosedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treated By (Doctor Name)</label>
            <input
              type="text"
              name="treatedBy"
              value={formData.treatedBy}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Doctor's name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any additional information..."
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MedicalHistory