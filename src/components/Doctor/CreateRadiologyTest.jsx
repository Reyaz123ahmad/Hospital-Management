import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaXRay, FaArrowLeft, FaSave, FaHospital, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const CreateRadiologyTest = () => {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    patientId: '', testType: 'xray', bodyPart: '', radiologyCenter: '', instructions: '', fastingRequired: false, fastingHours: 8, pregnancyWarning: false
  })

  const testTypes = [
    { value: 'xray', label: 'X-Ray', icon: '🦴' },
    { value: 'ultrasound', label: 'Ultrasound', icon: '👶' },
    { value: 'ct_scan', label: 'CT Scan', icon: '🔄' },
    { value: 'mri', label: 'MRI', icon: '🧠' }
  ]

  const bodyParts = ['Chest', 'Abdomen', 'Head', 'Spine', 'Knee', 'Shoulder', 'Full Body']

  useEffect(() => {
    doctorService.getMyAppointments('status=confirmed').then(res => {
      const uniquePatients = [...new Map((res.data.appointments || []).map(a => [a.patientId?._id, a.patientId])).values()]
      setPatients(uniquePatients)
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.patientId || !form.testType || !form.radiologyCenter) return toast.error('Fill required fields')
    setSubmitting(true)
    try {
      await doctorService.createRadiologyTest(form)
      toast.success('Radiology test created! Token sent to patient.')
      navigate('/doctor/radiology-tests')
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4"><FaArrowLeft /> Back</button>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6"><FaXRay /> Prescribe Radiology Test</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select className="w-full p-3 border rounded-xl" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} required><option value="">Select Patient</option>{patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select>
            <div className="grid grid-cols-2 gap-3">{testTypes.map(t => (<button key={t.value} type="button" onClick={() => setForm({ ...form, testType: t.value })} className={`p-3 rounded-xl border-2 text-center ${form.testType === t.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200'}`}><span className="text-2xl">{t.icon}</span><p className="text-sm">{t.label}</p></button>))}</div>
            <select className="w-full p-3 border rounded-xl" value={form.bodyPart} onChange={e => setForm({ ...form, bodyPart: e.target.value })}><option value="">Select Body Part</option>{bodyParts.map(b => <option key={b} value={b}>{b}</option>)}</select>
            <input type="text" placeholder="Radiology Center Name *" className="w-full p-3 border rounded-xl" value={form.radiologyCenter} onChange={e => setForm({ ...form, radiologyCenter: e.target.value })} required />
            <textarea placeholder="Preparation Instructions" rows="2" className="w-full p-3 border rounded-xl" value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.fastingRequired} onChange={e => setForm({ ...form, fastingRequired: e.target.checked })} /> <FaClock /> Fasting Required</label>
            {form.fastingRequired && <select className="w-full p-3 border rounded-xl" value={form.fastingHours} onChange={e => setForm({ ...form, fastingHours: e.target.value })}><option value={4}>4h</option><option value={8}>8h</option><option value={12}>12h</option></select>}
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.pregnancyWarning} onChange={e => setForm({ ...form, pregnancyWarning: e.target.checked })} /> <FaExclamationTriangle className="text-red-500" /> Pregnancy Warning</label>
            <Button type="submit" fullWidth loading={submitting} icon={FaSave}>Prescribe Radiology Test</Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRadiologyTest