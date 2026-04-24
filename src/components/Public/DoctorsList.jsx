// // src/components/Public/DoctorsList.jsx
// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { 
//   FaStar, FaStarHalfAlt, FaRegStar, FaStethoscope, FaFilter, FaSearch, 
//   FaTimes, FaRupeeSign, FaBriefcase, FaMapMarkerAlt, FaChevronLeft, 
//   FaChevronRight, FaUserMd, FaClock, FaHeartbeat, FaSpinner 
// } from 'react-icons/fa'
// import doctorService from '../../services/doctorService'
// import { SPECIALIZATIONS } from '../../utils/constants'

// const DoctorsList = () => {
//   const [doctors, setDoctors] = useState([])
//   const [filteredDoctors, setFilteredDoctors] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [showFilters, setShowFilters] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [viewMode, setViewMode] = useState('grid') // grid or list
//   const doctorsPerPage = 9

//   // Filter states
//   const [filters, setFilters] = useState({
//     specialization: '',
//     minExperience: '',
//     maxFee: '',
//     minRating: '',
//     availability: true
//   })

//   // Available specializations with counts
//   const [specializationCounts, setSpecializationCounts] = useState({})

//   useEffect(() => {
//     fetchDoctors()
//   }, [])

//   useEffect(() => {
//     filterDoctors()
//   }, [doctors, searchTerm, filters])

//   const fetchDoctors = async () => {
//     setLoading(true)
//     try {
//       const response = await doctorService.getDoctors()
//       const doctorsList = response.data.doctors || []
//       setDoctors(doctorsList)
//       setFilteredDoctors(doctorsList)
      
