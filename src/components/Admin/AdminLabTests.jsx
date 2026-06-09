import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFlask, FaEye, FaFilter } from 'react-icons/fa'
import adminService from '../../services/adminService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import Button from '../Common/Button'
import { formatDate } from '../../utils/helpers'

const AdminLabTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    adminService.getAllLabTests().then(res => setTests(res.data.tests || [])).finally(() => setLoading(false))
  }, [])

  const filteredTests = filter === 'all' ? tests : tests.filter(t => t.status === filter)

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-purple-600 p-6 text-white"><h1 className="text-2xl font-bold flex items-center gap-2"><FaFlask /> All Lab Tests</h1></div>
          <div className="p-4 border-b flex gap-2 flex-wrap">{['all', 'pending', 'processing', 'completed'].map(s => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-full text-sm ${filter === s ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{s}</button>))}</div>
          <div className="p-6 overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Test</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>{filteredTests.map(t => (<tr key={t._id} className="border-b hover:bg-gray-50"><td className="p-3 font-medium">{t.testName}</td><td className="p-3">{t.patientId?.name}</td><td className="p-3">Dr. {t.doctorId?.userId?.name}</td><td className="p-3"><span className="px-2 py-1 rounded-full text-xs bg-yellow-100">{t.status}</span></td><td className="p-3 text-sm">{formatDate(t.createdAt)}</td><td className="p-3"><Button size="sm" variant="outline" onClick={() => setSelected(t)}><FaEye /></Button></td></tr>))}</tbody></table></div>
        </div>
      </div>
      <Modal isOpen={selected} onClose={() => setSelected(null)} title="Test Details">{selected && (<div><p><strong>Token:</strong> {selected.tokenNumber}</p><p><strong>Lab:</strong> {selected.labName}</p><p><strong>Instructions:</strong> {selected.instructions}</p></div>)}</Modal>
    </div>
  )
}

export default AdminLabTests