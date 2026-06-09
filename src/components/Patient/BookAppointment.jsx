


import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaNotesMedical, FaArrowLeft, FaStethoscope, FaUserMd, FaRupeeSign } from 'react-icons/fa'
import { format } from 'date-fns'
import { useAuth } from '../../hooks/useAuth'
import doctorService from '../../services/doctorService'
import appointmentService from '../../services/appointmentService'
import symptomService from '../../services/symptomService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [symptomsList, setSymptomsList] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [minDate] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [maxDate] = useState(() => format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))

  useEffect(() => {
    let isMounted = true
    
    const fetchDoctors = async () => {
      try {
        const response = await doctorService.getDoctors()
        if (isMounted) setDoctors(response.data.doctors)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    
    const fetchSymptoms = async () => {
      try {
        const response = await symptomService.getAllSymptoms()
        if (isMounted) setSymptomsList(response.data.symptoms || [])
      } catch (error) {
        console.error('Error fetching symptoms:', error)
      }
    }
    
    fetchDoctors()
    fetchSymptoms()
    
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true
    
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !selectedDate) return
      setLoading(true)
      try {
        const response = await appointmentService.getAvailableSlots(selectedDoctor._id, selectedDate)
        if (isMounted) setAvailableSlots(response.data.availableSlots || [])
      } catch (error) {
        console.error('Error fetching slots:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    fetchAvailableSlots()
    return () => { isMounted = false }
  }, [selectedDoctor, selectedDate])

  const toggleSymptom = (symptomName) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName) ? prev.filter(s => s !== symptomName) : [...prev, symptomName]
    )
  }

  // const handleBook = async () => {
  //   if (!selectedDoctor || !selectedDate || !selectedSlot) {
  //     toast.error('Please fill all required fields')
  //     return
  //   }

  //   setLoading(true)
  //   try {
  //     const response = await appointmentService.bookAppointment({
  //       doctorId: selectedDoctor._id,
  //       date: selectedDate,
  //       timeSlot: selectedSlot,
  //       symptoms: selectedSymptoms,
  //       notes
  //     })

  //     console.log('✅ Booking response:', response.data)
      
  //     // ✅ FIX: Get appointment ID correctly
  //     const appointmentData = response.data.appointment
  //     const appointmentId = appointmentData?._id || appointmentData?.id || response.data.appointmentId
      
  //     console.log('✅ Appointment ID:', appointmentId)
      
  //     if (!appointmentId) {
  //       toast.error('Failed to get appointment ID')
  //       setLoading(false)
  //       return
  //     }
      
  //     toast.success('Appointment booked! Proceed to payment')
      
  //     // ✅ Store in localStorage as backup
  //     localStorage.setItem('currentAppointmentId', appointmentId)
  //     sessionStorage.setItem('appointmentId', appointmentId)
      
  //     navigate(`/payment/${appointmentId}`, {
  //       state: { 
  //         appointment: appointmentData, 
  //         order: response.data.order, 
  //         key_id: response.data.key_id 
  //       }
  //     })
  //   } catch (error) {
  //     console.error('Error booking appointment:', error)
  //     toast.error(error.response?.data?.message || 'Failed to book appointment')
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const handleBook = async () => {
  if (!selectedDoctor || !selectedDate || !selectedSlot) {
    toast.error('Please fill all required fields')
    return
  }

  setLoading(true)
  try {
    const response = await appointmentService.bookAppointment({
      doctorId: selectedDoctor._id,
      date: selectedDate,
      timeSlot: selectedSlot,
      symptoms: selectedSymptoms,
      notes
    })

    // 🔍 YEH SAB LOG DALO
    console.log('========== BOOKING RESPONSE ==========')
    console.log('1. Full response object:', response)
    console.log('2. Response data:', response.data)
    console.log('3. Response data type:', typeof response.data)
    console.log('4. appointment in data:', response.data.appointment)
    console.log('5. appointment._id:', response.data.appointment?._id)
    console.log('6. appointment.id:', response.data.appointment?.id)
    console.log('7. Complete appointment object:', JSON.stringify(response.data.appointment, null, 2))
    console.log('=======================================')

    const appointmentId = response.data.appointment?._id || response.data.appointment?.id
    
    console.log('🎯 Final Appointment ID:', appointmentId)
    
    if (!appointmentId) {
      toast.error('Failed to get appointment ID')
      setLoading(false)
      return
    }
    
    toast.success('Appointment booked! Proceed to payment')
    
    localStorage.setItem('currentAppointmentId', appointmentId)
    sessionStorage.setItem('appointmentId', appointmentId)
    
    navigate(`/payment/${appointmentId}`, {
      state: { 
        appointment: response.data.appointment, 
        order: response.data.order, 
        key_id: response.data.key_id 
      }
    })
  } catch (error) {
    console.error('Error booking appointment:', error)
    toast.error(error.response?.data?.message || 'Failed to book appointment')
  } finally {
    setLoading(false)
  }
};

  const steps = ['Select Doctor', 'Choose Date & Time', 'Symptoms & Notes', 'Confirm']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back
        </button>

        <div className="flex justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <p className={`text-xs mt-1 ${step === idx + 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{s}</p>
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select a Doctor</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {doctors.map(doctor => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedDoctor?._id === doctor._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-primary-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{doctor.userId?.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-600 font-semibold flex items-center gap-1"><FaRupeeSign size={12} />{doctor.consultationFee}</p>
                        <p className="text-xs text-gray-500">{doctor.experience} years exp</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => selectedDoctor && setStep(2)} disabled={!selectedDoctor}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Date & Time</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
                  {loading ? (
                    <LoadingSpinner />
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No slots available for this date</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedSlot === slot.time ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => selectedSlot && setStep(3)} disabled={!selectedSlot}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Symptoms & Notes</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Symptoms (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((symptom) => (
                    <button
                      key={symptom._id}
                      onClick={() => toggleSymptom(symptom.name)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedSymptoms.includes(symptom.name) ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom.displayName}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  placeholder="Describe your problem or any specific concerns..."
                  className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Appointment Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Doctor:</span> {selectedDoctor?.userId?.name} ({selectedDoctor?.specialization})</p>
                  <p><span className="text-gray-500">Date:</span> {selectedDate}</p>
                  <p><span className="text-gray-500">Time:</span> {selectedSlot}</p>
                  <p><span className="text-gray-500">Fee:</span> ₹{selectedDoctor?.consultationFee}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleBook} loading={loading}>Proceed to Payment</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default BookAppointment



