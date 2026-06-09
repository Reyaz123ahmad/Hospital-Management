import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFlask, FaArrowLeft, FaSave, FaHospital, FaClock } from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const CreateLabTest = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    patientId: '', testName: '', labName: '', instructions: '', fastingRequired: false, fastingHours: 8
  })

  useEffect(() => {
    doctorService.getMyAppointments('status=confirmed').then(res => {
      const uniquePatients = [...new Map((res.data.appointments || []).map(a => [a.patientId?._id, a.patientId])).values()]
      setPatients(uniquePatients)
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patientId || !form.testName || !form.labName) return toast.error('Fill required fields')
    setSubmitting(true)
    try {
      await doctorService.createLabTest(form)
      toast.success('Lab test created! Token sent to patient.')
      navigate('/doctor/lab-tests')
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4"><FaArrowLeft /> Back</button>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaFlask /> Prescribe Lab Test</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select className="w-full p-3 border rounded-xl" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>)}
            </select>
            <input type="text" placeholder="Test Name *" className="w-full p-3 border rounded-xl" value={form.testName} onChange={e => setForm({ ...form, testName: e.target.value })} required />
            <input type="text" placeholder="Lab Name *" className="w-full p-3 border rounded-xl" value={form.labName} onChange={e => setForm({ ...form, labName: e.target.value })} required />
            <textarea placeholder="Instructions for patient (fasting, precautions, etc.)" rows="3" className="w-full p-3 border rounded-xl" value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.fastingRequired} onChange={e => setForm({ ...form, fastingRequired: e.target.checked })} /> <FaClock /> Fasting Required</label>
            {form.fastingRequired && <select className="w-full p-3 border rounded-xl" value={form.fastingHours} onChange={e => setForm({ ...form, fastingHours: e.target.value })}><option value={4}>4 hours</option><option value={8}>8 hours</option><option value={12}>12 hours</option></select>}
            <Button type="submit" fullWidth loading={submitting} icon={FaSave}>Prescribe Test</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateLabTest