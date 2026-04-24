// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaFilePrescription, FaDownload, FaEye, FaCalendarAlt, FaUserMd } from 'react-icons/fa'
// import patientService from '../../services/patientService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import Modal from '../Common/Modal'
// import { formatDate } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const Prescriptions = () => {
//   const [prescriptions, setPrescriptions] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedPrescription, setSelectedPrescription] = useState(null)
//   const [showDetailsModal, setShowDetailsModal] = useState(false)

//   useEffect(() => {
//     fetchPrescriptions()
//   }, [])

//   const fetchPrescriptions = async () => {
//     try {
//       const response = await patientService.getPrescriptions()
//       setPrescriptions(response.data.prescriptions || [])
//     } catch (error) {
//       console.error('Error fetching prescriptions:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDownload = async (id) => {
//     try {
//       const response = await patientService.downloadPrescription(id)
//       const url = window.URL.createObjectURL(new Blob([response.data]))
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', `prescription_${id}.pdf`)
//       document.body.appendChild(link)
//       link.click()
//       link.remove()
//       toast.success('Prescription downloaded')
//     } catch (error) {
//       console.error('Error downloading prescription:', error)
//       toast.error('Failed to download')
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
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <FaFilePrescription /> My Prescriptions
//             </h1>
//             <p className="text-white/80 mt-1">View and download your prescriptions</p>
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : prescriptions.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaFilePrescription className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No prescriptions found</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {prescriptions.map((pres, idx) => (
//                   <motion.div
//                     key={pres._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex flex-wrap justify-between items-start gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                             <FaUserMd className="text-primary-600" />
//                           </div>
//                           <div>
//                             <h3 className="font-semibold text-gray-800">Dr. {pres.doctorId?.userId?.name}</h3>
//                             <p className="text-sm text-gray-500">{pres.doctorId?.specialization}</p>
//                           </div>
//                         </div>
//                         <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//                           <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(pres.createdAt)}</span>
//                           <span>{pres.medicines?.length || 0} medicines</span>
//                           {pres.followUpDate && <span>Follow-up: {formatDate(pres.followUpDate)}</span>}
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="outline" onClick={() => {
//                           setSelectedPrescription(pres)
//                           setShowDetailsModal(true)
//                         }}>
//                           <FaEye /> View
//                         </Button>
//                         <Button size="sm" variant="primary" onClick={() => handleDownload(pres._id)}>
//                           <FaDownload /> Download
//                         </Button>
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
//       <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Prescription Details" size="lg">
//         {selectedPrescription && (
//           <div className="space-y-4">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
//               <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">Medicines</h3>
//               <div className="space-y-2">
//                 {selectedPrescription.medicines?.map((med, idx) => (
//                   <div key={idx} className="border-b pb-2">
//                     <p className="font-medium text-gray-800">{med.name} - {med.dosage}</p>
//                     <p className="text-sm text-gray-500">Frequency: {med.frequency} | Duration: {med.duration}</p>
//                     {med.notes && <p className="text-sm text-gray-500">Note: {med.notes}</p>}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {selectedPrescription.advice && (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-semibold text-gray-800 mb-2">Advice</h3>
//                 <p className="text-gray-700 whitespace-pre-line">{selectedPrescription.advice}</p>
//               </div>
//             )}

//             {selectedPrescription.tests?.length > 0 && (
//               <div>
//                 <h3 className="font-semibold text-gray-800 mb-2">Recommended Tests</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedPrescription.tests.map((test, idx) => (
//                     <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{test}</span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {selectedPrescription.followUpDate && (
//               <p className="text-sm text-primary-600">Follow-up appointment recommended on {formatDate(selectedPrescription.followUpDate)}</p>
//             )}
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default Prescriptions








import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFilePrescription, FaDownload, FaEye, FaCalendarAlt, FaUserMd } from 'react-icons/fa'
import patientService from '../../services/patientService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchPrescriptions ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchPrescriptions = async () => {
      try {
        const response = await patientService.getPrescriptions()
        if (isMounted) {
          setPrescriptions(response.data.prescriptions || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchPrescriptions()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshPrescriptions = async () => {
    try {
      const response = await patientService.getPrescriptions()
      setPrescriptions(response.data.prescriptions || [])
    } catch (error) {
      console.error('Error refreshing prescriptions:', error)
    }
  }

  const handleDownload = async (id) => {
    try {
      const response = await patientService.downloadPrescription(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `prescription_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Prescription downloaded')
    } catch (error) {
      console.error('Error downloading prescription:', error)
      toast.error('Failed to download')
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
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaFilePrescription /> My Prescriptions
            </h1>
            <p className="text-white/80 mt-1">View and download your prescriptions</p>
          </div>

          <div className="p-6">
            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <FaFilePrescription className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No prescriptions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((pres, idx) => (
                  <motion.div
                    key={pres._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <FaUserMd className="text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">Dr. {pres.doctorId?.userId?.name}</h3>
                            <p className="text-sm text-gray-500">{pres.doctorId?.specialization}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(pres.createdAt)}</span>
                          <span>{pres.medicines?.length || 0} medicines</span>
                          {pres.followUpDate && <span>Follow-up: {formatDate(pres.followUpDate)}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedPrescription(pres)
                          setShowDetailsModal(true)
                        }}>
                          <FaEye /> View
                        </Button>
                        <Button size="sm" variant="primary" onClick={() => handleDownload(pres._id)}>
                          <FaDownload /> Download
                        </Button>
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
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Prescription Details" size="lg">
        {selectedPrescription && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
              <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Medicines</h3>
              <div className="space-y-2">
                {selectedPrescription.medicines?.map((med, idx) => (
                  <div key={idx} className="border-b pb-2">
                    <p className="font-medium text-gray-800">{med.name} - {med.dosage}</p>
                    <p className="text-sm text-gray-500">Frequency: {med.frequency} | Duration: {med.duration}</p>
                    {med.notes && <p className="text-sm text-gray-500">Note: {med.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {selectedPrescription.advice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Advice</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedPrescription.advice}</p>
              </div>
            )}

            {selectedPrescription.tests?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recommended Tests</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrescription.tests.map((test, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{test}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedPrescription.followUpDate && (
              <p className="text-sm text-primary-600">Follow-up appointment recommended on {formatDate(selectedPrescription.followUpDate)}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Prescriptions