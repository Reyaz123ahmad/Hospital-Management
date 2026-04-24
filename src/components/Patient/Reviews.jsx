// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa'
// import reviewService from '../../services/reviewService'
// import appointmentService from '../../services/appointmentService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const Reviews = () => {
//   const [reviews, setReviews] = useState([])
//   const [completedAppointments, setCompletedAppointments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [selectedAppointment, setSelectedAppointment] = useState(null)
//   const [formData, setFormData] = useState({
//     rating: 5,
//     comment: '',
//     isRecommended: true,
//     waitingTime: '',
//     cleanliness: 5,
//     staffBehavior: 5
//   })
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     setLoading(true)
//     try {
//       const [reviewsRes, appointmentsRes] = await Promise.all([
//         reviewService.getMyReviews(),
//         appointmentService.getPast()
//       ])
//       setReviews(reviewsRes.data.reviews || [])
      
//       const completed = (appointmentsRes.data.appointments || []).filter(
//         apt => apt.status === 'completed' && !apt.reviewed
//       )
//       setCompletedAppointments(completed)
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

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setSubmitting(true)
//     try {
//       await reviewService.addReview({
//         appointmentId: selectedAppointment._id,
//         ...formData
//       })
//       toast.success('Review submitted successfully')
//       setShowAddModal(false)
//       setFormData({ rating: 5, comment: '', isRecommended: true, waitingTime: '', cleanliness: 5, staffBehavior: 5 })
//       fetchData()
//     } catch (error) {
//       console.error('Error submitting review:', error)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this review?')) {
//       try {
//         await reviewService.deleteReview(id)
//         toast.success('Review deleted')
//         fetchData()
//       } catch (error) {
//         console.error('Error deleting review:', error)
//       }
//     }
//   }

//   const StarRating = ({ rating, onRatingChange, size = 'text-xl' }) => {
//     return (
//       <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => onRatingChange(star)}
//             className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
//           >
//             {star <= rating ? <FaStar /> : <FaRegStar />}
//           </button>
//         ))}
//       </div>
//     )
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
//               <h1 className="text-2xl font-bold">My Reviews</h1>
//               <p className="text-white/80 mt-1">Share your experience with doctors</p>
//             </div>
//             {completedAppointments.length > 0 && (
//               <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaStar}>
//                 Write Review
//               </Button>
//             )}
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <LoadingSpinner />
//             ) : reviews.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No reviews written yet</p>
//                 {completedAppointments.length > 0 && (
//                   <Button onClick={() => setShowAddModal(true)} className="mt-4">Write Your First Review</Button>
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {reviews.map((review, idx) => (
//                   <motion.div
//                     key={review._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-xl p-4"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <DisplayStars rating={review.rating} />
//                           {review.isRecommended && (
//                             <span className="flex items-center gap-1 text-green-600 text-sm">
//                               <FaCheckCircle /> Recommended
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-gray-700">{review.comment}</p>
//                         <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt)}</p>
//                       </div>
//                       <Button size="sm" variant="danger" onClick={() => handleDelete(review._id)}>
//                         <FaTrash />
//                       </Button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Add Review Modal */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Write a Review" size="lg">
//         {selectedAppointment ? (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-sm text-gray-500">Reviewing for:</p>
//               <p className="font-medium">{selectedAppointment.doctorId?.userId?.name} - {selectedAppointment.doctorId?.specialization}</p>
//               <p className="text-sm text-gray-500">Date: {formatDate(selectedAppointment.date)}</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
//               <StarRating rating={formData.rating} onRatingChange={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
//             </div>

//             <div>
//               <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                 <input
//                   type="checkbox"
//                   name="isRecommended"
//                   checked={formData.isRecommended}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-primary-600"
//                 />
//                 Would you recommend this doctor?
//               </label>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
//               <textarea
//                 name="comment"
//                 value={formData.comment}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full px-3 py-2 border rounded-lg resize-none"
//                 placeholder="Share your experience with the doctor..."
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Waiting Time (minutes)</label>
//                 <input
//                   type="number"
//                   name="waitingTime"
//                   value={formData.waitingTime}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                   placeholder="e.g., 15"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Cleanliness (1-5)</label>
//                 <select
//                   name="cleanliness"
//                   value={formData.cleanliness}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Staff Behavior (1-5)</label>
//                 <select
//                   name="staffBehavior"
//                   value={formData.staffBehavior}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-lg"
//                 >
//                   {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>)}
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <Button type="button" variant="secondary" onClick={() => {
//                 setShowAddModal(false)
//                 setSelectedAppointment(null)
//               }}>Cancel</Button>
//               <Button type="submit" variant="primary" loading={submitting}>Submit Review</Button>
//             </div>
//           </form>
//         ) : (
//           <div>
//             <p className="text-gray-600 mb-4">Select an appointment to review:</p>
//             <div className="space-y-2 max-h-80 overflow-y-auto">
//               {completedAppointments.map(apt => (
//                 <button
//                   key={apt._id}
//                   onClick={() => {
//                     setSelectedAppointment(apt)
//                   }}
//                   className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition"
//                 >
//                   <p className="font-medium">{apt.doctorId?.userId?.name}</p>
//                   <p className="text-sm text-gray-500">{formatDate(apt.date)} - {apt.timeSlot}</p>
//                 </button>
//               ))}
//             </div>
//             <div className="mt-4 flex justify-end">
//               <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default Reviews





import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaEdit, FaCheckCircle } from 'react-icons/fa'
import reviewService from '../../services/reviewService'
import appointmentService from '../../services/appointmentService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [completedAppointments, setCompletedAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    isRecommended: true,
    waitingTime: '',
    cleanliness: 5,
    staffBehavior: 5
  })
  const [submitting, setSubmitting] = useState(false)

  // ✅ Cleanup flag ke saath Effect - fetchData ko ANDAR define kiya
  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      setLoading(true)
      try {
        const [reviewsRes, appointmentsRes] = await Promise.all([
          reviewService.getMyReviews(),
          appointmentService.getPast()
        ])
        if (isMounted) {
          setReviews(reviewsRes.data.reviews || [])
          
          const completed = (appointmentsRes.data.appointments || []).filter(
            apt => apt.status === 'completed' && !apt.reviewed
          )
          setCompletedAppointments(completed)
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

  const refreshData = async () => {
    try {
      const [reviewsRes, appointmentsRes] = await Promise.all([
        reviewService.getMyReviews(),
        appointmentService.getPast()
      ])
      setReviews(reviewsRes.data.reviews || [])
      
      const completed = (appointmentsRes.data.appointments || []).filter(
        apt => apt.status === 'completed' && !apt.reviewed
      )
      setCompletedAppointments(completed)
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await reviewService.addReview({
        appointmentId: selectedAppointment._id,
        ...formData
      })
      toast.success('Review submitted successfully')
      setShowAddModal(false)
      setSelectedAppointment(null)
      setFormData({ rating: 5, comment: '', isRecommended: true, waitingTime: '', cleanliness: 5, staffBehavior: 5 })
      await refreshData()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id)
        toast.success('Review deleted')
        await refreshData()
      } catch (error) {
        console.error('Error deleting review:', error)
        toast.error('Failed to delete review')
      }
    }
  }

  const StarRating = ({ rating, onRatingChange, size = 'text-xl' }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </button>
        ))}
      </div>
    )
  }

  const DisplayStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => <FaRegStar key={i} className="text-gray-300" />)}
      </div>
    )
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
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Reviews</h1>
              <p className="text-white/80 mt-1">Share your experience with doctors</p>
            </div>
            {completedAppointments.length > 0 && (
              <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaStar}>
                Write Review
              </Button>
            )}
          </div>

          <div className="p-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reviews written yet</p>
                {completedAppointments.length > 0 && (
                  <Button onClick={() => setShowAddModal(true)} className="mt-4">Write Your First Review</Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <DisplayStars rating={review.rating} />
                          {review.isRecommended && (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <FaCheckCircle /> Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt)}</p>
                      </div>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(review._id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Review Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false)
        setSelectedAppointment(null)
      }} title="Write a Review" size="lg">
        {selectedAppointment ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Reviewing for:</p>
              <p className="font-medium">{selectedAppointment.doctorId?.userId?.name} - {selectedAppointment.doctorId?.specialization}</p>
              <p className="text-sm text-gray-500">Date: {formatDate(selectedAppointment.date)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              <StarRating rating={formData.rating} onRatingChange={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="isRecommended"
                  checked={formData.isRecommended}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                Would you recommend this doctor?
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Share your experience with the doctor..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waiting Time (minutes)</label>
                <input
                  type="number"
                  name="waitingTime"
                  value={formData.waitingTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cleanliness (1-5)</label>
                <select
                  name="cleanliness"
                  value={formData.cleanliness}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Behavior (1-5)</label>
                <select
                  name="staffBehavior"
                  value={formData.staffBehavior}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => {
                setShowAddModal(false)
                setSelectedAppointment(null)
              }}>Cancel</Button>
              <Button type="submit" variant="primary" loading={submitting}>Submit Review</Button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Select an appointment to review:</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {completedAppointments.map(apt => (
                <button
                  key={apt._id}
                  onClick={() => {
                    setSelectedAppointment(apt)
                  }}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <p className="font-medium">{apt.doctorId?.userId?.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(apt.date)} - {apt.timeSlot}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Reviews