// // src/components/Public/SymptomAnalyzer.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import { 
//   FaHeartbeat, FaStethoscope, FaAmbulance, FaCheckCircle, 
//   FaExclamationTriangle, FaSearch, FaTimes, FaArrowRight,
//   FaUserMd, FaClock, FaCalendarAlt, FaShieldAlt, FaMicroscope,
//   FaClipboardList, FaTemperatureHigh, FaLungs, FaHeadSideVr,
//   FaBrain, FaTooth, FaEye, FaBone, FaChild, FaFemale
// } from 'react-icons/fa'
// import symptomService from '../../services/symptomService'
// import doctorService from '../../services/doctorService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatCurrency } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const SymptomAnalyzer = () => {
//   const navigate = useNavigate()
//   const [symptoms, setSymptoms] = useState([])
//   const [selectedSymptoms, setSelectedSymptoms] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [severity, setSeverity] = useState('mild')
//   const [duration, setDuration] = useState(1)
//   const [age, setAge] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [analyzing, setAnalyzing] = useState(false)
//   const [result, setResult] = useState(null)
//   const [showResults, setShowResults] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [recentSearches, setRecentSearches] = useState([])
  
//   const hasFetched = useRef(false)

//   // Symptom categories with icons
//   const categories = [
//     { id: 'all', name: 'All Symptoms', icon: <FaClipboardList />, color: 'bg-gray-500' },
//     { id: 'emergency', name: 'Emergency', icon: <FaAmbulance />, color: 'bg-red-500' },
//     { id: 'fever', name: 'Fever & Flu', icon: <FaTemperatureHigh />, color: 'bg-orange-500' },
//     { id: 'respiratory', name: 'Respiratory', icon: <FaLungs />, color: 'bg-blue-500' },
//     { id: 'pain', name: 'Pain', icon: <FaHeadSideVr />, color: 'bg-purple-500' },
//     { id: 'digestive', name: 'Digestive', icon: <FaClipboardList />, color: 'bg-green-500' },
//     { id: 'skin', name: 'Skin', icon: <FaClipboardList />, color: 'bg-pink-500' },
//     { id: 'neurological', name: 'Neurological', icon: <FaBrain />, color: 'bg-indigo-500' },
//   ]

//   // Load symptoms on mount
//   useEffect(() => {
//     let isMounted = true
    
//     const fetchSymptoms = async () => {
//       if (hasFetched.current) return
//       hasFetched.current = true
      
//       try {
//         const response = await symptomService.getAllSymptoms()
//         if (isMounted) {
//           setSymptoms(response.data.symptoms || [])
//         }
//       } catch (error) {
//         console.error('Error fetching symptoms:', error)
//         if (isMounted) {
//           toast.error('Failed to load symptoms')
//         }
//       }
//     }
    
//     fetchSymptoms()
    
//     // Load recent searches from localStorage
//     const saved = localStorage.getItem('recentSearches')
//     if (saved && isMounted) {
//       try {
//         setRecentSearches(JSON.parse(saved).slice(0, 5))
//       } catch (e) {}
//     }
    
//     return () => {
//       isMounted = false
//     }
//   }, [])

//   // Save recent searches
//   const saveRecentSearch = useCallback((symptomsList) => {
//     const searchKey = symptomsList.sort().join(',')
//     const newRecent = [searchKey, ...recentSearches.filter(s => s !== searchKey)].slice(0, 5)
//     setRecentSearches(newRecent)
//     localStorage.setItem('recentSearches', JSON.stringify(newRecent))
//   }, [recentSearches])

//   // Filter symptoms by category and search
//   const filteredSymptoms = symptoms.filter(symptom => {
//     const matchesSearch = symptom.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           symptom.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory === 'all' || symptom.category === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const toggleSymptom = (symptomName) => {
//     setSelectedSymptoms(prev =>
//       prev.includes(symptomName)
//         ? prev.filter(s => s !== symptomName)
//         : [...prev, symptomName]
//     )
//   }

//   const clearSelectedSymptoms = () => {
//     setSelectedSymptoms([])
//   }

//   const handleAnalyze = async () => {
//     if (selectedSymptoms.length === 0) {
//       toast.error('Please select at least one symptom')
//       return
//     }

//     setAnalyzing(true)
//     setShowResults(false)
//     setResult(null)

//     try {
//       const response = await symptomService.analyzeSymptoms({
//         symptoms: selectedSymptoms,
//         severity,
//         duration: parseInt(duration),
//         age: parseInt(age) || 30
//       })
      
//       setResult(response.data)
//       setShowResults(true)
//       saveRecentSearch(selectedSymptoms)
      
//       // Scroll to results
//       setTimeout(() => {
//         document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
//       }, 100)
      
