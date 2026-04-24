// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaLink, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaExclamationTriangle } from 'react-icons/fa'
// import symptomService from '../../services/symptomService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { SPECIALIZATIONS } from '../../utils/constants'
// import toast from 'react-hot-toast'

// const SymptomMappings = () => {
//   const [mappings, setMappings] = useState([])
//   const [symptoms, setSymptoms] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [selectedMapping, setSelectedMapping] = useState(null)
//   const [submitting, setSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     symptomCombination: [],
//     recommendedSpecializations: [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
//     isEmergency: false,
//     emergencyMessage: '',
//     severityLevel: 'mild',
//     commonInAgeGroup: 'all',
//     requiresImmediateAttention: false,
//     typicalDuration: 'few_days'
//   })

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [mappingsRes, symptomsRes] = await Promise.all([
//         symptomService.getMappings(),
//         symptomService.getAllSymptoms()
//       ])
//       setMappings(mappingsRes.data.mappings || [])
//       setSymptoms(symptomsRes.data.symptoms || [])
//     } catch (error) {
//       console.error('Error fetching data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const toggleSymptom = (symptomName) => {
//     setFormData(prev => ({
//       ...prev,
//       symptomCombination: prev.symptomCombination.includes(symptomName)
//         ? prev.symptomCombination.filter(s => s !== symptomName)
//         : [...prev.symptomCombination, symptomName]
//     }))
//   }

//   const addSpecialization = () => {
//     setFormData(prev => ({
//       ...prev,
//       recommendedSpecializations: [...prev.recommendedSpecializations, { specialization: '', priority: prev.recommendedSpecializations.length + 1, matchPercentage: 100, notes: '' }]
//     }))
//   }

//   const removeSpecialization = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       recommendedSpecializations: prev.recommendedSpecializations.filter((_, i) => i !== index)
//     }))
//   }

//   const updateSpecialization = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       recommendedSpecializations: prev.recommendedSpecializations.map((spec, i) =>
//         i === index ? { ...spec, [field]: value } : spec
//       )
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (formData.symptomCombination.length === 0) {
//       toast.error('Please select at least one symptom')
//       return
//     }
//     if (formData.recommendedSpecializations.length === 0 || !formData.recommendedSpecializations[0].specialization) {
//       toast.error('Please add at least one specialization')
//       return
//     }
//     setSubmitting(true)
//     try {
//       await symptomService.createMapping(formData)
//       toast.success('Symptom mapping created successfully')
//       setShowAddModal(false)
//       resetForm()
//       fetchData()
//     } catch (error) {
//       console.error('Error creating mapping:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)
//     try {
//       await symptomService.updateMapping(selectedMapping._id, formData)
//       toast.success('Mapping updated successfully')
//       setShowEditModal(false)
//       fetchData()
//     } catch (error) {
//       console.error('Error updating mapping:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this mapping?')) {
//       try {
//         await symptomService.deleteMapping(id)
//         toast.success('Mapping deleted successfully')
//         fetchData()
//       } catch (error) {
//         console.error('Error deleting mapping:', error)
//       }
//     }
//   }

//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       await symptomService.toggleMapping(id)
//       toast.success(`Mapping ${currentStatus ? 'deactivated' : 'activated'}`)
//       fetchData()
//     } catch (error) {
//       console.error('Error toggling status:', error)
//     }
//   }

//   const resetForm = () => {
//     setFormData({
//       symptomCombination: [],
//       recommendedSpecializations: [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
//       isEmergency: false,
//       emergencyMessage: '',
//       severityLevel: 'mild',
//       commonInAgeGroup: 'all',
//       requiresImmediateAttention: false,
//       typicalDuration: 'few_days'
//     })
//   }

//   const editMapping = (mapping) => {
//     setSelectedMapping(mapping)
//     setFormData({
//       symptomCombination: mapping.symptomCombination,
//       recommendedSpecializations: mapping.recommendedSpecializations || [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
//       isEmergency: mapping.isEmergency,
//       emergencyMessage: mapping.emergencyMessage || '',
//       severityLevel: mapping.severityLevel,
//       commonInAgeGroup: mapping.commonInAgeGroup,
//       requiresImmediateAttention: mapping.requiresImmediateAttention,
//       typicalDuration: mapping.typicalDuration
//     })
//     setShowEditModal(true)
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
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold flex items-center gap-2">
//                 <FaLink /> Symptom Mappings
//               </h1>
//               <p className="text-white/80 mt-1">Map symptom combinations to doctor specializations</p>
//             </div>
//             <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
//               Add Mapping
//             </Button>
//           </div>

//           <div className="p-6">
//             {mappings.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaLink className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No symptom mappings found</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {mappings.map((mapping, idx) => (
//                   <motion.div
//                     key={mapping._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className={`border rounded-xl p-4 ${mapping.isEmergency ? 'border-red-300 bg-red-50' : ''}`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap mb-2">
//                           {mapping.symptomCombination.map((s, i) => (
//                             <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">{s}</span>
//                           ))}
//                           {mapping.isEmergency && (
//                             <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
//                               <FaExclamationTriangle /> EMERGENCY
//                             </span>
//                           )}
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             mapping.severityLevel === 'critical' ? 'bg-red-100 text-red-700' :
//                             mapping.severityLevel === 'severe' ? 'bg-orange-100 text-orange-700' :
//                             mapping.severityLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
//                             'bg-green-100 text-green-700'
//                           }`}>
//                             {mapping.severityLevel}
//                           </span>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {mapping.recommendedSpecializations?.map((spec, i) => (
//                             <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
//                               {spec.specialization} ({spec.matchPercentage}%)
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => handleToggleStatus(mapping._id, mapping.isActive)} className="text-gray-500 hover:text-primary-600">
//                           {mapping.isActive ? <FaToggleOn size={24} className="text-green-500" /> : <FaToggleOff size={24} />}
//                         </button>
//                         <Button size="sm" variant="outline" onClick={() => editMapping(mapping)}>
//                           <FaEdit />
//                         </Button>
//                         <Button size="sm" variant="danger" onClick={() => handleDelete(mapping._id)}>
//                           <FaTrash />
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

//       {/* Add Mapping Modal */}
//       <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm() }} title="Add Symptom Mapping" size="xl">
//         <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
//           {/* Symptoms Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Select Symptoms *</label>
//             <div className="flex flex-wrap gap-2">
//               {symptoms.map(symptom => (
//                 <button
//                   type="button"
//                   key={symptom._id}
//                   onClick={() => toggleSymptom(symptom.name)}
//                   className={`px-3 py-1 rounded-full text-sm transition-all ${
//                     formData.symptomCombination.includes(symptom.name)
//                       ? 'bg-primary-500 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {symptom.displayName}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Specializations */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Specializations *</label>
//             {formData.recommendedSpecializations.map((spec, idx) => (
//               <div key={idx} className="border rounded-lg p-3 mb-3">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm font-medium">Specialization {idx + 1}</span>
//                   {idx > 0 && (
//                     <button type="button" onClick={() => removeSpecialization(idx)} className="text-red-500 text-sm">Remove</button>
//                   )}
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <select
//                     value={spec.specialization}
//                     onChange={(e) => updateSpecialization(idx, 'specialization', e.target.value)}
//                     className="px-2 py-1 border rounded text-sm"
//                   >
//                     <option value="">Select</option>
//                     {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                   <input
//                     type="number"
//                     placeholder="Priority"
//                     value={spec.priority}
//                     onChange={(e) => updateSpecialization(idx, 'priority', parseInt(e.target.value))}
//                     className="px-2 py-1 border rounded text-sm"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Match %"
//                     value={spec.matchPercentage}
//                     onChange={(e) => updateSpecialization(idx, 'matchPercentage', parseInt(e.target.value))}
//                     className="px-2 py-1 border rounded text-sm"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Notes"
//                     value={spec.notes}
//                     onChange={(e) => updateSpecialization(idx, 'notes', e.target.value)}
//                     className="px-2 py-1 border rounded text-sm"
//                   />
//                 </div>
//               </div>
//             ))}
//             <Button type="button" variant="secondary" size="sm" onClick={addSpecialization}>+ Add Specialization</Button>
//           </div>

//           {/* Emergency Settings */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <input type="checkbox" name="isEmergency" checked={formData.isEmergency} onChange={handleChange} />
//                 Is Emergency
//               </label>
//             </div>
//             <div>
//               <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <input type="checkbox" name="requiresImmediateAttention" checked={formData.requiresImmediateAttention} onChange={handleChange} />
//                 Requires Immediate Attention
//               </label>
//             </div>
//           </div>

//           {formData.isEmergency && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Message</label>
//               <textarea name="emergencyMessage" value={formData.emergencyMessage} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="Emergency instructions..." />
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
//               <select name="severityLevel" value={formData.severityLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
//                 <option value="mild">Mild</option>
//                 <option value="moderate">Moderate</option>
//                 <option value="severe">Severe</option>
//                 <option value="critical">Critical</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Common in Age Group</label>
//               <select name="commonInAgeGroup" value={formData.commonInAgeGroup} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
//                 <option value="all">All</option>
//                 <option value="child">Child</option>
//                 <option value="adult">Adult</option>
//                 <option value="senior">Senior</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Typical Duration</label>
//               <select name="typicalDuration" value={formData.typicalDuration} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
//                 <option value="few_days">Few Days</option>
//                 <option value="one_week">One Week</option>
//                 <option value="two_weeks">Two Weeks</option>
//                 <option value="chronic">Chronic</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); resetForm() }}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Create Mapping</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Edit Mapping Modal */}
//       <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Symptom Mapping" size="xl">
//         <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
//             <div className="flex flex-wrap gap-2">
//               {symptoms.map(symptom => (
//                 <button
//                   type="button"
//                   key={symptom._id}
//                   onClick={() => toggleSymptom(symptom.name)}
//                   className={`px-3 py-1 rounded-full text-sm transition-all ${
//                     formData.symptomCombination.includes(symptom.name)
//                       ? 'bg-primary-500 text-white'
//                       : 'bg-gray-100 text-gray-700'
//                   }`}
//                 >
//                   {symptom.displayName}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
//             {formData.recommendedSpecializations.map((spec, idx) => (
//               <div key={idx} className="border rounded-lg p-3 mb-3">
//                 <div className="grid grid-cols-2 gap-2">
//                   <select value={spec.specialization} onChange={(e) => updateSpecialization(idx, 'specialization', e.target.value)} className="px-2 py-1 border rounded">
//                     {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                   <input type="number" value={spec.priority} onChange={(e) => updateSpecialization(idx, 'priority', parseInt(e.target.value))} className="px-2 py-1 border rounded" />
//                   <input type="number" value={spec.matchPercentage} onChange={(e) => updateSpecialization(idx, 'matchPercentage', parseInt(e.target.value))} className="px-2 py-1 border rounded" />
//                   <input type="text" value={spec.notes} onChange={(e) => updateSpecialization(idx, 'notes', e.target.value)} className="px-2 py-1 border rounded" placeholder="Notes" />
//                 </div>
//               </div>
//             ))}
//             <Button type="button" variant="secondary" size="sm" onClick={addSpecialization}>+ Add</Button>
//           </div>

//           <div className="flex gap-3">
//             <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
//             <Button type="submit" variant="primary" loading={submitting}>Update Mapping</Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   )
// }

// export default SymptomMappings












import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaLink, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaExclamationTriangle } from 'react-icons/fa'
import symptomService from '../../services/symptomService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { SPECIALIZATIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const SymptomMappings = () => {
  const [mappings, setMappings] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMapping, setSelectedMapping] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    symptomCombination: [],
    recommendedSpecializations: [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
    isEmergency: false,
    emergencyMessage: '',
    severityLevel: 'mild',
    commonInAgeGroup: 'all',
    requiresImmediateAttention: false,
    typicalDuration: 'few_days'
  })

  // ✅ Cleanup flag ke saath Effect - 100% error free
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        const [mappingsRes, symptomsRes] = await Promise.all([
          symptomService.getMappings(),
          symptomService.getAllSymptoms()
        ])
        if (isMounted) {
          setMappings(mappingsRes.data.mappings || [])
          setSymptoms(symptomsRes.data.symptoms || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleSymptom = (symptomName) => {
    setFormData(prev => ({
      ...prev,
      symptomCombination: prev.symptomCombination.includes(symptomName)
        ? prev.symptomCombination.filter(s => s !== symptomName)
        : [...prev.symptomCombination, symptomName]
    }))
  }

  const addSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      recommendedSpecializations: [...prev.recommendedSpecializations, { specialization: '', priority: prev.recommendedSpecializations.length + 1, matchPercentage: 100, notes: '' }]
    }))
  }

  const removeSpecialization = (index) => {
    setFormData(prev => ({
      ...prev,
      recommendedSpecializations: prev.recommendedSpecializations.filter((_, i) => i !== index)
    }))
  }

  const updateSpecialization = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      recommendedSpecializations: prev.recommendedSpecializations.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }))
  }

  const refreshData = async () => {
    try {
      const [mappingsRes, symptomsRes] = await Promise.all([
        symptomService.getMappings(),
        symptomService.getAllSymptoms()
      ])
      setMappings(mappingsRes.data.mappings || [])
      setSymptoms(symptomsRes.data.symptoms || [])
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.symptomCombination.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }
    if (formData.recommendedSpecializations.length === 0 || !formData.recommendedSpecializations[0].specialization) {
      toast.error('Please add at least one specialization')
      return
    }
    setSubmitting(true)
    try {
      await symptomService.createMapping(formData)
      toast.success('Symptom mapping created successfully')
      setShowAddModal(false)
      resetForm()
      await refreshData()
    } catch (error) {
      console.error('Error creating mapping:', error)
      toast.error('Failed to create mapping')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await symptomService.updateMapping(selectedMapping._id, formData)
      toast.success('Mapping updated successfully')
      setShowEditModal(false)
      await refreshData()
    } catch (error) {
      console.error('Error updating mapping:', error)
      toast.error('Failed to update mapping')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mapping?')) {
      try {
        await symptomService.deleteMapping(id)
        toast.success('Mapping deleted successfully')
        await refreshData()
      } catch (error) {
        console.error('Error deleting mapping:', error)
        toast.error('Failed to delete mapping')
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await symptomService.toggleMapping(id)
      toast.success(`Mapping ${currentStatus ? 'deactivated' : 'activated'}`)
      await refreshData()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to toggle status')
    }
  }

  const resetForm = () => {
    setFormData({
      symptomCombination: [],
      recommendedSpecializations: [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
      isEmergency: false,
      emergencyMessage: '',
      severityLevel: 'mild',
      commonInAgeGroup: 'all',
      requiresImmediateAttention: false,
      typicalDuration: 'few_days'
    })
  }

  const editMapping = (mapping) => {
    setSelectedMapping(mapping)
    setFormData({
      symptomCombination: mapping.symptomCombination,
      recommendedSpecializations: mapping.recommendedSpecializations || [{ specialization: '', priority: 1, matchPercentage: 100, notes: '' }],
      isEmergency: mapping.isEmergency,
      emergencyMessage: mapping.emergencyMessage || '',
      severityLevel: mapping.severityLevel,
      commonInAgeGroup: mapping.commonInAgeGroup,
      requiresImmediateAttention: mapping.requiresImmediateAttention,
      typicalDuration: mapping.typicalDuration
    })
    setShowEditModal(true)
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
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaLink /> Symptom Mappings
              </h1>
              <p className="text-white/80 mt-1">Map symptom combinations to doctor specializations</p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
              Add Mapping
            </Button>
          </div>

          <div className="p-6">
            {mappings.length === 0 ? (
              <div className="text-center py-12">
                <FaLink className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No symptom mappings found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mappings.map((mapping, idx) => (
                  <motion.div
                    key={mapping._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border rounded-xl p-4 ${mapping.isEmergency ? 'border-red-300 bg-red-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {mapping.symptomCombination.map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">{s}</span>
                          ))}
                          {mapping.isEmergency && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                              <FaExclamationTriangle /> EMERGENCY
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            mapping.severityLevel === 'critical' ? 'bg-red-100 text-red-700' :
                            mapping.severityLevel === 'severe' ? 'bg-orange-100 text-orange-700' :
                            mapping.severityLevel === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {mapping.severityLevel}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mapping.recommendedSpecializations?.map((spec, i) => (
                            <span key={i} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                              {spec.specialization} ({spec.matchPercentage}%)
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleStatus(mapping._id, mapping.isActive)} className="text-gray-500 hover:text-primary-600">
                          {mapping.isActive ? <FaToggleOn size={24} className="text-green-500" /> : <FaToggleOff size={24} />}
                        </button>
                        <Button size="sm" variant="outline" onClick={() => editMapping(mapping)}>
                          <FaEdit />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(mapping._id)}>
                          <FaTrash />
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

      {/* Add Mapping Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm() }} title="Add Symptom Mapping" size="xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Symptoms Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Symptoms *</label>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <button
                  type="button"
                  key={symptom._id}
                  onClick={() => toggleSymptom(symptom.name)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    formData.symptomCombination.includes(symptom.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {symptom.displayName}
                </button>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Specializations *</label>
            {formData.recommendedSpecializations.map((spec, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Specialization {idx + 1}</span>
                  {idx > 0 && (
                    <button type="button" onClick={() => removeSpecialization(idx)} className="text-red-500 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={spec.specialization}
                    onChange={(e) => updateSpecialization(idx, 'specialization', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="">Select</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="Priority"
                    value={spec.priority}
                    onChange={(e) => updateSpecialization(idx, 'priority', parseInt(e.target.value))}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Match %"
                    value={spec.matchPercentage}
                    onChange={(e) => updateSpecialization(idx, 'matchPercentage', parseInt(e.target.value))}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={spec.notes}
                    onChange={(e) => updateSpecialization(idx, 'notes', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addSpecialization}>+ Add Specialization</Button>
          </div>

          {/* Emergency Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" name="isEmergency" checked={formData.isEmergency} onChange={handleChange} />
                Is Emergency
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input type="checkbox" name="requiresImmediateAttention" checked={formData.requiresImmediateAttention} onChange={handleChange} />
                Requires Immediate Attention
              </label>
            </div>
          </div>

          {formData.isEmergency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Message</label>
              <textarea name="emergencyMessage" value={formData.emergencyMessage} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg" placeholder="Emergency instructions..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level</label>
              <select name="severityLevel" value={formData.severityLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Common in Age Group</label>
              <select name="commonInAgeGroup" value={formData.commonInAgeGroup} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="all">All</option>
                <option value="child">Child</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typical Duration</label>
              <select name="typicalDuration" value={formData.typicalDuration} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                <option value="few_days">Few Days</option>
                <option value="one_week">One Week</option>
                <option value="two_weeks">Two Weeks</option>
                <option value="chronic">Chronic</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => { setShowAddModal(false); resetForm() }}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Create Mapping</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Mapping Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Symptom Mapping" size="xl">
        <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <button
                  type="button"
                  key={symptom._id}
                  onClick={() => toggleSymptom(symptom.name)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    formData.symptomCombination.includes(symptom.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {symptom.displayName}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
            {formData.recommendedSpecializations.map((spec, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <select value={spec.specialization} onChange={(e) => updateSpecialization(idx, 'specialization', e.target.value)} className="px-2 py-1 border rounded">
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="number" value={spec.priority} onChange={(e) => updateSpecialization(idx, 'priority', parseInt(e.target.value))} className="px-2 py-1 border rounded" />
                  <input type="number" value={spec.matchPercentage} onChange={(e) => updateSpecialization(idx, 'matchPercentage', parseInt(e.target.value))} className="px-2 py-1 border rounded" />
                  <input type="text" value={spec.notes} onChange={(e) => updateSpecialization(idx, 'notes', e.target.value)} className="px-2 py-1 border rounded" placeholder="Notes" />
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addSpecialization}>+ Add</Button>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Mapping</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default SymptomMappings