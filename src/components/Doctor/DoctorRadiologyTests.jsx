import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaXRay, FaEye, FaPlus, FaClock, FaCheckCircle, FaSyncAlt, FaFilePdf, FaUserCheck, FaCamera } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import doctorService from '../../services/doctorService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import { formatDate } from '../../utils/helpers'

const DoctorRadiologyTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    doctorService.getMyRadiologyTests().then(res => setTests(res.data.tests || [])).finally(() => setLoading(false))
  }, [])

  const getStatusIcon = (status) => {
    if (status === 'pending') return <FaClock className="text-yellow-500" />
    if (status === 'arrived') return <FaUserCheck className="text-blue-500" />
    if (status === 'images_taken') return <FaCamera className="text-purple-500" />
    if (status === 'radiologist_review') return <FaSyncAlt className="text-orange-500 animate-spin" />
    if (status === 'report_ready') return <FaCheckCircle className="text-green-500" />
    return <FaClock className="text-gray-500" />
  }

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800'
    if (status === 'arrived') return 'bg-blue-100 text-blue-800'
    if (status === 'images_taken') return 'bg-purple-100 text-purple-800'
    if (status === 'radiologist_review') return 'bg-orange-100 text-orange-800'
    if (status === 'report_ready') return 'bg-green-100 text-green-800'
    return 'bg-gray-100'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2"><FaXRay /> Radiology Tests</h1>
            <Link to="/doctor/radiology-tests/new"><Button variant="secondary" icon={FaPlus}>New Test</Button></Link>
          </div>
          <div className="p-6">
            {tests.length === 0 ? (
              <div className="text-center py-12">
                <FaXRay className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No radiology tests prescribed</p>
              </div>
            ) : (
              tests.map((test, idx) => (
                <div key={test._id} className="border rounded-xl p-4 mb-3 hover:shadow-md transition">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{test.testType} - {test.bodyPart || 'General'}</h3>
                      <p className="text-sm">Patient: <span className="font-medium">{test.patientId?.name}</span> | Phone: {test.patientId?.phone}</p>
                      <p className="text-xs text-gray-500">{formatDate(test.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(test.status)}`}>
                        {getStatusIcon(test.status)} {test.status?.replace(/_/g, ' ')}
                      </span>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => setSelected(test)}>
                          <FaEye /> Details
                        </Button>
                        {/* ✅ ADDED VIEW REPORT BUTTON */}
                        {test.status === 'report_ready' && test.reportId && (
                          <Link to={`/doctor/radiology-report/${test.reportId}`}>
                            <Button size="sm" variant="primary">
                              <FaFilePdf /> View Report
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={selected} onClose={() => setSelected(null)} title="Test Details">
        {selected && (
          <div className="space-y-3">
            <p><strong>Test:</strong> {selected.testType} - {selected.bodyPart}</p>
            <p><strong>Patient:</strong> {selected.patientId?.name}</p>
            <p><strong>Center:</strong> {selected.radiologyCenter}</p>
            <p><strong>Token:</strong> {selected.tokenNumber}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            {selected.instructions && <p><strong>Instructions:</strong> {selected.instructions}</p>}
            {selected.fastingRequired && <p className="text-orange-600"><strong>⚠️ Fasting:</strong> {selected.fastingHours} hours</p>}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DoctorRadiologyTests