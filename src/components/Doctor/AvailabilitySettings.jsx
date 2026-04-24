import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaClock, FaSave, FaPlus, FaTrash } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const AvailabilitySettings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState(['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'])
  const [newSlot, setNewSlot] = useState('')
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ]

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots([...slots, newSlot].sort())
      setNewSlot('')
    }
  }

  const removeSlot = (slot) => {
    setSlots(slots.filter(s => s !== slot))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDate) {
      toast.error('Please select a date')
      return
    }
    if (slots.length === 0) {
      toast.error('Please add at least one time slot')
      return
    }

    setLoading(true)
    try {
      await doctorService.updateAvailability(user?.id, {
        date: selectedDate,
        slots: slots
      })
      toast.success('Availability updated successfully')
      setSelectedDate('')
    } catch (error) {
      console.error('Error updating availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6">
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Availability Settings</h1>
            <p className="text-white/80 mt-1">Set your available time slots for appointments</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {slots.map((slot, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2">
                    <FaClock size={12} />
                    {slot}
                    <button type="button" onClick={() => removeSlot(slot)} className="hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Add new time slot</option>
                  {timeSlots.filter(t => !slots.includes(t)).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                <Button type="button" variant="secondary" onClick={addSlot} icon={FaPlus}>Add</Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Appointments can only be booked in these time slots. 
                Make sure to update your availability regularly.
              </p>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} icon={FaSave}>
              Save Availability
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AvailabilitySettings