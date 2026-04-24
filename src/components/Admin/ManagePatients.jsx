// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaUsers, FaEye, FaUserCircle, FaEnvelope, FaPhone, FaTint, FaCalendarAlt } from 'react-icons/fa'
// import adminService from '../../services/adminService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate, formatCurrency } from '../../utils/helpers'

// const ManagePatients = () => {
//   const [patients, setPatients] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedPatient, setSelectedPatient] = useState(null)
//   const [showViewModal, setShowViewModal] = useState(false)

//   useEffect(() => {
//     fetchPatients()
//   }, [])

//   const fetchPatients = async () => {
//     try {
//       const response = await adminService.getPatients()
//       setPatients(response.data.patients || [])
//     } catch (error) {
//       console.error('Error fetching patients:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleView = (patient) => {
//     setSelectedPatient(patient)
//     setShowViewModal(true)
//   }

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <FaUsers /> Manage Patients
//             </h1>
//             <p className="text-white/80 mt-1">View and manage patient information</p>
//           </div>

//           <div className="p-6">
//             {patients.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No patients found</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Blood Group</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Registered On</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {patients.map((patient, idx) => (
//                       <motion.tr
//                         key={patient._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.05 }}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
//                               <FaUserCircle className="text-primary-600 text-xl" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">{patient.userId?.name}</p>
//                               <p className="text-xs text-gray-500">ID: {patient.userId?._id?.slice(-6)}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="text-sm text-gray-600 flex items-center gap-1"><FaEnvelope size={12} /> {patient.userId?.email}</p>
//                           <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FaPhone size={12} /> {patient.userId?.phone}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
//                             {patient.bloodGroup || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-500">
//                           {formatDate(patient.createdAt)}
//                         </td>
//                         <td className="px-4 py-3">
//                           <Button size="sm" variant="outline" onClick={() => handleView(patient)}>
//                             <FaEye /> View Details
//                           </Button>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* View Patient Modal */}
//       <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Patient Details" size="lg">
//         {selectedPatient && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-4 pb-4 border-b">
//               <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
//                 {selectedPatient.userId?.name?.charAt(0)}
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">{selectedPatient.userId?.name}</h2>
//                 <p className="text-gray-500">Patient ID: {selectedPatient.userId?._id}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{selectedPatient.userId?.email}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="font-medium">{selectedPatient.userId?.phone}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Blood Group</p>
//                 <p className="font-medium">{selectedPatient.bloodGroup || 'Not specified'}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Gender</p>
//                 <p className="font-medium">{selectedPatient.gender || 'Not specified'}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Date of Birth</p>
//                 <p className="font-medium">{selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'Not specified'}</p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-sm text-gray-500">Registered On</p>
//                 <p className="font-medium">{formatDate(selectedPatient.createdAt)}</p>
//               </div>
//             </div>

//             {selectedPatient.allergies?.length > 0 && (
//               <div>
//                 <p className="text-sm font-medium text-gray-700 mb-1">Allergies</p>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedPatient.allergies.map((allergy, i) => (
//                     <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">{allergy}</span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {selectedPatient.emergencyContact?.name && (
//               <div className="bg-yellow-50 p-3 rounded-lg">
//                 <p className="text-sm font-medium text-yellow-800 mb-1">Emergency Contact</p>
//                 <p className="text-sm"><strong>Name:</strong> {selectedPatient.emergencyContact.name}</p>
//                 <p className="text-sm"><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</p>
//                 <p className="text-sm"><strong>Relation:</strong> {selectedPatient.emergencyContact.relation}</p>
//               </div>
//             )}

//             {selectedPatient.medicalHistory?.length > 0 && (
//               <div>
//                 <p className="text-sm font-medium text-gray-700 mb-1">Medical History</p>
//                 <div className="space-y-2">
//                   {selectedPatient.medicalHistory.map((history, i) => (
//                     <div key={i} className="p-2 bg-gray-50 rounded-lg">
//                       <p className="font-medium">{history.disease}</p>
//                       {history.diagnosedDate && <p className="text-xs text-gray-500">Diagnosed: {formatDate(history.diagnosedDate)}</p>}
//                       {history.notes && <p className="text-sm text-gray-600 mt-1">{history.notes}</p>}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default ManagePatients


import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaEye, FaUserCircle, FaEnvelope, FaPhone, FaTint, FaCalendarAlt } from 'react-icons/fa'
import adminService from '../../services/adminService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'

const ManagePatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  // ✅ Cleanup flag ke saath Effect - 100% error free
  useEffect(() => {
    let isMounted = true
    
    const fetchPatients = async () => {
      try {
        const response = await adminService.getPatients()
        if (isMounted) {
          setPatients(response.data.patients || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching patients:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchPatients()
    
    return () => {
      isMounted = false
    }
  }, [])

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

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
              <FaUsers /> Manage Patients
            </h1>
            <p className="text-white/80 mt-1">View and manage patient information</p>
          </div>

          <div className="p-6">
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No patients found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Blood Group</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Registered On</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {patients.map((patient, idx) => (
                      <motion.tr
                        key={patient._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <FaUserCircle className="text-primary-600 text-xl" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{patient.userId?.name}</p>
                              <p className="text-xs text-gray-500">ID: {patient.userId?._id?.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600 flex items-center gap-1"><FaEnvelope size={12} /> {patient.userId?.email}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FaPhone size={12} /> {patient.userId?.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {patient.bloodGroup || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(patient.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => handleView(patient)}>
                            <FaEye /> View Details
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* View Patient Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Patient Details" size="lg">
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                {selectedPatient.userId?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedPatient.userId?.name}</h2>
                <p className="text-gray-500">Patient ID: {selectedPatient.userId?._id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedPatient.userId?.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedPatient.userId?.phone}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium">{selectedPatient.bloodGroup || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{selectedPatient.gender || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'Not specified'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Registered On</p>
                <p className="font-medium">{formatDate(selectedPatient.createdAt)}</p>
              </div>
            </div>

            {selectedPatient.allergies?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies.map((allergy, i) => (
                    <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">{allergy}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedPatient.emergencyContact?.name && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-1">Emergency Contact</p>
                <p className="text-sm"><strong>Name:</strong> {selectedPatient.emergencyContact.name}</p>
                <p className="text-sm"><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</p>
                <p className="text-sm"><strong>Relation:</strong> {selectedPatient.emergencyContact.relation}</p>
              </div>
            )}

            {selectedPatient.medicalHistory?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Medical History</p>
                <div className="space-y-2">
                  {selectedPatient.medicalHistory.map((history, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-medium">{history.disease}</p>
                      {history.diagnosedDate && <p className="text-xs text-gray-500">Diagnosed: {formatDate(history.diagnosedDate)}</p>}
                      {history.notes && <p className="text-sm text-gray-600 mt-1">{history.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ManagePatients