//     } catch (error) {
//       console.error('Analysis error:', error)
//       toast.error('Failed to analyze symptoms. Please try again.')
//     } finally {
//       setAnalyzing(false)
//     }
//   }

//   const resetAnalysis = () => {
//     setShowResults(false)
//     setResult(null)
//     setSelectedSymptoms([])
//     setSeverity('mild')
//     setDuration(1)
//     setAge('')
//   }

//   const handleRecentSearch = (search) => {
//     const symptomsList = search.split(',')
//     setSelectedSymptoms(symptomsList)
//     handleAnalyze()
//   }

//   const getSeverityColor = () => {
//     if (result?.isEmergency) return 'bg-red-500'
//     if (severity === 'severe') return 'bg-orange-500'
//     if (severity === 'moderate') return 'bg-yellow-500'
//     return 'bg-green-500'
//   }

//   // Category Card Component
//   const CategoryCard = ({ category }) => (
//     <button
//       onClick={() => setSelectedCategory(category.id)}
//       className={`flex flex-col items-center p-3 rounded-xl transition-all ${
//         selectedCategory === category.id
//           ? `${category.color} text-white shadow-lg scale-105`
//           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//       }`}
//     >
//       <span className="text-xl">{category.icon}</span>
//       <span className="text-xs mt-1 font-medium">{category.name}</span>
//     </button>
//   )

//   // Symptom Tag Component
//   const SymptomTag = ({ symptom }) => (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={() => toggleSymptom(symptom.name)}
//       className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//         selectedSymptoms.includes(symptom.name)
//           ? 'bg-primary-500 text-white shadow-md'
//           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//       }`}
//     >
//       {symptom.displayName}
//     </motion.button>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm mb-4">
//             <FaMicroscope />
//             AI-Powered Medical Assistant
//           </div>
//           <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
//             Symptom Analyzer
//           </h1>
//           <p className="text-gray-500 text-lg max-w-2xl mx-auto">
//             Describe your symptoms and our AI will help identify possible conditions and recommend the right specialist
//           </p>
//         </motion.div>

//         {!showResults ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="max-w-5xl mx-auto"
//           >
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 px-6">
//                 <h2 className="text-white font-semibold flex items-center gap-2">
//                   <FaClipboardList /> Select Your Symptoms
//                 </h2>
//               </div>
              
//               <div className="p-6">
//                 {/* Recent Searches */}
//                 {recentSearches.length > 0 && (
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Recent Searches
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {recentSearches.map((search, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => handleRecentSearch(search)}
//                           className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
//                         >
//                           {search.replace(/,/g, ' + ')}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Categories */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Browse by Category
//                   </label>
//                   <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
//                     {categories.map(cat => (
//                       <CategoryCard key={cat.id} category={cat} />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Input */}
//                 <div className="mb-6">
//                   <div className="relative">
//                     <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search symptoms..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={() => setSearchTerm('')}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <FaTimes />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Symptoms Grid */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-3">
//                     <label className="text-sm font-medium text-gray-700">
//                       Select your symptoms ({selectedSymptoms.length} selected)
//                     </label>
//                     {selectedSymptoms.length > 0 && (
//                       <button
//                         onClick={clearSelectedSymptoms}
//                         className="text-sm text-red-500 hover:text-red-600"
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
                  
//                   {filteredSymptoms.length === 0 ? (
//                     <div className="text-center py-8 bg-gray-50 rounded-xl">
//                       <p className="text-gray-500">No symptoms found</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1">
//                       {filteredSymptoms.map((symptom) => (
//                         <SymptomTag key={symptom._id} symptom={symptom} />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Additional Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Severity
//                     </label>
//                     <div className="flex gap-2">
//                       {['mild', 'moderate', 'severe'].map((level) => (
//                         <button
//                           key={level}
//                           onClick={() => setSeverity(level)}
//                           className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
//                             severity === level
//                               ? level === 'severe'
//                                 ? 'bg-red-500 text-white'
//                                 : level === 'moderate'
//                                 ? 'bg-yellow-500 text-white'
//                                 : 'bg-green-500 text-white'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                           }`}
//                         >
//                           {level}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration (days)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="30"
//                       value={duration}
//                       onChange={(e) => setDuration(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Age (years)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="120"
//                       value={age}
//                       onChange={(e) => setAge(e.target.value)}
//                       placeholder="Enter age"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
//                     />
//                   </div>
//                 </div>

//                 {/* Analyze Button */}
//                 <Button
//                   onClick={handleAnalyze}
//                   variant="primary"
//                   size="lg"
//                   fullWidth
//                   disabled={selectedSymptoms.length === 0 || analyzing}
//                   icon={analyzing ? null : FaArrowRight}
//                 >
//                   {analyzing ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <FaSpinner className="animate-spin" />
//                       Analyzing...
//                     </span>
//                   ) : (
//                     `Analyze Symptoms (${selectedSymptoms.length})`
//                   )}
//                 </Button>

//                 {/* Disclaimer */}
//                 <p className="text-center text-xs text-gray-400 mt-4">
//                   <FaShieldAlt className="inline mr-1" />
//                   This is an AI-powered tool for informational purposes only. Always consult a qualified healthcare provider.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             id="results-section"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-5xl mx-auto"
//           >
//             {/* Emergency Alert */}
//             {result?.isEmergency && (
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg animate-pulse"
//               >
//                 <div className="flex items-start gap-4">
//                   <FaAmbulance className="text-3xl animate-bounce" />
//                   <div>
//                     <h3 className="text-xl font-bold">⚠️ EMERGENCY!</h3>
//                     <p className="mt-1">{result.message || 'Please visit the nearest hospital immediately'}</p>
//                     <div className="mt-3 flex gap-3">
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
//                         📞 Emergency: 108
//                       </span>
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
//                         🚑 Ambulance: 102
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               {/* Results Header */}
//               <div className={`${getSeverityColor()} p-5 text-white`}>
//                 <div className="flex justify-between items-center flex-wrap gap-3">
//                   <div>
//                     <h2 className="text-xl font-semibold">Analysis Results</h2>
//                     <p className="opacity-90 text-sm mt-1">
//                       Based on {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 && 's'}
//                     </p>
//                   </div>
//                   <button
//                     onClick={resetAnalysis}
//                     className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
//                   >
//                     New Analysis
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {/* Selected Symptoms Display */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Symptoms Analyzed</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedSymptoms.map((symptom, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                         {symptom.replace(/_/g, ' ')}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recommended Specializations */}
//                 {result?.recommendedSpecializations?.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <FaStethoscope className="text-primary-500" />
//                       Recommended Specializations
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {result.recommendedSpecializations.map((spec, idx) => (
//                         <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
//                           <div>
//                             <p className="font-medium text-gray-800">{spec.specialization}</p>
//                             {spec.notes && <p className="text-xs text-gray-500 mt-1">{spec.notes}</p>}
//                           </div>
//                           <span className="text-sm text-primary-600 font-semibold">
//                             {spec.matchPercentage}% match
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Recommended Doctors */}
//                 {result?.doctors?.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <FaUserMd className="text-primary-500" />
//                       Recommended Doctors
//                     </h3>
//                     <div className="space-y-3">
//                       {result.doctors.slice(0, 3).map((doctor) => (
//                         <div key={doctor._id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//                               <FaUserMd className="text-primary-600 text-xl" />
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-800">{doctor.userId?.name}</h4>
//                               <p className="text-sm text-gray-500">{doctor.specialization}</p>
//                               <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
//                                 <span>{doctor.experience} years exp</span>
//                                 <span>⭐ {doctor.rating || 'New'}</span>
//                                 <span>₹{doctor.consultationFee}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => navigate(`/doctors/${doctor._id}`)}
//                             className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
//                           >
//                             View Profile
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {result.doctors.length > 3 && (
//                       <p className="text-center text-sm text-gray-500 mt-3">
//                         +{result.doctors.length - 3} more doctors available
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Self-Care Suggestions */}
//                 {result?.suggestions?.length > 0 && (
//                   <div className="mb-6 p-4 bg-blue-50 rounded-xl">
//                     <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
//                       <FaCheckCircle className="text-green-500" />
//                       Self-Care Suggestions
//                     </h3>
//                     <ul className="space-y-2">
//                       {result.suggestions.map((suggestion, idx) => (
//                         <li key={idx} className="flex items-start gap-2 text-gray-700">
//                           <span className="text-blue-500">•</span>
//                           {suggestion}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* When to See Doctor */}
//                 {result?.whenToSeeDoctor && (
//                   <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
//                     <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
//                       <FaClock className="text-yellow-600" />
//                       When to See a Doctor
//                     </h3>
//                     <p className="text-gray-700">{result.whenToSeeDoctor}</p>
//                   </div>
//                 )}

//                 {/* Disclaimer */}
//                 <div className="text-sm text-gray-500 border-t pt-4 mt-4 flex items-start gap-2">
//                   <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
//                   <p>{result?.disclaimer || 'This is an AI suggestion. Please consult a doctor for proper diagnosis and treatment.'}</p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-3 mt-6">
//                   <button
//                     onClick={resetAnalysis}
//                     className="flex-1 px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
//                   >
//                     Analyze Again
//                   </button>
//                   <button
//                     onClick={() => navigate('/doctors')}
//                     className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
//                   >
//                     Browse All Doctors
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SymptomAnalyzer



// // src/components/Public/SymptomAnalyzer.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import { 
//   FaHeartbeat, FaStethoscope, FaAmbulance, FaCheckCircle, 
//   FaExclamationTriangle, FaSearch, FaTimes, FaArrowRight,
//   FaUserMd, FaClock, FaCalendarAlt, FaShieldAlt, FaMicroscope,
//   FaClipboardList, FaTemperatureHigh, FaLungs, FaHeadSideVr,
//   FaBrain, FaTooth, FaEye, FaBone, FaChild, FaFemale, FaSpinner
// } from 'react-icons/fa'
// import symptomService from '../../services/symptomService'
// import doctorService from '../../services/doctorService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatCurrency } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// // ✅ CategoryCard Component - BAHAR
// const CategoryCard = ({ category, selectedCategory, setSelectedCategory }) => (
//   <button
//     onClick={() => setSelectedCategory(category.id)}
//     className={`flex flex-col items-center p-3 rounded-xl transition-all ${
//       selectedCategory === category.id
//         ? `${category.color} text-white shadow-lg scale-105`
//         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//     }`}
//   >
//     <span className="text-xl">{category.icon}</span>
//     <span className="text-xs mt-1 font-medium">{category.name}</span>
//   </button>
// )

// // ✅ SymptomTag Component - BAHAR
// const SymptomTag = ({ symptom, selectedSymptoms, toggleSymptom }) => (
//   <motion.button
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     onClick={() => toggleSymptom(symptom.name)}
//     className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//       selectedSymptoms.includes(symptom.name)
//         ? 'bg-primary-500 text-white shadow-md'
//         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//     }`}
//   >
//     {symptom.displayName}
//   </motion.button>
// )

// const SymptomAnalyzer = () => {
//   const navigate = useNavigate()
//   const [symptoms, setSymptoms] = useState([])
//   const [selectedSymptoms, setSelectedSymptoms] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [severity, setSeverity] = useState('mild')
//   const [duration, setDuration] = useState(1)
//   const [age, setAge] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [analyzing, setAnalyzing] = useState(false)
//   const [result, setResult] = useState(null)
//   const [showResults, setShowResults] = useState(false)
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [recentSearches, setRecentSearches] = useState([])
  
//   const hasFetched = useRef(false)

//   // Symptom categories with icons
//   const categories = [
//     { id: 'all', name: 'All Symptoms', icon: <FaClipboardList />, color: 'bg-gray-500' },
//     { id: 'emergency', name: 'Emergency', icon: <FaAmbulance />, color: 'bg-red-500' },
//     { id: 'fever', name: 'Fever & Flu', icon: <FaTemperatureHigh />, color: 'bg-orange-500' },
//     { id: 'respiratory', name: 'Respiratory', icon: <FaLungs />, color: 'bg-blue-500' },
//     { id: 'pain', name: 'Pain', icon: <FaHeadSideVr />, color: 'bg-purple-500' },
//     { id: 'digestive', name: 'Digestive', icon: <FaClipboardList />, color: 'bg-green-500' },
//     { id: 'skin', name: 'Skin', icon: <FaClipboardList />, color: 'bg-pink-500' },
//     { id: 'neurological', name: 'Neurological', icon: <FaBrain />, color: 'bg-indigo-500' },
//   ]

//   // Load symptoms on mount
//   useEffect(() => {
//     let isMounted = true
    
//     const fetchSymptoms = async () => {
//       if (hasFetched.current) return
//       hasFetched.current = true
      
//       try {
//         const response = await symptomService.getAllSymptoms()
//         if (isMounted) {
//           setSymptoms(response.data.symptoms || [])
//         }
//       } catch (error) {
//         console.error('Error fetching symptoms:', error)
//         if (isMounted) {
//           toast.error('Failed to load symptoms')
//         }
//       }
//     }
    
//     fetchSymptoms()
    
//     // Load recent searches from localStorage
//     const saved = localStorage.getItem('recentSearches')
//     if (saved && isMounted) {
//       try {
//         setRecentSearches(JSON.parse(saved).slice(0, 5))
//       } catch (e) {}
//     }
    
//     return () => {
//       isMounted = false
//     }
//   }, [])

//   // Save recent searches
//   const saveRecentSearch = useCallback((symptomsList) => {
//     const searchKey = symptomsList.sort().join(',')
//     setRecentSearches(prev => {
//       const newRecent = [searchKey, ...prev.filter(s => s !== searchKey)].slice(0, 5)
//       localStorage.setItem('recentSearches', JSON.stringify(newRecent))
//       return newRecent
//     })
//   }, [])

//   // Filter symptoms by category and search
//   const filteredSymptoms = symptoms.filter(symptom => {
//     const matchesSearch = symptom.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           symptom.name?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory === 'all' || symptom.category === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const toggleSymptom = (symptomName) => {
//     setSelectedSymptoms(prev =>
//       prev.includes(symptomName)
//         ? prev.filter(s => s !== symptomName)
//         : [...prev, symptomName]
//     )
//   }

//   const clearSelectedSymptoms = () => {
//     setSelectedSymptoms([])
//   }

//   const handleAnalyze = async () => {
//     if (selectedSymptoms.length === 0) {
//       toast.error('Please select at least one symptom')
//       return
//     }

//     setAnalyzing(true)
//     setShowResults(false)
//     setResult(null)

//     try {
//       const response = await symptomService.analyzeSymptoms({
//         symptoms: selectedSymptoms,
//         severity,
//         duration: parseInt(duration),
//         age: parseInt(age) || 30
//       })
      
//       setResult(response.data)
//       setShowResults(true)
//       saveRecentSearch(selectedSymptoms)
      
//       setTimeout(() => {
//         document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
//       }, 100)
      
//     } catch (error) {
//       console.error('Analysis error:', error)
//       toast.error('Failed to analyze symptoms. Please try again.')
//     } finally {
//       setAnalyzing(false)
//     }
//   }

//   const resetAnalysis = () => {
//     setShowResults(false)
//     setResult(null)
//     setSelectedSymptoms([])
//     setSeverity('mild')
//     setDuration(1)
//     setAge('')
//   }

//   const handleRecentSearch = (search) => {
//     const symptomsList = search.split(',')
//     setSelectedSymptoms(symptomsList)
//     setTimeout(() => handleAnalyze(), 100)
//   }

//   const getSeverityColor = () => {
//     if (result?.isEmergency) return 'bg-red-500'
//     if (severity === 'severe') return 'bg-orange-500'
//     if (severity === 'moderate') return 'bg-yellow-500'
//     return 'bg-green-500'
//   }

//   if (loading) return <LoadingSpinner fullScreen />

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm mb-4">
//             <FaMicroscope />
//             AI-Powered Medical Assistant
//           </div>
//           <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
//             Symptom Analyzer
//           </h1>
//           <p className="text-gray-500 text-lg max-w-2xl mx-auto">
//             Describe your symptoms and our AI will help identify possible conditions and recommend the right specialist
//           </p>
//         </motion.div>

//         {!showResults ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="max-w-5xl mx-auto"
//           >
//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 px-6">
//                 <h2 className="text-white font-semibold flex items-center gap-2">
//                   <FaClipboardList /> Select Your Symptoms
//                 </h2>
//               </div>
              
//               <div className="p-6">
//                 {/* Recent Searches */}
//                 {recentSearches.length > 0 && (
//                   <div className="mb-6">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Recent Searches
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {recentSearches.map((search, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => handleRecentSearch(search)}
//                           className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
//                         >
//                           {search.replace(/,/g, ' + ')}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Categories */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-3">
//                     Browse by Category
//                   </label>
//                   <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
//                     {categories.map(cat => (
//                       <CategoryCard 
//                         key={cat.id} 
//                         category={cat} 
//                         selectedCategory={selectedCategory}
//                         setSelectedCategory={setSelectedCategory}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Search Input */}
//                 <div className="mb-6">
//                   <div className="relative">
//                     <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search symptoms..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={() => setSearchTerm('')}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <FaTimes />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Symptoms Grid */}
//                 <div className="mb-8">
//                   <div className="flex justify-between items-center mb-3">
//                     <label className="text-sm font-medium text-gray-700">
//                       Select your symptoms ({selectedSymptoms.length} selected)
//                     </label>
//                     {selectedSymptoms.length > 0 && (
//                       <button
//                         onClick={clearSelectedSymptoms}
//                         className="text-sm text-red-500 hover:text-red-600"
//                       >
//                         Clear all
//                       </button>
//                     )}
//                   </div>
                  
//                   {filteredSymptoms.length === 0 ? (
//                     <div className="text-center py-8 bg-gray-50 rounded-xl">
//                       <p className="text-gray-500">No symptoms found</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1">
//                       {filteredSymptoms.map((symptom) => (
//                         <SymptomTag 
//                           key={symptom._id} 
//                           symptom={symptom}
//                           selectedSymptoms={selectedSymptoms}
//                           toggleSymptom={toggleSymptom}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Additional Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Severity
//                     </label>
//                     <div className="flex gap-2">
//                       {['mild', 'moderate', 'severe'].map((level) => (
//                         <button
//                           key={level}
//                           onClick={() => setSeverity(level)}
//                           className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
//                             severity === level
//                               ? level === 'severe'
//                                 ? 'bg-red-500 text-white'
//                                 : level === 'moderate'
//                                 ? 'bg-yellow-500 text-white'
//                                 : 'bg-green-500 text-white'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                           }`}
//                         >
//                           {level}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration (days)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="30"
//                       value={duration}
//                       onChange={(e) => setDuration(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Age (years)
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="120"
//                       value={age}
//                       onChange={(e) => setAge(e.target.value)}
//                       placeholder="Enter age"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
//                     />
//                   </div>
//                 </div>

//                 {/* Analyze Button */}
//                 <Button
//                   onClick={handleAnalyze}
//                   variant="primary"
//                   size="lg"
//                   fullWidth
//                   disabled={selectedSymptoms.length === 0 || analyzing}
//                   icon={analyzing ? null : FaArrowRight}
//                 >
//                   {analyzing ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <FaSpinner className="animate-spin" />
//                       Analyzing...
//                     </span>
//                   ) : (
//                     `Analyze Symptoms (${selectedSymptoms.length})`
//                   )}
//                 </Button>

//                 {/* Disclaimer */}
//                 <p className="text-center text-xs text-gray-400 mt-4">
//                   <FaShieldAlt className="inline mr-1" />
//                   This is an AI-powered tool for informational purposes only. Always consult a qualified healthcare provider.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             id="results-section"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-5xl mx-auto"
//           >
//             {/* Emergency Alert */}
//             {result?.isEmergency && (
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg"
//               >
//                 <div className="flex items-start gap-4">
//                   <FaAmbulance className="text-3xl" />
//                   <div>
//                     <h3 className="text-xl font-bold">⚠️ EMERGENCY!</h3>
//                     <p className="mt-1">{result.message || 'Please visit the nearest hospital immediately'}</p>
//                     <div className="mt-3 flex gap-3">
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
//                         📞 Emergency: 108
//                       </span>
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
//                         🚑 Ambulance: 102
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//               {/* Results Header */}
//               <div className={`${getSeverityColor()} p-5 text-white`}>
//                 <div className="flex justify-between items-center flex-wrap gap-3">
//                   <div>
//                     <h2 className="text-xl font-semibold">Analysis Results</h2>
//                     <p className="opacity-90 text-sm mt-1">
//                       Based on {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 && 's'}
//                     </p>
//                   </div>
//                   <button
//                     onClick={resetAnalysis}
//                     className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
//                   >
//                     New Analysis
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {/* Selected Symptoms Display */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-2">Symptoms Analyzed</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedSymptoms.map((symptom, idx) => (
//                       <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                         {symptom.replace(/_/g, ' ')}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recommended Specializations */}
//                 {result?.recommendedSpecializations?.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <FaStethoscope className="text-primary-500" />
//                       Recommended Specializations
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {result.recommendedSpecializations.map((spec, idx) => (
//                         <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
//                           <div>
//                             <p className="font-medium text-gray-800">{spec.specialization}</p>
//                             {spec.notes && <p className="text-xs text-gray-500 mt-1">{spec.notes}</p>}
//                           </div>
//                           <span className="text-sm text-primary-600 font-semibold">
//                             {spec.matchPercentage}% match
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Recommended Doctors */}
//                 {result?.doctors?.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <FaUserMd className="text-primary-500" />
//                       Recommended Doctors
//                     </h3>
//                     <div className="space-y-3">
//                       {result.doctors.slice(0, 3).map((doctor) => (
//                         <div key={doctor._id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all">
//                           <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
//                               <FaUserMd className="text-primary-600 text-xl" />
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-800">{doctor.userId?.name}</h4>
//                               <p className="text-sm text-gray-500">{doctor.specialization}</p>
//                               <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
//                                 <span>{doctor.experience} years exp</span>
//                                 <span>⭐ {doctor.rating || 'New'}</span>
//                                 <span>₹{doctor.consultationFee}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => navigate(`/doctors/${doctor._id}`)}
//                             className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
//                           >
//                             View Profile
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {result.doctors.length > 3 && (
//                       <p className="text-center text-sm text-gray-500 mt-3">
//                         +{result.doctors.length - 3} more doctors available
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {/* Self-Care Suggestions */}
//                 {result?.suggestions?.length > 0 && (
//                   <div className="mb-6 p-4 bg-blue-50 rounded-xl">
//                     <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
//                       <FaCheckCircle className="text-green-500" />
//                       Self-Care Suggestions
//                     </h3>
//                     <ul className="space-y-2">
//                       {result.suggestions.map((suggestion, idx) => (
//                         <li key={idx} className="flex items-start gap-2 text-gray-700">
//                           <span className="text-blue-500">•</span>
//                           {suggestion}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* When to See Doctor */}
//                 {result?.whenToSeeDoctor && (
//                   <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
//                     <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
//                       <FaClock className="text-yellow-600" />
//                       When to See a Doctor
//                     </h3>
//                     <p className="text-gray-700">{result.whenToSeeDoctor}</p>
//                   </div>
//                 )}

//                 {/* Disclaimer */}
//                 <div className="text-sm text-gray-500 border-t pt-4 mt-4 flex items-start gap-2">
//                   <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
//                   <p>{result?.disclaimer || 'This is an AI suggestion. Please consult a doctor for proper diagnosis and treatment.'}</p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-wrap gap-3 mt-6">
//                   <button
//                     onClick={resetAnalysis}
//                     className="flex-1 px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
//                   >
//                     Analyze Again
//                   </button>
//                   <button
//                     onClick={() => navigate('/doctors')}
//                     className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
//                   >
//                     Browse All Doctors
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SymptomAnalyzer



// src/components/Public/SymptomAnalyzer.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FaHeartbeat, FaStethoscope, FaAmbulance, FaCheckCircle, 
  FaExclamationTriangle, FaSearch, FaTimes, FaArrowRight,
  FaUserMd, FaClock, FaCalendarAlt, FaShieldAlt, FaMicroscope,
  FaClipboardList, FaTemperatureHigh, FaLungs, FaBrain,
  FaTooth, FaEye, FaBone, FaChild, FaFemale, FaSpinner
} from 'react-icons/fa'
import symptomService from '../../services/symptomService'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ✅ CategoryCard Component - BAHAR
const CategoryCard = ({ category, selectedCategory, setSelectedCategory }) => (
  <button
    onClick={() => setSelectedCategory(category.id)}
    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
      selectedCategory === category.id
        ? `${category.color} text-white shadow-lg scale-105`
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    <span className="text-xl">{category.icon}</span>
    <span className="text-xs mt-1 font-medium">{category.name}</span>
  </button>
)

// ✅ SymptomTag Component - BAHAR
const SymptomTag = ({ symptom, selectedSymptoms, toggleSymptom }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => toggleSymptom(symptom.name)}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      selectedSymptoms.includes(symptom.name)
        ? 'bg-primary-500 text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {symptom.displayName}
  </motion.button>
)

const SymptomAnalyzer = () => {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [severity, setSeverity] = useState('mild')
  const [duration, setDuration] = useState(1)
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [recentSearches, setRecentSearches] = useState([])
  
  const hasFetched = useRef(false)

  // ✅ Symptom categories with icons - FIXED: FaHeadSideVr hata ke FaBrain lagaya
  const categories = [
    { id: 'all', name: 'All Symptoms', icon: <FaClipboardList />, color: 'bg-gray-500' },
    { id: 'emergency', name: 'Emergency', icon: <FaAmbulance />, color: 'bg-red-500' },
    { id: 'fever', name: 'Fever & Flu', icon: <FaTemperatureHigh />, color: 'bg-orange-500' },
    { id: 'respiratory', name: 'Respiratory', icon: <FaLungs />, color: 'bg-blue-500' },
    { id: 'pain', name: 'Pain', icon: <FaBrain />, color: 'bg-purple-500' },      // ✅ CHANGE YAHAN
    { id: 'digestive', name: 'Digestive', icon: <FaClipboardList />, color: 'bg-green-500' },
    { id: 'skin', name: 'Skin', icon: <FaClipboardList />, color: 'bg-pink-500' },
    { id: 'neurological', name: 'Neurological', icon: <FaBrain />, color: 'bg-indigo-500' },
  ]

  // Load symptoms on mount
  useEffect(() => {
    let isMounted = true
    
    const fetchSymptoms = async () => {
      if (hasFetched.current) return
      hasFetched.current = true
      
      try {
        const response = await symptomService.getAllSymptoms()
        if (isMounted) {
          setSymptoms(response.data.symptoms || [])
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error)
        if (isMounted) {
          toast.error('Failed to load symptoms')
        }
      }
    }
    
    fetchSymptoms()
    
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved && isMounted) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch (e) {}
    }
    
    return () => {
      isMounted = false
    }
  }, [])

  // Save recent searches
  const saveRecentSearch = useCallback((symptomsList) => {
    const searchKey = symptomsList.sort().join(',')
    setRecentSearches(prev => {
      const newRecent = [searchKey, ...prev.filter(s => s !== searchKey)].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
      return newRecent
    })
  }, [])

  // Filter symptoms by category and search
  const filteredSymptoms = symptoms.filter(symptom => {
    const matchesSearch = symptom.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          symptom.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || symptom.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleSymptom = (symptomName) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    )
  }

  const clearSelectedSymptoms = () => {
    setSelectedSymptoms([])
  }

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    setAnalyzing(true)
    setShowResults(false)
    setResult(null)

    try {
      const response = await symptomService.analyzeSymptoms({
        symptoms: selectedSymptoms,
        severity,
        duration: parseInt(duration),
        age: parseInt(age) || 30
      })
      
      setResult(response.data)
      setShowResults(true)
      saveRecentSearch(selectedSymptoms)
      
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze symptoms. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setShowResults(false)
    setResult(null)
    setSelectedSymptoms([])
    setSeverity('mild')
    setDuration(1)
    setAge('')
  }

  const handleRecentSearch = (search) => {
    const symptomsList = search.split(',')
    setSelectedSymptoms(symptomsList)
    setTimeout(() => handleAnalyze(), 100)
  }

  const getSeverityColor = () => {
    if (result?.isEmergency) return 'bg-red-500'
    if (severity === 'severe') return 'bg-orange-500'
    if (severity === 'moderate') return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm mb-4">
            <FaMicroscope />
            AI-Powered Medical Assistant
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Symptom Analyzer
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Describe your symptoms and our AI will help identify possible conditions and recommend the right specialist
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-4 px-6">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FaClipboardList /> Select Your Symptoms
                </h2>
              </div>
              
              <div className="p-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recent Searches
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentSearch(search)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                        >
                          {search.replace(/,/g, ' + ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Browse by Category
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {categories.map(cat => (
                      <CategoryCard 
                        key={cat.id} 
                        category={cat} 
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                      />
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search symptoms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                {/* Symptoms Grid */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Select your symptoms ({selectedSymptoms.length} selected)
                    </label>
                    {selectedSymptoms.length > 0 && (
                      <button
                        onClick={clearSelectedSymptoms}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {filteredSymptoms.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No symptoms found</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-1">
                      {filteredSymptoms.map((symptom) => (
                        <SymptomTag 
                          key={symptom._id} 
                          symptom={symptom}
                          selectedSymptoms={selectedSymptoms}
                          toggleSymptom={toggleSymptom}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <div className="flex gap-2">
                      {['mild', 'moderate', 'severe'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setSeverity(level)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            severity === level
                              ? level === 'severe'
                                ? 'bg-red-500 text-white'
                                : level === 'moderate'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={duration}
                      onChange={(e) => setDuration(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter age"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={selectedSymptoms.length === 0 || analyzing}
                  icon={analyzing ? null : FaArrowRight}
                >
                  {analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    `Analyze Symptoms (${selectedSymptoms.length})`
                  )}
                </Button>

                {/* Disclaimer */}
                <p className="text-center text-xs text-gray-400 mt-4">
                  <FaShieldAlt className="inline mr-1" />
                  This is an AI-powered tool for informational purposes only. Always consult a qualified healthcare provider.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // Results section (same as before, no changes needed)
          <motion.div
            id="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* Emergency Alert */}
            {result?.isEmergency && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <FaAmbulance className="text-3xl" />
                  <div>
                    <h3 className="text-xl font-bold">⚠️ EMERGENCY!</h3>
                    <p className="mt-1">{result.message || 'Please visit the nearest hospital immediately'}</p>
                    <div className="mt-3 flex gap-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
                        📞 Emergency: 108
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full text-sm">
                        🚑 Ambulance: 102
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`${getSeverityColor()} p-5 text-white`}>
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Analysis Results</h2>
                    <p className="opacity-90 text-sm mt-1">
                      Based on {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 && 's'}
                    </p>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Selected Symptoms Display */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Symptoms Analyzed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {symptom.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Specializations */}
                {result?.recommendedSpecializations?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaStethoscope className="text-primary-500" />
                      Recommended Specializations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.recommendedSpecializations.map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-800">{spec.specialization}</p>
                            {spec.notes && <p className="text-xs text-gray-500 mt-1">{spec.notes}</p>}
                          </div>
                          <span className="text-sm text-primary-600 font-semibold">
                            {spec.matchPercentage}% match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Doctors */}
                {result?.doctors?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaUserMd className="text-primary-500" />
                      Recommended Doctors
                    </h3>
                    <div className="space-y-3">
                      {result.doctors.slice(0, 3).map((doctor) => (
                        <div key={doctor._id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                              <FaUserMd className="text-primary-600 text-xl" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{doctor.userId?.name}</h4>
                              <p className="text-sm text-gray-500">{doctor.specialization}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <span>{doctor.experience} years exp</span>
                                <span>⭐ {doctor.rating || 'New'}</span>
                                <span>₹{doctor.consultationFee}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/doctors/${doctor._id}`)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      ))}
                    </div>
                    {result.doctors.length > 3 && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        +{result.doctors.length - 3} more doctors available
                      </p>
                    )}
                  </div>
                )}

                {/* Self-Care Suggestions */}
                {result?.suggestions?.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      Self-Care Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* When to See Doctor */}
                {result?.whenToSeeDoctor && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <FaClock className="text-yellow-600" />
                      When to See a Doctor
                    </h3>
                    <p className="text-gray-700">{result.whenToSeeDoctor}</p>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="text-sm text-gray-500 border-t pt-4 mt-4 flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p>{result?.disclaimer || 'This is an AI suggestion. Please consult a doctor for proper diagnosis and treatment.'}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={resetAnalysis}
                    className="flex-1 px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
                  >
                    Analyze Again
                  </button>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
                  >
                    Browse All Doctors
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default SymptomAnalyzer