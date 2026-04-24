// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate, Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGraduationCap, FaBriefcase, FaRupeeSign, FaCalendarAlt, FaClock, FaArrowLeft, FaCheckCircle, FaStethoscope } from 'react-icons/fa'
// import { format } from 'date-fns'
// import doctorService from '../../services/doctorService'
// import appointmentService from '../../services/appointmentService'
// import reviewService from '../../services/reviewService'
// import Button from '../Common/Button'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate, formatCurrency } from '../../utils/helpers'
// import { useAuth } from '../../hooks/useAuth'
// import toast from 'react-hot-toast'

// const DoctorDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { isAuthenticated } = useAuth()
//   const [doctor, setDoctor] = useState(null)
//   const [reviews, setReviews] = useState([])
//   const [availableSlots, setAvailableSlots] = useState([])
//   const [selectedDate, setSelectedDate] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [bookingLoading, setBookingLoading] = useState(false)

//   useEffect(() => {
//     fetchDoctorDetails()
//     fetchReviews()
//   }, [id])

//   useEffect(() => {
//     if (selectedDate) {
//       fetchAvailableSlots()
//     }
//   }, [selectedDate])

//   const fetchDoctorDetails = async () => {
//     try {
//       const response = await doctorService.getById(id)
//       setDoctor(response.data.doctor)
//     } catch (error) {
//       console.error('Error fetching doctor:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchReviews = async () => {
//     try {
//       const response = await reviewService.getDoctorReviews(id)
//       setReviews(response.data.reviews || [])
//     } catch (error) {
//       console.error('Error fetching reviews:', error)
//     }
//   }

//   const fetchAvailableSlots = async () => {
//     try {
//       const response = await appointmentService.getAvailableSlots(id, selectedDate)
//       setAvailableSlots(response.data.availableSlots || [])
//     } catch (error) {
//       console.error('Error fetching slots:', error)
//     }
//   }

//   const handleBookAppointment = async (timeSlot) => {
//     if (!isAuthenticated) {
//       toast.error('Please login to book appointment')
//       navigate('/login')
//       return
//     }

//     setBookingLoading(true)
//     try {
//       const response = await appointmentService.bookAppointment({
//         doctorId: id,
//         date: selectedDate,
//         timeSlot: timeSlot,
//         symptoms: [],
//         notes: ''
//       })
//       const { appointment, order, key_id } = response.data
//       navigate(`/payment/${appointment._id}`, {
//         state: { appointment, order, key_id }
//       })
//     } catch (error) {
//       console.error('Error booking appointment:', error)
//     } finally {
//       setBookingLoading(false)
//     }
//   }

//   const DisplayStars = ({ rating }) => {
//     const fullStars = Math.floor(rating)
//     const hasHalfStar = rating % 1 >= 0.5
//     return (
//       <div className="flex items-center gap-1">
//         {[...Array(fullStars)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
//         {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
//         {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => <FaRegStar key={i} className="text-gray-300" />)}
//       </div>
//     )
//   }

//   const minDate = format(new Date(), 'yyyy-MM-dd')
//   const maxDate = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

//   if (loading) return <LoadingSpinner fullScreen />

//   if (!doctor) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Doctor not found</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
//           <FaArrowLeft /> Back
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Doctor Info */}
//           <div className="lg:col-span-2">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//                 <div className="flex items-center gap-4">
//                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
//                     {doctor.userId?.name?.charAt(0)}
//                   </div>
//                   <div>
//                     <h1 className="text-2xl font-bold">{doctor.userId?.name}</h1>
//                     <p className="text-white/90">{doctor.specialization}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <DisplayStars rating={doctor.rating || 0} />
//                       <span className="text-sm">({doctor.totalReviews || 0} reviews)</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-6">
//                 {/* Qualifications & Experience */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <FaGraduationCap className="text-primary-500 text-xl" />
//                     <div>
//                       <p className="text-sm text-gray-500">Qualification</p>
//                       <p className="font-medium">{doctor.qualification}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <FaBriefcase className="text-primary-500 text-xl" />
//                     <div>
//                       <p className="text-sm text-gray-500">Experience</p>
//                       <p className="font-medium">{doctor.experience} years</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <FaRupeeSign className="text-primary-500 text-xl" />
//                     <div>
//                       <p className="text-sm text-gray-500">Consultation Fee</p>
//                       <p className="font-medium text-primary-600 text-lg">{formatCurrency(doctor.consultationFee)}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     <FaStethoscope className="text-primary-500 text-xl" />
//                     <div>
//                       <p className="text-sm text-gray-500">Treats</p>
//                       <p className="font-medium">{doctor.treatsSymptoms?.length || 0} conditions</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bio */}
//                 {doctor.bio && (
//                   <div className="mb-6">
//                     <h3 className="font-semibold text-gray-800 mb-2">About</h3>
//                     <p className="text-gray-600">{doctor.bio}</p>
//                   </div>
//                 )}

//                 {/* Clinic Address */}
//                 {doctor.clinicAddress && (
//                   <div className="mb-6">
//                     <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
//                       <FaMapMarkerAlt className="text-primary-500" /> Clinic Address
//                     </h3>
//                     <p className="text-gray-600">{doctor.clinicAddress}</p>
//                   </div>
//                 )}

//                 {/* Treats Symptoms */}
//                 {doctor.treatsSymptoms?.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="font-semibold text-gray-800 mb-2">Conditions Treated</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {doctor.treatsSymptoms.map((symptom, idx) => (
//                         <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
//                           {symptom.replace(/_/g, ' ')}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Contact Info */}
//                 <div className="border-t pt-4">
//                   <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
//                   <div className="flex flex-col gap-2">
//                     <p className="flex items-center gap-2 text-gray-600"><FaPhone /> {doctor.userId?.phone}</p>
//                     <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {doctor.userId?.email}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Reviews Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white rounded-2xl shadow-lg mt-8 p-6"
//             >
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Reviews</h2>
//               {reviews.length === 0 ? (
//                 <p className="text-gray-500 text-center py-4">No reviews yet</p>
//               ) : (
//                 <div className="space-y-4">
//                   {reviews.map((review, idx) => (
//                     <div key={idx} className="border-b pb-4">
//                       <div className="flex items-center gap-3 mb-2">
//                         <DisplayStars rating={review.rating} />
//                         <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
//                       </div>
//                       <p className="text-gray-700">{review.comment}</p>
//                       <p className="text-sm text-gray-500 mt-1">- {review.patientId?.name}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </motion.div>
//           </div>

//           {/* Right Column - Booking */}
//           <div>
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
//             >
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   min={minDate}
//                   max={maxDate}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200"
//                 />
//               </div>

//               {selectedDate && (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
//                   {availableSlots.length === 0 ? (
//                     <p className="text-gray-500 text-sm">No slots available for this date</p>
//                   ) : (
//                     <div className="grid grid-cols-2 gap-2">
//                       {availableSlots.map((slot) => (
//                         <button
//                           key={slot.time}
//                           onClick={() => handleBookAppointment(slot.time)}
//                           disabled={bookingLoading}
//                           className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-50"
//                         >
//                           {slot.time}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="bg-gray-50 p-4 rounded-lg mt-4">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Consultation Fee</span>
//                   <span className="font-semibold">{formatCurrency(doctor.consultationFee)}</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Platform Fee</span>
//                   <span className="font-semibold">Free</span>
//                 </div>
//                 <div className="border-t pt-2 mt-2 flex justify-between">
//                   <span className="font-bold">Total</span>
//                   <span className="font-bold text-primary-600">{formatCurrency(doctor.consultationFee)}</span>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <p className="text-xs text-gray-500 text-center">
//                   <FaCheckCircle className="inline mr-1 text-green-500" />
//                   Secure payment. Instant confirmation.
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DoctorDetail

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGraduationCap, FaBriefcase, FaRupeeSign, FaCalendarAlt, FaClock, FaArrowLeft, FaCheckCircle, FaStethoscope } from 'react-icons/fa'
import { format } from 'date-fns'
import doctorService from '../../services/doctorService'
import appointmentService from '../../services/appointmentService'
import reviewService from '../../services/reviewService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// ✅ DisplayStars ko component ke BAHAR move kiya - render time pe create nahi hoga
const DisplayStars = ({ rating }) => {
  const fullStars = Math.floor(rating || 0)
  const hasHalfStar = (rating || 0) % 1 >= 0.5
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => <FaRegStar key={i} className="text-gray-300" />)}
    </div>
  )
}

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetch functions ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchDoctorDetails = async () => {
      try {
        const response = await doctorService.getById(id)
        if (isMounted) {
          setDoctor(response.data.doctor)
        }
      } catch (error) {
        console.error('Error fetching doctor:', error)
      }
    }
    
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getDoctorReviews(id)
        if (isMounted) {
          setReviews(response.data.reviews || [])
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    fetchDoctorDetails()
    fetchReviews()
    
    return () => {
      isMounted = false
    }
  }, [id])

  // ✅ Effect for fetching available slots - fetchAvailableSlots ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return
      try {
        const response = await appointmentService.getAvailableSlots(id, selectedDate)
        if (isMounted) {
          setAvailableSlots(response.data.availableSlots || [])
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
      }
    }
    
    fetchAvailableSlots()
    
    return () => {
      isMounted = false
    }
  }, [selectedDate, id])

  const handleBookAppointment = async (timeSlot) => {
    if (!isAuthenticated) {
      toast.error('Please login to book appointment')
      navigate('/login')
      return
    }

    setBookingLoading(true)
    try {
      const response = await appointmentService.bookAppointment({
        doctorId: id,
        date: selectedDate,
        timeSlot: timeSlot,
        symptoms: [],
        notes: ''
      })
      const { appointment, order, key_id } = response.data
      navigate(`/payment/${appointment._id}`, {
        state: { appointment, order, key_id }
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error('Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  // ✅ Fix: useState initializer function - render time pe impure function nahi chalega
  const [minDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [maxDate] = useState(() => format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))

  if (loading) return <LoadingSpinner fullScreen />

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Doctor not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
                    {doctor.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{doctor.userId?.name}</h1>
                    <p className="text-white/90">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DisplayStars rating={doctor.rating || 0} />
                      <span className="text-sm">({doctor.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Qualifications & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaGraduationCap className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="font-medium">{doctor.qualification}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaBriefcase className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{doctor.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaRupeeSign className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-medium text-primary-600 text-lg">{formatCurrency(doctor.consultationFee)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaStethoscope className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Treats</p>
                      <p className="font-medium">{doctor.treatsSymptoms?.length || 0} conditions</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600">{doctor.bio}</p>
                  </div>
                )}

                {/* Clinic Address */}
                {doctor.clinicAddress && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary-500" /> Clinic Address
                    </h3>
                    <p className="text-gray-600">{doctor.clinicAddress}</p>
                  </div>
                )}

                {/* Treats Symptoms */}
                {doctor.treatsSymptoms?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Conditions Treated</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.treatsSymptoms.map((symptom, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {symptom.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-gray-600"><FaPhone /> {doctor.userId?.phone}</p>
                    <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {doctor.userId?.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg mt-8 p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={review._id || idx} className="border-b pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <DisplayStars rating={review.rating} />
                        <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">- {review.patientId?.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-transparent"
                />
              </div>

              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  {availableSlots.length === 0 ? (
                    <p className="text-gray-500 text-sm">No slots available for this date</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleBookAppointment(slot.time)}
                          disabled={bookingLoading}
                          className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-50"
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">{formatCurrency(doctor.consultationFee)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary-600">{formatCurrency(doctor.consultationFee)}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 text-center">
                  <FaCheckCircle className="inline mr-1 text-green-500" />
                  Secure payment. Instant confirmation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetail