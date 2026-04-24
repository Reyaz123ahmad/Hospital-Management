import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUserMd, FaPlus, FaEdit, FaTrash, FaEye, FaRupeeSign, FaGraduationCap, FaBriefcase } from 'react-icons/fa'
import adminService from '../../services/adminService'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { SPECIALIZATIONS } from '../../utils/constants'
import toast from 'react-hot-toast'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    treatsSymptoms: [],
    bio: '',
    clinicAddress: ''
  })

  // ✅ Saare effects ek saath
  React.useEffect(() => {
    let mounted = true
    
    const fetchDoctors = async () => {
      try {
        const response = await adminService.getDoctors()
        if (mounted) {
          setDoctors(response.data.doctors || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
        if (mounted) setLoading(false)
      }
    }
    
    fetchDoctors()
    
    return () => { mounted = false }
  }, []) // ✅ Empty array - sirf ek baar

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminService.createDoctor(formData)
      toast.success('Doctor created successfully! Credentials sent to email.')
      setShowAddModal(false)
      setFormData({
        name: '', email: '', phone: '', specialization: '', qualification: '',
        experience: '', consultationFee: '', treatsSymptoms: [], bio: '', clinicAddress: ''
      })
      // Refresh list
      const response = await adminService.getDoctors()
      setDoctors(response.data.doctors || [])
    } catch (error) {
      console.error('Error creating doctor:', error)
      toast.error('Failed to create doctor')
    } finally {
      setSubmitting(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await doctorService.getById(id)
      setSelectedDoctor(response.data.doctor)
      setShowViewModal(true)
    } catch (error) {
      console.error('Error fetching doctor details:', error)
      toast.error('Failed to load doctor details')
    }
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
                <FaUserMd /> Manage Doctors
              </h1>
              <p className="text-white/80 mt-1">Add, edit, and manage doctor profiles</p>
            </div>
            <Button variant="secondary" onClick={() => setShowAddModal(true)} icon={FaPlus}>
              Add Doctor
            </Button>
          </div>

          <div className="p-6">
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No doctors found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Specialization</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Experience</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {doctors.map((doctor, idx) => (
                      <motion.tr
                        key={doctor._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800">{doctor.userId?.name}</p>
                            <p className="text-sm text-gray-500">{doctor.userId?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{doctor.specialization}</td>
                        <td className="px-4 py-3 text-gray-600">{doctor.experience} years</td>
                        <td className="px-4 py-3 text-gray-600">₹{doctor.consultationFee}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1">
                            ⭐ {doctor.rating || 'New'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(doctor._id)}>
                              <FaEye /> View
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Doctor" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
              <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required>
                <option value="">Select Specialization</option>
                {SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="MBBS, MD" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) *</label>
              <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Doctor's biography..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
            <textarea name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} rows="2" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Clinic address..." />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Create Doctor</Button>
          </div>
        </form>
      </Modal>

      {/* View Doctor Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Doctor Details" size="lg">
        {selectedDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                {selectedDoctor.userId?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedDoctor.userId?.name}</h2>
                <p className="text-primary-600">{selectedDoctor.specialization}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedDoctor.userId?.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedDoctor.userId?.phone}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{selectedDoctor.qualification}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{selectedDoctor.experience} years</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="font-medium text-primary-600">₹{selectedDoctor.consultationFee}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Rating</p>
                <p className="font-medium">⭐ {selectedDoctor.rating || 'No ratings yet'}</p>
              </div>
            </div>
            {selectedDoctor.bio && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Bio</p>
                <p className="text-gray-600">{selectedDoctor.bio}</p>
              </div>
            )}
            {selectedDoctor.clinicAddress && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Clinic Address</p>
                <p className="text-gray-600">{selectedDoctor.clinicAddress}</p>
              </div>
            )}
            {selectedDoctor.treatsSymptoms?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Treats Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDoctor.treatsSymptoms.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ManageDoctors