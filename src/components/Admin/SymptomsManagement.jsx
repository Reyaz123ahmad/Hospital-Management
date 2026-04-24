// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaStethoscope, FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa'
// import symptomService from '../../services/symptomService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import toast from 'react-hot-toast'

// const SymptomsManagement = () => {
//   const [symptoms, setSymptoms] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [selectedSymptom, setSelectedSymptom] = useState(null)
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     displayName: '',
//     description: '',
//     category: 'general',
//     commonCauses: [],
//     homeRemedies: [],
//     whenToSeeDoctor: ''
//   })
//   const [newCause, setNewCause] = useState('')
//   const [newRemedy, setNewRemedy] = useState('')

//   useEffect(() => {
//     fetchSymptoms()
//   }, [])

//   const fetchSymptoms = async () => {
//     try {
//       const response = await symptomService.getAllSymptoms()
//       setSymptoms(response.data.symptoms || [])
//     } catch (error) {
//       console.error('Error fetching symptoms:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const addToList = (list, value, setValue, setList) => {
//     if (value.trim() && !formData[list].includes(value.trim())) {
//       setFormData(prev => ({ ...prev, [list]: [...prev[list], value.trim()] }))
//       setValue('')
//     }
//   }

//   const removeFromList = (list, item) => {
//     setFormData(prev => ({ ...prev, [list]: prev[list].filter(i => i !== item) }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!formData.name || !formData.displayName) {
//       toast.error('Please fill required fields')
//       return
//     }
//     setSubmitting(true)
//     try {
//       await symptomService.createSymptom(formData)
//       toast.success('Symptom created successfully')
//       setShowAddModal(false)
//       resetForm()
//       fetchSymptoms()
//     } catch (error) {
//       console.error('Error creating symptom:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)
//     try {
//       await symptomService.updateSymptom(selectedSymptom._id, formData)
//       toast.success('Symptom updated successfully')
//       setShowEditModal(false)
//       fetchSymptoms()
//     } catch (error) {
//       console.error('Error updating symptom:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this symptom?')) {
//       try {
//         await symptomService.deleteSymptom(id)
//         toast.success('Symptom deleted successfully')
//         fetchSymptoms()
//       } catch (error) {
//         console.error('Error deleting symptom:', error)
//       }
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       name: '', displayName: '', description: '', category: 'general',
//       commonCauses: [], homeRemedies: [], whenToSeeDoctor: ''
//     })
//     setNewCause('')
//     setNewRemedy('')
//   }

//   const editSymptom = (symptom) => {
//     setSelectedSymptom(symptom)
//     setFormData({
//       name: symptom.name,
//       displayName: symptom.displayName,
//       description: symptom.description || '',
//       category: symptom.category || 'general',
//       commonCauses: symptom.commonCauses || [],
//       homeRemedies: symptom.homeRemedies || [],
//       whenToSeeDoctor: symptom.whenToSeeDoctor || ''
//     })
//     setShowEditModal(true)
//   }

//   const filteredSymptoms = symptoms.filter(s =>
//     s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-bold flex items-center gap-2">
//                 <FaStethoscope /> Manage Symptoms
//               </h1>
//               <p className="text-white/80 mt-1">Add, edit, and manage symptoms database</p>
//             </div>
//             <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
//               Add Symptom
//             </Button>
//           </div>

//           <div className="p-6">
//             {/* Search */}
//             <div className="relative mb-6">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search symptoms..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg"
//               />
//             </div>

//             {filteredSymptoms.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaStethoscope className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No symptoms found</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filteredSymptoms.map((symptom, idx) => (
//                   <motion.div
//                     key={symptom._id}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4 hover:shadow-md transition-shadow"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-gray-800">{symptom.displayName}</h3>
//                         <p className="text-sm text-gray-500">{symptom.name}</p>
//                         <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
//                           symptom.category === 'emergency' ? 'bg-red-100 text-red-700' :
//                           symptom.category === 'severe' ? 'bg-orange-100 text-orange-700' :
//                           'bg-green-100 text-green-700'
//                         }`}>
//                           {symptom.category}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="outline" onClick={() => editSymptom(symptom)}>
//                           <FaEdit />
//                         </Button>
//                         <Button size="sm" variant="danger" onClick={() => handleDelete(symptom._id)}>
//                           <FaTrash />
//                         </Button>
//                       </div>
//                     </div>
//                     {symptom.description && (
//                       <p className="text-sm text-gray-600 mt-2 line-clamp-2">{symptom.description}</p>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Add Symptom Modal */}
//       <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm() }} title="Add New Symptom" size="lg">
//         <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug) *</label>
//               <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="chest_pain" className="w-full px-3 py-2 border rounded-lg" required />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
//               <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Chest Pain" className="w-full px-3 py-2 border rounded-lg" required />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
//               <option value="general">General</option>
//               <option value="severe">Severe</option>
//               <option value="emergency">Emergency</option>
//               <option value="chronic">Chronic</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg" />
//           </div>

//           {/* Common Causes */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Common Causes</label>
//             <div className="flex gap-2 mb-2">
//               <input type="text" value={newCause} onChange={(e) => setNewCause(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter cause" />
//               <Button type="button" variant="secondary" size="sm" onClick={() => addToList('commonCauses', newCause, setNewCause)}>Add</Button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.commonCauses.map((cause, i) => (
//                 <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
//                   {cause} <button type="button" onClick={() => removeFromList('commonCauses', cause)} className="text-red-500">×</button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Home Remedies */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Home Remedies</label>
//             <div className="flex gap-2 mb-2">
//               <input type="text" value={newRemedy} onChange={(e) => setNewRemedy(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder="Enter remedy" />
//               <Button type="button" variant="secondary" size="sm" onClick={() => addToList('homeRemedies', newRemedy, setNewRemedy)}>Add</Button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.homeRemedies.map((remedy, i) => (
//                 <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
//                   {remedy} <button type="button" onClick={() => removeFromList('homeRemedies', remedy)} className="text-red-500">×</button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">When to See Doctor</label>
//             <textarea name="whenToSeeDoctor" value={formData.whenToSeeDoctor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="When should the patient consult a doctor?" />
//           </div>

//           <div className="flex gap-3">
//             <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); resetForm() }}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Create Symptom</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Edit Symptom Modal */}
//       <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Symptom" size="lg">
//         <form onSubmit={handleUpdate} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug)</label>
//               <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-gray-100" disabled />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
//               <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
//               <option value="general">General</option>
//               <option value="severe">Severe</option>
//               <option value="emergency">Emergency</option>
//               <option value="chronic">Chronic</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//             <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg" />
//           </div>
//           <div className="flex gap-3">
//             <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Update Symptom</Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default SymptomsManagement




import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStethoscope, FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa'
import symptomService from '../../services/symptomService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const SymptomsManagement = () => {
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    category: 'general',
    commonCauses: [],
    homeRemedies: [],
    whenToSeeDoctor: ''
  })
  const [newCause, setNewCause] = useState('')
  const [newRemedy, setNewRemedy] = useState('')

  // ✅ Cleanup flag ke saath Effect - 100% error free
  useEffect(() => {
    let isMounted = true
    
    const fetchSymptoms = async () => {
      try {
        const response = await symptomService.getAllSymptoms()
        if (isMounted) {
          setSymptoms(response.data.symptoms || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchSymptoms()
    
    return () => {
      isMounted = false
    }
  }, [])

  const refreshSymptoms = async () => {
    try {
      const response = await symptomService.getAllSymptoms()
      setSymptoms(response.data.symptoms || [])
    } catch (error) {
      console.error('Error refreshing symptoms:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addToList = (list, value, setValue, setList) => {
    if (value.trim() && !formData[list].includes(value.trim())) {
      setFormData(prev => ({ ...prev, [list]: [...prev[list], value.trim()] }))
      setValue('')
    }
  }

  const removeFromList = (list, item) => {
    setFormData(prev => ({ ...prev, [list]: prev[list].filter(i => i !== item) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.displayName) {
      toast.error('Please fill required fields')
      return
    }
    setSubmitting(true)
    try {
      await symptomService.createSymptom(formData)
      toast.success('Symptom created successfully')
      setShowAddModal(false)
      resetForm()
      await refreshSymptoms()
    } catch (error) {
      console.error('Error creating symptom:', error)
      toast.error('Failed to create symptom')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await symptomService.updateSymptom(selectedSymptom._id, formData)
      toast.success('Symptom updated successfully')
      setShowEditModal(false)
      await refreshSymptoms()
    } catch (error) {
      console.error('Error updating symptom:', error)
      toast.error('Failed to update symptom')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this symptom?')) {
      try {
        await symptomService.deleteSymptom(id)
        toast.success('Symptom deleted successfully')
        await refreshSymptoms()
      } catch (error) {
        console.error('Error deleting symptom:', error)
        toast.error('Failed to delete symptom')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', displayName: '', description: '', category: 'general',
      commonCauses: [], homeRemedies: [], whenToSeeDoctor: ''
    })
    setNewCause('')
    setNewRemedy('')
  }

  const editSymptom = (symptom) => {
    setSelectedSymptom(symptom)
    setFormData({
      name: symptom.name,
      displayName: symptom.displayName,
      description: symptom.description || '',
      category: symptom.category || 'general',
      commonCauses: symptom.commonCauses || [],
      homeRemedies: symptom.homeRemedies || [],
      whenToSeeDoctor: symptom.whenToSeeDoctor || ''
    })
    setShowEditModal(true)
  }

  const filteredSymptoms = symptoms.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaStethoscope /> Manage Symptoms
              </h1>
              <p className="text-white/80 mt-1">Add, edit, and manage symptoms database</p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
              Add Symptom
            </Button>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {filteredSymptoms.length === 0 ? (
              <div className="text-center py-12">
                <FaStethoscope className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No symptoms found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSymptoms.map((symptom, idx) => (
                  <motion.div
                    key={symptom._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">{symptom.displayName}</h3>
                        <p className="text-sm text-gray-500">{symptom.name}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                          symptom.category === 'emergency' ? 'bg-red-100 text-red-700' :
                          symptom.category === 'severe' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {symptom.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editSymptom(symptom)}>
                          <FaEdit />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(symptom._id)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                    {symptom.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{symptom.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Symptom Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm() }} title="Add New Symptom" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug) *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="chest_pain" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name *</label>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder="Chest Pain" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="general">General</option>
              <option value="severe">Severe</option>
              <option value="emergency">Emergency</option>
              <option value="chronic">Chronic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>

          {/* Common Causes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Common Causes</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newCause} onChange={(e) => setNewCause(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter cause" />
              <Button type="button" variant="secondary" size="sm" onClick={() => addToList('commonCauses', newCause, setNewCause)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.commonCauses.map((cause, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  {cause} <button type="button" onClick={() => removeFromList('commonCauses', cause)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Home Remedies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Remedies</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newRemedy} onChange={(e) => setNewRemedy(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter remedy" />
              <Button type="button" variant="secondary" size="sm" onClick={() => addToList('homeRemedies', newRemedy, setNewRemedy)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.homeRemedies.map((remedy, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                  {remedy} <button type="button" onClick={() => removeFromList('homeRemedies', remedy)} className="text-red-500 hover:text-red-700">×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">When to See Doctor</label>
            <textarea name="whenToSeeDoctor" value={formData.whenToSeeDoctor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="When should the patient consult a doctor?" />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); resetForm() }}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Create Symptom</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Symptom Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Symptom" size="lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (slug)</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-gray-100" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="general">General</option>
              <option value="severe">Severe</option>
              <option value="emergency">Emergency</option>
              <option value="chronic">Chronic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Symptom</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SymptomsManagement