// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaUserMd, FaEnvelope, FaPhone, FaStethoscope, FaGraduationCap, FaBriefcase, FaRupeeSign, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'
// import doctorService from '../../services/doctorService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import toast from 'react-hot-toast'

// const DoctorProfile = () => {
//   const { user } = useAuth()
//   const [profile, setProfile] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({
//     qualification: '',
//     experience: '',
//     consultationFee: '',
//     treatsSymptoms: []
//   })
//   const [newSymptom, setNewSymptom] = useState('')

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const fetchProfile = async () => {
//     try {
//       const response = await doctorService.getById(user?.id)
//       setProfile(response.data.doctor)
//       setFormData({
//         qualification: response.data.doctor.qualification || '',
//         experience: response.data.doctor.experience || '',
//         consultationFee: response.data.doctor.consultationFee || '',
//         treatsSymptoms: response.data.doctor.treatsSymptoms || []
//       })
//     } catch (error) {
//       console.error('Error fetching profile:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const addSymptom = () => {
//     if (newSymptom.trim() && !formData.treatsSymptoms.includes(newSymptom.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         treatsSymptoms: [...prev.treatsSymptoms, newSymptom.trim()]
//       }))
//       setNewSymptom('')
//     }
//   }

//   const removeSymptom = (symptom) => {
//     setFormData(prev => ({
//       ...prev,
//       treatsSymptoms: prev.treatsSymptoms.filter(s => s !== symptom)
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       await doctorService.updateProfile(profile._id, formData)
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
//                 <h1 className="text-2xl font-bold">Doctor Profile</h1>
//                 <p className="text-white/80 mt-1">Manage your professional information</p>
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

//           <div className="p-6">
//             {/* Basic Info */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaUserMd className="text-primary-500" /> Basic Information
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
//                   <p className="font-medium">{user?.phone}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm text-gray-500">Specialization</p>
//                   <p className="font-medium">{profile?.specialization}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Professional Info */}
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaGraduationCap className="text-primary-500" /> Professional Information
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Qualification</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="qualification"
//                       value={formData.qualification}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="e.g., MBBS, MD"
//                     />
//                   ) : (
//                     <p className="font-medium">{profile?.qualification || 'Not specified'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Experience (years)</label>
//                   {isEditing ? (
//                     <input
//                       type="number"
//                       name="experience"
//                       value={formData.experience}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     />
//                   ) : (
//                     <p className="font-medium">{profile?.experience || 0} years</p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500 mb-1">Consultation Fee (₹)</label>
//                   {isEditing ? (
//                     <input
//                       type="number"
//                       name="consultationFee"
//                       value={formData.consultationFee}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-lg"
//                     />
//                   ) : (
//                     <p className="font-medium text-primary-600">₹{profile?.consultationFee}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Treats Symptoms */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaStethoscope className="text-primary-500" /> Treats Symptoms
//               </h2>
//               {isEditing ? (
//                 <div>
//                   <div className="flex gap-2 mb-3">
//                     <input
//                       type="text"
//                       value={newSymptom}
//                       onChange={(e) => setNewSymptom(e.target.value)}
//                       placeholder="Enter symptom (e.g., fever, cough)"
//                       className="flex-1 px-3 py-2 border rounded-lg"
//                     />
//                     <Button onClick={addSymptom} variant="secondary" size="sm">Add</Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {formData.treatsSymptoms.map((symptom, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
//                         {symptom}
//                         <button onClick={() => removeSymptom(symptom)} className="hover:text-green-900">×</button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {profile?.treatsSymptoms?.length > 0 ? (
//                     profile.treatsSymptoms.map((symptom, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{symptom}</span>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No symptoms specified</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default DoctorProfile




import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUserMd, FaEnvelope, FaPhone, FaStethoscope, FaGraduationCap, FaBriefcase, FaRupeeSign, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const DoctorProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    qualification: '',
    experience: '',
    consultationFee: '',
    treatsSymptoms: []
  })
  const [newSymptom, setNewSymptom] = useState('')

  // ✅ Cleanup flag ke saath Effect - fetchProfile ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchProfile = async () => {
      try {
        const response = await doctorService.getById(user?.id)
        if (isMounted) {
          setProfile(response.data.doctor)
          setFormData({
            qualification: response.data.doctor.qualification || '',
            experience: response.data.doctor.experience || '',
            consultationFee: response.data.doctor.consultationFee || '',
            treatsSymptoms: response.data.doctor.treatsSymptoms || []
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
  }, [user?.id])

  const refreshProfile = async () => {
    try {
      const response = await doctorService.getById(user?.id)
      setProfile(response.data.doctor)
      setFormData({
        qualification: response.data.doctor.qualification || '',
        experience: response.data.doctor.experience || '',
        consultationFee: response.data.doctor.consultationFee || '',
        treatsSymptoms: response.data.doctor.treatsSymptoms || []
      })
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSymptom = () => {
    if (newSymptom.trim() && !formData.treatsSymptoms.includes(newSymptom.trim())) {
      setFormData(prev => ({
        ...prev,
        treatsSymptoms: [...prev.treatsSymptoms, newSymptom.trim()]
      }))
      setNewSymptom('')
    }
  }

  const removeSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      treatsSymptoms: prev.treatsSymptoms.filter(s => s !== symptom)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await doctorService.updateProfile(profile._id, formData)
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
                <h1 className="text-2xl font-bold">Doctor Profile</h1>
                <p className="text-white/80 mt-1">Manage your professional information</p>
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

          <div className="p-6">
            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserMd className="text-primary-500" /> Basic Information
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
                  <p className="font-medium">{user?.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium">{profile?.specialization}</p>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-primary-500" /> Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Qualification</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., MBBS, MD"
                    />
                  ) : (
                    <p className="font-medium">{profile?.qualification || 'Not specified'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Experience (years)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium">{profile?.experience || 0} years</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Consultation Fee (₹)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="font-medium text-primary-600">₹{profile?.consultationFee}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Treats Symptoms */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaStethoscope className="text-primary-500" /> Treats Symptoms
              </h2>
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Enter symptom (e.g., fever, cough)"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Button onClick={addSymptom} variant="secondary" size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.treatsSymptoms.map((symptom, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                        {symptom}
                        <button onClick={() => removeSymptom(symptom)} className="hover:text-green-900">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.treatsSymptoms?.length > 0 ? (
                    profile.treatsSymptoms.map((symptom, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{symptom}</span>
                    ))
                  ) : (
                    <p className="text-gray-500">No symptoms specified</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DoctorProfile