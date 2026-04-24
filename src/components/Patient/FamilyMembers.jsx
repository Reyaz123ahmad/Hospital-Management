// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaUsers, FaUserPlus, FaUserCircle, FaTrash, FaEdit } from 'react-icons/fa'
// import patientService from '../../services/patientService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import toast from 'react-hot-toast'

// const FamilyMembers = () => {
//   const [familyMembers, setFamilyMembers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     relation: '',
//     age: '',
//     medicalHistory: ''
//   })
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchFamilyMembers()
//   }, [])

//   const fetchFamilyMembers = async () => {
//     try {
//       const response = await patientService.getFamilyMembers()
//       setFamilyMembers(response.data.familyMembers || [])
//     } catch (error) {
//       console.error('Error fetching family members:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!formData.name || !formData.relation) {
//       toast.error('Please fill name and relation')
//       return
//     }
//     setSubmitting(true)
//     try {
//       await patientService.addFamilyMember(formData)
//       toast.success('Family member added')
//       setShowAddModal(false)
//       setFormData({ name: '', relation: '', age: '', medicalHistory: '' })
//       fetchFamilyMembers()
//     } catch (error) {
//       console.error('Error adding family member:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const relations = ['Father', 'Mother', 'Spouse', 'Child', 'Sibling', 'Grandparent', 'Other']

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
//                 <FaUsers /> Family Members
//               </h1>
//               <p className="text-white/80 mt-1">Manage your family members for easy booking</p>
//             </div>
//             <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaUserPlus}>
//               Add Member
//             </Button>
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : familyMembers.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No family members added yet</p>
//                 <Button onClick={() => setShowAddModal(true)} className="mt-4">Add Family Member</Button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {familyMembers.map((member, idx) => (
//                   <motion.div
//                     key={idx}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex items-start gap-3">
//                       <FaUserCircle className="text-3xl text-primary-500" />
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-800">{member.name}</h3>
//                         <p className="text-sm text-gray-500">{member.relation}</p>
//                         {member.age && <p className="text-sm text-gray-500">Age: {member.age}</p>}
//                         {member.medicalHistory && (
//                           <p className="text-sm text-gray-600 mt-2">{member.medicalHistory}</p>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Add Family Member Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Family Member">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               placeholder="Enter full name"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
//             <select
//               name="relation"
//               value={formData.relation}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="">Select relation</option>
//               {relations.map(rel => (
//                 <option key={rel} value={rel}>{rel}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               placeholder="Age"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Medical History (Optional)</label>
//             <textarea
//               name="medicalHistory"
//               value={formData.medicalHistory}
//               onChange={handleChange}
//               rows="2"
//               className="w-full px-3 py-2 border rounded-lg resize-none"
//               placeholder="Any known medical conditions, allergies, etc."
//             />
//           </div>
//           <div className="flex gap-3">
//             <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Add Member</Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default FamilyMembers











import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaUserPlus, FaUserCircle, FaTrash, FaEdit } from 'react-icons/fa'
import patientService from '../../services/patientService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const FamilyMembers = () => {
  const [familyMembers, setFamilyMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    age: '',
    medicalHistory: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchFamilyMembers ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchFamilyMembers = async () => {
      try {
        const response = await patientService.getFamilyMembers()
        if (isMounted) {
          setFamilyMembers(response.data.familyMembers || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching family members:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchFamilyMembers()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshFamilyMembers = async () => {
    try {
      const response = await patientService.getFamilyMembers()
      setFamilyMembers(response.data.familyMembers || [])
    } catch (error) {
      console.error('Error refreshing family members:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.relation) {
      toast.error('Please fill name and relation')
      return
    }
    setSubmitting(true)
    try {
      await patientService.addFamilyMember(formData)
      toast.success('Family member added')
      setShowAddModal(false)
      setFormData({ name: '', relation: '', age: '', medicalHistory: '' })
      await refreshFamilyMembers()
    } catch (error) {
      console.error('Error adding family member:', error)
      toast.error('Failed to add family member')
    } finally {
      setSubmitting(false)
    }
  }

  const relations = ['Father', 'Mother', 'Spouse', 'Child', 'Sibling', 'Grandparent', 'Other']

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
                <FaUsers /> Family Members
              </h1>
              <p className="text-white/80 mt-1">Manage your family members for easy booking</p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaUserPlus}>
              Add Member
            </Button>
          </div>

          <div className="p-6">
            {familyMembers.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No family members added yet</p>
                <Button onClick={() => setShowAddModal(true)} className="mt-4">Add Family Member</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyMembers.map((member, idx) => (
                  <motion.div
                    key={member._id || idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <FaUserCircle className="text-3xl text-primary-500" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.relation}</p>
                        {member.age && <p className="text-sm text-gray-500">Age: {member.age}</p>}
                        {member.medicalHistory && (
                          <p className="text-sm text-gray-600 mt-2">{member.medicalHistory}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Family Member Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Family Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select relation</option>
              {relations.map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical History (Optional)</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Any known medical conditions, allergies, etc."
            />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default FamilyMembers