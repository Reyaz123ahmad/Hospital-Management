import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaXRay, FaEye, FaClock, FaCheckCircle, FaSyncAlt, FaInfoCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import labService from '../../services/patientService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Button from '../Common/Button'
import { formatDate } from '../../utils/helpers'

const MyRadiologyTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    labService.getMyRadiologyTests().then(res => setTests(res.data.tests || [])).finally(() => setLoading(false))
  }, [])

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-500" />,
      arrived: <FaClock className="text-blue-500" />,
      images_taken: <FaCheckCircle className="text-purple-500" />,
      radiologist_review: <FaSyncAlt className="text-orange-500 animate-spin" />,
      report_ready: <FaCheckCircle className="text-green-500" />
    }
    return icons[status] || <FaClock className="text-gray-500" />
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      arrived: 'bg-blue-100 text-blue-800',
      images_taken: 'bg-purple-100 text-purple-800',
      radiologist_review: 'bg-orange-100 text-orange-800',
      report_ready: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2"><FaXRay /> My Radiology Tests</h1>
            <p className="text-white/80 mt-1">Track your X-Ray, CT Scan, MRI, Ultrasound tests</p>
          </div>
          <div className="p-6">
            {tests.length === 0 ? (
              <div className="text-center py-12"><FaXRay className="text-6xl text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No radiology tests prescribed</p></div>
            ) : (
              tests.map((test, idx) => (
                <div key={test._id} className="border rounded-xl p-4 mb-3 hover:shadow-md transition">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><FaXRay className="text-indigo-600" /></div>
                        <div><h3 className="font-bold text-gray-800">{test.testType} - {test.bodyPart || 'General'}</h3><p className="text-sm text-gray-500">Token: <span className="font-mono font-bold text-indigo-600">{test.tokenNumber}</span></p></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm"><p><span className="text-gray-500">Center:</span> {test.radiologyCenter}</p><p><span className="text-gray-500">Doctor:</span> Dr. {test.doctorId?.userId?.name}</p><p><span className="text-gray-500">Date:</span> {formatDate(test.createdAt)}</p>{test.fastingRequired && <p className="text-orange-600">⚠️ Fasting: {test.fastingHours}h</p>}</div>
                      {test.preparationInstructions && <p className="text-sm text-gray-500 mt-2">📋 {test.preparationInstructions}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>{getStatusIcon(test.status)} {test.status?.replace(/_/g, ' ')}</span>
                      <div className="flex gap-2 mt-2">
                        <Link to={`/patient/radiology-status/${test._id}`}><Button size="sm" variant="outline"><FaInfoCircle /> Track</Button></Link>
                        {test.status === 'report_ready' && <Link to="/patient/radiology-reports"><Button size="sm" variant="primary"><FaEye /> Report</Button></Link>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyRadiologyTests