// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaTint, FaAllergies, FaUserPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'
// import patientService from '../../services/patientService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import toast from 'react-hot-toast'

// const PatientProfile = () => {
//   const { user, updateProfile } = useAuth()
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({
//     bloodGroup: '',
//     allergies: [],
//     emergencyContact: { name: '', phone: '', relation: '' },
//     dateOfBirth: '',
//     gender: ''
//   })
//   const [newAllergy, setNewAllergy] = useState('')

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await patientService.getProfile()
//       setProfile(response.data.patient)
//       setFormData({
//         bloodGroup: response.data.patient.bloodGroup || '',
//         allergies: response.data.patient.allergies || [],
//         emergencyContact: response.data.patient.emergencyContact || { name: '', phone: '', relation: '' },
//         dateOfBirth: response.data.patient.dateOfBirth?.split('T')[0] || '',
//         gender: response.data.patient.gender || ''
//       })
//     } catch (error) {
//       console.error('Error fetching profile:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.')
//       setFormData(prev => ({
//         ...prev,
//         [parent]: { ...prev[parent], [child]: value }
//       }))
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const addAllergy = () => {
//     if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         allergies: [...prev.allergies, newAllergy.trim()]
//       }))
//       setNewAllergy('')
//     }
//   }

//   const removeAllergy = (allergy) => {
//     setFormData(prev => ({
//       ...prev,
//       allergies: prev.allergies.filter(a => a !== allergy)
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await patientService.updateProfile(formData)
//       await updateProfile({ name: user.name, phone: user.phone })
//       toast.success('Profile updated successfully')
//       setIsEditing(false)
//       fetchProfile()
//     } catch (error) {
//       console.error('Error updating profile:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h1 className="text-2xl font-bold">My Profile</h1>
//                 <p className="text-white/80 mt-1">Manage your personal information</p>
//               </div>
//               {!isEditing ? (
//                 <Button variant="secondary" onClick={() => setIsEditing(true)} icon={FaEdit}>
//                   Edit Profile
//                 </Button>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => setIsEditing(false)} icon={FaTimes}>
//                     Cancel
//                   </Button>
//                   <Button variant="primary" onClick={handleSubmit} icon={FaSave}>
//                     Save
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-6">
//             {/* Basic Info */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaUser className="text-primary-500" /> Basic Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-500">Full Name</p>
//                   <p className="font-medium">{user?.name}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-500">Email</p>
//                   <p className="font-medium">{user?.email}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-500">Phone</p>
//                   {isEditing ? (
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={user?.phone}
//                       onChange={(e) => updateProfile({ phone: e.target.value })}
//                       className="mt-1 w-full px-3 py-1 border rounded"
//                     />
//                   ) : (
//                     <p className="font-medium">{user?.phone}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Medical Info */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaTint className="text-primary-500" /> Medical Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Blood Group</label>
//                   {isEditing ? (
//                     <select
//                       name="bloodGroup"
//                       value={formData.bloodGroup}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     >
//                       <option value="">Select</option>
//                       <option value="A+">A+</option>
//                       <option value="A-">A-</option>
//                       <option value="B+">B+</option>
//                       <option value="B-">B-</option>
//                       <option value="AB+">AB+</option>
//                       <option value="AB-">AB-</option>
//                       <option value="O+">O+</option>
//                       <option value="O-">O-</option>
//                     </select>
//                   ) : (
//                     <p className="font-medium">{formData.bloodGroup || 'Not specified'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
//                   {isEditing ? (
//                     <input
//                       type="date"
//                       name="dateOfBirth"
//                       value={formData.dateOfBirth}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     />
//                   ) : (
//                     <p className="font-medium">{formData.dateOfBirth || 'Not specified'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Gender</label>
//                   {isEditing ? (
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     >
//                       <option value="">Select</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                   ) : (
//                     <p className="font-medium">{formData.gender || 'Not specified'}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Allergies */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaAllergies className="text-primary-500" /> Allergies
//               </h2>
//               {isEditing ? (
//                 <div>
//                   <div className="flex gap-2 mb-3">
//                     <input
//                       type="text"
//                       value={newAllergy}
//                       onChange={(e) => setNewAllergy(e.target.value)}
//                       placeholder="Enter allergy"
//                       className="flex-1 px-3 py-2 border rounded-lg"
//                     />
//                     <Button onClick={addAllergy} variant="secondary" size="sm">Add</Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {formData.allergies.map((allergy, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2">
//                         {allergy}
//                         <button onClick={() => removeAllergy(allergy)} className="hover:text-red-900">×</button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {formData.allergies.length > 0 ? (
//                     formData.allergies.map((allergy, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{allergy}</span>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No allergies recorded</p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Emergency Contact */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaUserPlus className="text-primary-500" /> Emergency Contact
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Name</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="emergencyContact.name"
//                       value={formData.emergencyContact.name}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="Emergency contact name"
//                     />
//                   ) : (
//                     <p className="font-medium">{formData.emergencyContact.name || 'Not added'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Phone</label>
//                   {isEditing ? (
//                     <input
//                       type="tel"
//                       name="emergencyContact.phone"
//                       value={formData.emergencyContact.phone}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="Emergency contact phone"
//                     />
//                   ) : (
//                     <p className="font-medium">{formData.emergencyContact.phone || 'Not added'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Relation</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="emergencyContact.relation"
//                       value={formData.emergencyContact.relation}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="Relation"
//                     />
//                   ) : (
//                     <p className="font-medium">{formData.emergencyContact.relation || 'Not added'}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default PatientProfile








import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaTint, FaAllergies, FaUserPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import patientService from '../../services/patientService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const PatientProfile = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bloodGroup: '',
    allergies: [],
    emergencyContact: { name: '', phone: '', relation: '' },
    dateOfBirth: '',
    gender: ''
  })
  const [newAllergy, setNewAllergy] = useState('')

  // ✅ Cleanup flag ke saath Effect - fetchProfile ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchProfile = async () => {
      try {
        const response = await patientService.getProfile()
        if (isMounted) {
          setProfile(response.data.patient)
          setFormData({
            bloodGroup: response.data.patient.bloodGroup || '',
            allergies: response.data.patient.allergies || [],
            emergencyContact: response.data.patient.emergencyContact || { name: '', phone: '', relation: '' },
            dateOfBirth: response.data.patient.dateOfBirth?.split('T')[0] || '',
            gender: response.data.patient.gender || ''
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchProfile()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshProfile = async () => {
    try {
      const response = await patientService.getProfile()
      setProfile(response.data.patient)
      setFormData({
        bloodGroup: response.data.patient.bloodGroup || '',
        allergies: response.data.patient.allergies || [],
        emergencyContact: response.data.patient.emergencyContact || { name: '', phone: '', relation: '' },
        dateOfBirth: response.data.patient.dateOfBirth?.split('T')[0] || '',
        gender: response.data.patient.gender || ''
      })
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy('')
    }
  }

  const removeAllergy = (allergy) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await patientService.updateProfile(formData)
      await updateProfile({ name: user.name, phone: user.phone })
      toast.success('Profile updated successfully')
      setIsEditing(false)
      await refreshProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
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
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-white/80 mt-1">Manage your personal information</p>
              </div>
              {!isEditing ? (
                <Button variant="secondary" onClick={() => setIsEditing(true)} icon={FaEdit}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} icon={FaTimes}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSubmit} icon={FaSave}>
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-primary-500" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={user?.phone}
                      onChange={(e) => updateProfile({ phone: e.target.value })}
                      className="mt-1 w-full px-3 py-1 border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium">{user?.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTint className="text-primary-500" /> Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Blood Group</label>
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="font-medium">{formData.bloodGroup || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium">{formData.dateOfBirth || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium">{formData.gender || 'Not specified'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaAllergies className="text-primary-500" /> Allergies
              </h2>
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Enter allergy"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Button onClick={addAllergy} variant="secondary" size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2">
                        {allergy}
                        <button onClick={() => removeAllergy(allergy)} className="hover:text-red-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.length > 0 ? (
                    formData.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{allergy}</span>
                    ))
                  ) : (
                    <p className="text-gray-500">No allergies recorded</p>
                  )}
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserPlus className="text-primary-500" /> Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Emergency contact name"
                    />
                  ) : (
                    <p className="font-medium">{formData.emergencyContact.name || 'Not added'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Emergency contact phone"
                    />
                  ) : (
                    <p className="font-medium">{formData.emergencyContact.phone || 'Not added'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Relation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact.relation"
                      value={formData.emergencyContact.relation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Relation"
                    />
                  ) : (
                    <p className="font-medium">{formData.emergencyContact.relation || 'Not added'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PatientProfile