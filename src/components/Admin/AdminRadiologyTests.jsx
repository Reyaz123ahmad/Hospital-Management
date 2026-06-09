import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaXRay, FaEye } from 'react-icons/fa'
import adminService from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import { formatDate } from '../../utils/helpers'

const AdminRadiologyTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    adminService.getAllRadiologyTests().then(res => setTests(res.data.tests || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white"><h1 className="text-2xl font-bold flex items-center gap-2"><FaXRay /> All Radiology Tests</h1></div>
          <div className="p-6 overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3">Test</th><th>Patient</th><th>Center</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>{tests.map(t => (<tr key={t._id}><td className="p-3">{t.testType} - {t.bodyPart}</td><td className="p-3">{t.patientId?.name}</td><td className="p-3">{t.radiologyCenter}</td><td className="p-3">{t.status}</td><td className="p-3">{formatDate(t.createdAt)}</td><td className="p-3"><Button size="sm" variant="outline" onClick={() => setSelected(t)}><FaEye /></Button></td></tr>))}</tbody></table></div>
        </div>
      </div>
    </div>
  )
}

export default AdminRadiologyTests