//       // Calculate specialization counts
//       const counts = {}
//       doctorsList.forEach(doc => {
//         const spec = doc.specialization
//         counts[spec] = (counts[spec] || 0) + 1
//       })
//       setSpecializationCounts(counts)
//     } catch (error) {
//       console.error('Error fetching doctors:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterDoctors = () => {
//     let filtered = [...doctors]

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(doctor =>
//         doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Specialization filter
//     if (filters.specialization) {
//       filtered = filtered.filter(doctor => doctor.specialization === filters.specialization)
//     }

//     // Experience filter
//     if (filters.minExperience) {
//       filtered = filtered.filter(doctor => doctor.experience >= parseInt(filters.minExperience))
//     }

//     // Fee filter
//     if (filters.maxFee) {
//       filtered = filtered.filter(doctor => doctor.consultationFee <= parseInt(filters.maxFee))
//     }

//     // Rating filter
//     if (filters.minRating) {
//       filtered = filtered.filter(doctor => (doctor.rating || 0) >= parseInt(filters.minRating))
//     }

//     // Availability filter
//     if (filters.availability) {
//       filtered = filtered.filter(doctor => doctor.isAvailable !== false)
//     }

//     setFilteredDoctors(filtered)
//     setCurrentPage(1)
//   }

//   const clearFilters = () => {
//     setFilters({
//       specialization: '',
//       minExperience: '',
//       maxFee: '',
//       minRating: '',
//       availability: true
//     })
//     setSearchTerm('')
//   }

//   const hasActiveFilters = () => {
//     return filters.specialization || filters.minExperience || filters.maxFee || filters.minRating || searchTerm
//   }

//   // Pagination
//   const indexOfLastDoctor = currentPage * doctorsPerPage
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
//   const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
//   const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

//   const paginate = (pageNumber) => setCurrentPage(pageNumber)

//   // Star Rating Component
//   const StarRating = ({ rating, size = 'text-sm' }) => {
//     const fullStars = Math.floor(rating || 0)
//     const hasHalfStar = (rating || 0) % 1 >= 0.5
//     return (
//       <div className="flex items-center gap-0.5">
//         {[...Array(fullStars)].map((_, i) => (
//           <FaStar key={i} className={`${size} text-yellow-400`} />
//         ))}
//         {hasHalfStar && <FaStarHalfAlt className={`${size} text-yellow-400`} />}
//         {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
//           <FaRegStar key={i} className={`${size} text-gray-300`} />
//         ))}
//         <span className="ml-1 text-gray-600 text-xs">({rating?.toFixed(1) || 'New'})</span>
//       </div>
//     )
//   }

//   // Doctor Card Component
//   const DoctorCard = ({ doctor, index }) => {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: index * 0.05 }}
//         whileHover={{ y: -8 }}
//         className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
//       >
//         {/* Card Header with Gradient */}
//         <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-700">
//           <div className="absolute -bottom-10 left-4">
//             <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
//               <span className="text-2xl font-bold text-primary-600">
//                 {doctor.userId?.name?.charAt(0) || 'D'}
//               </span>
//             </div>
//           </div>
//           {doctor.rating >= 4.5 && (
//             <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//               <FaStar size={10} /> Top Rated
//             </div>
//           )}
//         </div>

//         {/* Card Body */}
//         <div className="pt-12 p-4">
//           <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
//             {doctor.userId?.name}
//           </h3>
//           <p className="text-primary-600 text-sm font-medium flex items-center gap-1 mt-1">
//             <FaStethoscope size={12} />
//             {doctor.specialization}
//           </p>
          
//           <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
//             <span className="flex items-center gap-1">
//               <FaBriefcase size={12} />
//               {doctor.experience}yrs
//             </span>
//             <span className="flex items-center gap-1">
//               <FaRupeeSign size={12} />
//               {doctor.consultationFee}
//             </span>
//           </div>

//           <div className="mt-2">
//             <StarRating rating={doctor.rating} />
//           </div>

//           {doctor.clinicAddress && (
//             <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 truncate">
//               <FaMapMarkerAlt size={10} />
//               {doctor.clinicAddress.substring(0, 40)}...
//             </p>
//           )}

//           <Link to={`/doctors/${doctor._id}`}>
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full mt-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
//             >
//               View Profile
//             </motion.button>
//           </Link>
//         </div>
//       </motion.div>
//     )
//   }

//   // List View Component
//   const DoctorListItem = ({ doctor, index }) => {
//     return (
//       <motion.div
//         initial={{ opacity: 0, x: -30 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: index * 0.05 }}
//         whileHover={{ x: 5 }}
//         className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
//       >
//         <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
//           {/* Avatar */}
//           <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
//             {doctor.userId?.name?.charAt(0) || 'D'}
//           </div>
          
//           {/* Info */}
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <h3 className="text-lg font-bold text-gray-800">{doctor.userId?.name}</h3>
//               <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
//                 {doctor.specialization}
//               </span>
//               {doctor.rating >= 4.5 && (
//                 <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
//                   <FaStar size={10} /> Top Rated
//                 </span>
//               )}
//             </div>
//             <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
//               <span className="flex items-center gap-1"><FaBriefcase size={12} /> {doctor.experience} years exp</span>
//               <span className="flex items-center gap-1"><FaRupeeSign size={12} /> ₹{doctor.consultationFee}</span>
//               <StarRating rating={doctor.rating} size="text-xs" />
//             </div>
//             {doctor.qualification && (
//               <p className="text-xs text-gray-400 mt-1">📚 {doctor.qualification}</p>
//             )}
//           </div>
          
//           {/* Action Button */}
//           <Link to={`/doctors/${doctor._id}`}>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors whitespace-nowrap"
//             >
//               Book Now
//             </motion.button>
//           </Link>
//         </div>
//       </motion.div>
//     )
//   }

//   // Loading Skeleton
//   const LoadingSkeleton = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {[...Array(6)].map((_, i) => (
//         <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
//           <div className="h-32 bg-gray-200"></div>
//           <div className="p-4">
//             <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//             <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//             <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
//             Find the Right Doctor
//           </h1>
//           <p className="text-gray-500 max-w-2xl mx-auto">
//             Browse through our network of 500+ experienced doctors across 30+ specializations
//           </p>
//         </motion.div>

//         {/* Search and Filter Bar */}
//         <div className="mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Input */}
//             <div className="flex-1 relative">
//               <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by doctor name, specialization, or qualification..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <FaTimes />
//                 </button>
//               )}
//             </div>

//             {/* View Toggle */}
//             <div className="flex bg-gray-200 rounded-xl p-1">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                   viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500'
//                 }`}
//               >
//                 Grid
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                   viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500'
//                 }`}
//               >
//                 List
//               </button>
//             </div>

//             {/* Filter Toggle Button */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
//                 showFilters || hasActiveFilters()
//                   ? 'bg-primary-500 text-white shadow-md'
//                   : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <FaFilter />
//               Filters
//               {hasActiveFilters() && (
//                 <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {Object.values(filters).filter(v => v).length + (searchTerm ? 1 : 0)}
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* Filters Panel */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="mt-4 bg-white rounded-xl shadow-lg p-5 overflow-hidden"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                   {/* Specialization Filter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Specialization
//                     </label>
//                     <select
//                       value={filters.specialization}
//                       onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
//                     >
//                       <option value="">All ({doctors.length})</option>
//                       {SPECIALIZATIONS.map(spec => (
//                         <option key={spec} value={spec}>
//                           {spec} ({specializationCounts[spec] || 0})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Experience Filter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Min Experience (years)
//                     </label>
//                     <select
//                       value={filters.minExperience}
//                       onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                     >
//                       <option value="">Any</option>
//                       <option value="1">1+ years</option>
//                       <option value="3">3+ years</option>
//                       <option value="5">5+ years</option>
//                       <option value="10">10+ years</option>
//                       <option value="15">15+ years</option>
//                     </select>
//                   </div>

//                   {/* Fee Filter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Max Consultation Fee (₹)
//                     </label>
//                     <select
//                       value={filters.maxFee}
//                       onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                     >
//                       <option value="">Any</option>
//                       <option value="500">₹500</option>
//                       <option value="1000">₹1,000</option>
//                       <option value="1500">₹1,500</option>
//                       <option value="2000">₹2,000</option>
//                       <option value="3000">₹3,000</option>
//                     </select>
//                   </div>

//                   {/* Rating Filter */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Min Rating
//                     </label>
//                     <select
//                       value={filters.minRating}
//                       onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                     >
//                       <option value="">Any</option>
//                       <option value="4">4★ & above</option>
//                       <option value="3">3★ & above</option>
//                       <option value="2">2★ & above</option>
//                     </select>
//                   </div>

//                   {/* Availability */}
//                   <div className="flex items-end">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
//                       <input
//                         type="checkbox"
//                         checked={filters.availability}
//                         onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
//                         className="w-4 h-4 text-primary-600 rounded"
//                       />
//                       Show only available doctors
//                     </label>
//                   </div>
//                 </div>

//                 {/* Filter Actions */}
//                 <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
//                   <button
//                     onClick={clearFilters}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
//                   >
//                     Clear All
//                   </button>
//                   <button
//                     onClick={() => setShowFilters(false)}
//                     className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
//                   >
//                     Apply Filters
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Active Filters Display */}
//         {hasActiveFilters() && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {searchTerm && (
//               <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
//                 Search: {searchTerm}
//                 <button onClick={() => setSearchTerm('')} className="hover:text-primary-900">×</button>
//               </span>
//             )}
//             {filters.specialization && (
//               <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
//                 {filters.specialization}
//               </span>
//             )}
//             {filters.minExperience && (
//               <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
//                 {filters.minExperience}+ years exp
//               </span>
//             )}
//             {filters.maxFee && (
//               <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
//                 ₹{filters.maxFee} max fee
//               </span>
//             )}
//             {filters.minRating && (
//               <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
//                 {filters.minRating}★ & above
//               </span>
//             )}
//             <button onClick={clearFilters} className="px-3 py-1 text-red-600 text-sm hover:underline">
//               Clear all
//             </button>
//           </div>
//         )}

//         {/* Results Count */}
//         <div className="flex justify-between items-center mb-4">
//           <p className="text-gray-500 text-sm">
//             Showing {indexOfFirstDoctor + 1} - {Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} doctors
//           </p>
//         </div>

//         {/* Doctors Grid/List */}
//         {loading ? (
//           <LoadingSkeleton />
//         ) : filteredDoctors.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl">
//             <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Doctors Found</h3>
//             <p className="text-gray-500">Try adjusting your filters or search criteria</p>
//             <button onClick={clearFilters} className="mt-4 text-primary-600 hover:underline">
//               Clear all filters
//             </button>
//           </div>
//         ) : viewMode === 'grid' ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentDoctors.map((doctor, idx) => (
//               <DoctorCard key={doctor._id} doctor={doctor} index={idx} />
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {currentDoctors.map((doctor, idx) => (
//               <DoctorListItem key={doctor._id} doctor={doctor} index={idx} />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && !loading && (
//           <div className="flex justify-center mt-8 gap-2">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <FaChevronLeft />
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => paginate(i + 1)}
//                 className={`px-4 py-2 rounded-lg transition-all ${
//                   currentPage === i + 1
//                     ? 'bg-primary-500 text-white shadow-md'
//                     : 'border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default DoctorsList



// src/components/Public/DoctorsList.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaStar, FaStarHalfAlt, FaRegStar, FaStethoscope, FaFilter, FaSearch, 
  FaTimes, FaRupeeSign, FaBriefcase, FaMapMarkerAlt, FaChevronLeft, 
  FaChevronRight, FaUserMd, FaClock, FaHeartbeat, FaSpinner 
} from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import { SPECIALIZATIONS } from '../../utils/constants'

// ✅ StarRating Component - BAHAR
const StarRating = ({ rating, size = 'text-sm' }) => {
  const fullStars = Math.floor(rating || 0)
  const hasHalfStar = (rating || 0) % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className={`${size} text-yellow-400`} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className={`${size} text-yellow-400`} />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <FaRegStar key={i} className={`${size} text-gray-300`} />
      ))}
      <span className="ml-1 text-gray-600 text-xs">({rating?.toFixed(1) || 'New'})</span>
    </div>
  )
}

// ✅ DoctorCard Component - BAHAR
const DoctorCard = ({ doctor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
            <span className="text-2xl font-bold text-primary-600">
              {doctor.userId?.name?.charAt(0) || 'D'}
            </span>
          </div>
        </div>
        {doctor.rating >= 4.5 && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <FaStar size={10} /> Top Rated
          </div>
        )}
      </div>

      <div className="pt-12 p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
          {doctor.userId?.name}
        </h3>
        <p className="text-primary-600 text-sm font-medium flex items-center gap-1 mt-1">
          <FaStethoscope size={12} />
          {doctor.specialization}
        </p>
        
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FaBriefcase size={12} />
            {doctor.experience}yrs
          </span>
          <span className="flex items-center gap-1">
            <FaRupeeSign size={12} />
            ₹{doctor.consultationFee}
          </span>
        </div>

        <div className="mt-2">
          <StarRating rating={doctor.rating} />
        </div>

        {doctor.clinicAddress && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 truncate">
            <FaMapMarkerAlt size={10} />
            {doctor.clinicAddress.substring(0, 40)}...
          </p>
        )}

        <Link to={`/doctors/${doctor._id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
          >
            View Profile
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

// ✅ DoctorListItem Component - BAHAR
const DoctorListItem = ({ doctor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100"
    >
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {doctor.userId?.name?.charAt(0) || 'D'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">{doctor.userId?.name}</h3>
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
              {doctor.specialization}
            </span>
            {doctor.rating >= 4.5 && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <FaStar size={10} /> Top Rated
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><FaBriefcase size={12} /> {doctor.experience} years exp</span>
            <span className="flex items-center gap-1"><FaRupeeSign size={12} /> ₹{doctor.consultationFee}</span>
            <StarRating rating={doctor.rating} size="text-xs" />
          </div>
          {doctor.qualification && (
            <p className="text-xs text-gray-400 mt-1">📚 {doctor.qualification}</p>
          )}
        </div>
        
        <Link to={`/doctors/${doctor._id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors whitespace-nowrap"
          >
            Book Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

// ✅ LoadingSkeleton Component - BAHAR
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
        <div className="h-32 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
        </div>
      </div>
    ))}
  </div>
)

// ✅ Main Component
const DoctorsList = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const doctorsPerPage = 9

  const [filters, setFilters] = useState({
    specialization: '',
    minExperience: '',
    maxFee: '',
    minRating: '',
    availability: true
  })

  const [specializationCounts, setSpecializationCounts] = useState({})

  // ✅ Cleanup flag ke saath Effect - fetchDoctors ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const response = await doctorService.getDoctors()
        const doctorsList = response.data.doctors || []
        if (isMounted) {
          setDoctors(doctorsList)
          setFilteredDoctors(doctorsList)
          
          const counts = {}
          doctorsList.forEach(doc => {
            const spec = doc.specialization
            counts[spec] = (counts[spec] || 0) + 1
          })
          setSpecializationCounts(counts)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
        if (isMounted) setLoading(false)
      }
    }
    
    fetchDoctors()
    
    return () => {
      isMounted = false
    }
  }, [])

  // ✅ Filter effect - filterDoctors ko ANDAR define kiya
  useEffect(() => {
    const filterDoctors = () => {
      let filtered = [...doctors]

      if (searchTerm) {
        filtered = filtered.filter(doctor =>
          doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filters.specialization) {
        filtered = filtered.filter(doctor => doctor.specialization === filters.specialization)
      }

      if (filters.minExperience) {
        filtered = filtered.filter(doctor => doctor.experience >= parseInt(filters.minExperience))
      }

      if (filters.maxFee) {
        filtered = filtered.filter(doctor => doctor.consultationFee <= parseInt(filters.maxFee))
      }

      if (filters.minRating) {
        filtered = filtered.filter(doctor => (doctor.rating || 0) >= parseInt(filters.minRating))
      }

      if (filters.availability) {
        filtered = filtered.filter(doctor => doctor.isAvailable !== false)
      }

      setFilteredDoctors(filtered)
      setCurrentPage(1)
    }
    
    filterDoctors()
  }, [doctors, searchTerm, filters])

  const clearFilters = () => {
    setFilters({
      specialization: '',
      minExperience: '',
      maxFee: '',
      minRating: '',
      availability: true
    })
    setSearchTerm('')
  }

  const hasActiveFilters = () => {
    return filters.specialization || filters.minExperience || filters.maxFee || filters.minRating || searchTerm
  }

  const indexOfLastDoctor = currentPage * doctorsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Find the Right Doctor
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Browse through our network of 500+ experienced doctors across 30+ specializations
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name, specialization, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 transition-all"
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

            <div className="flex bg-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-gray-500'
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                showFilters || hasActiveFilters()
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FaFilter />
              Filters
              {hasActiveFilters() && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v).length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-xl shadow-lg p-5 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <select
                      value={filters.specialization}
                      onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                    >
                      <option value="">All ({doctors.length})</option>
                      {SPECIALIZATIONS.map(spec => (
                        <option key={spec} value={spec}>
                          {spec} ({specializationCounts[spec] || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
                    <select
                      value={filters.minExperience}
                      onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="1">1+ years</option>
                      <option value="3">3+ years</option>
                      <option value="5">5+ years</option>
                      <option value="10">10+ years</option>
                      <option value="15">15+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Consultation Fee (₹)</label>
                    <select
                      value={filters.maxFee}
                      onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="500">₹500</option>
                      <option value="1000">₹1,000</option>
                      <option value="1500">₹1,500</option>
                      <option value="2000">₹2,000</option>
                      <option value="3000">₹3,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="4">4★ & above</option>
                      <option value="3">3★ & above</option>
                      <option value="2">2★ & above</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={filters.availability}
                        onChange={(e) => setFilters({ ...filters, availability: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      Show only available doctors
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-primary-900">×</button>
              </span>
            )}
            {filters.specialization && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {filters.specialization}
              </span>
            )}
            {filters.minExperience && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {filters.minExperience}+ years exp
              </span>
            )}
            {filters.maxFee && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                ₹{filters.maxFee} max fee
              </span>
            )}
            {filters.minRating && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {filters.minRating}★ & above
              </span>
            )}
            <button onClick={clearFilters} className="px-3 py-1 text-red-600 text-sm hover:underline">
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 text-sm">
            Showing {indexOfFirstDoctor + 1} - {Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} doctors
          </p>
        </div>

        {/* Doctors Grid/List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Doctors Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            <button onClick={clearFilters} className="mt-4 text-primary-600 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDoctors.map((doctor, idx) => (
              <DoctorCard key={doctor._id} doctor={doctor} index={idx} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {currentDoctors.map((doctor, idx) => (
              <DoctorListItem key={doctor._id} doctor={doctor} index={idx} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === i + 1
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList