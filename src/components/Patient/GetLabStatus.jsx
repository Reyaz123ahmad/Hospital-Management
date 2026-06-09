import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFlask, FaArrowLeft, FaCheckCircle, FaClock, FaSyncAlt } from 'react-icons/fa'
import labService from '../../services/patientService'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'

const GetLabStatus = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    labService.getLabTestStatus(testId).then(res => setTest(res.data.test)).finally(() => setLoading(false))
  }, [testId])

  const getStatusIcon = (status) => {
    const icons = { pending: <FaClock className="text-yellow-500 text-2xl" />, sample_collected: <FaCheckCircle className="text-purple-500 text-2xl" />, processing: <FaSyncAlt className="text-orange-500 text-2xl animate-spin" />, completed: <FaCheckCircle className="text-green-500 text-2xl" /> }
    return icons[status] || <FaClock className="text-gray-500 text-2xl" />
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4"><FaArrowLeft /> Back</button>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6"><div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto"><FaFlask className="text-purple-600 text-3xl" /></div><h1 className="text-2xl font-bold mt-3">{test?.testName}</h1><p className="text-gray-500">Token: {test?.tokenNumber}</p></div>
          <div className="space-y-4"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${test?.status === 'pending' ? 'bg-yellow-100' : 'bg-green-100'}`}>{getStatusIcon('pending')}</div><div><p className="font-semibold">Pending</p><p className="text-sm text-gray-500">Test prescribed by doctor</p>{test?.status === 'pending' && <p className="text-xs text-green-600 mt-1">Current Status</p>}</div></div>
          <div className="h-12 w-0.5 bg-gray-200 mx-6"></div>
          <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${test?.status === 'sample_collected' ? 'bg-purple-100' : test?.status === 'pending' ? 'bg-gray-100' : 'bg-green-100'}`}>{getStatusIcon('sample_collected')}</div><div><p className="font-semibold">Sample Collected</p><p className="text-sm text-gray-500">Sample collected at lab</p>{test?.status === 'sample_collected' && <p className="text-xs text-green-600 mt-1">Current Status</p>}</div></div>
          <div className="h-12 w-0.5 bg-gray-200 mx-6"></div>
          <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${test?.status === 'processing' ? 'bg-orange-100' : test?.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>{getStatusIcon('processing')}</div><div><p className="font-semibold">Processing</p><p className="text-sm text-gray-500">Test is being processed</p>{test?.status === 'processing' && <p className="text-xs text-green-600 mt-1">Current Status</p>}</div></div>
          <div className="h-12 w-0.5 bg-gray-200 mx-6"></div>
          <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${test?.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'}`}>{getStatusIcon('completed')}</div><div><p className="font-semibold">Completed</p><p className="text-sm text-gray-500">Report ready</p>{test?.status === 'completed' && <p className="text-xs text-green-600 mt-1">Current Status</p>}</div></div></div>
          {test?.status === 'completed' && (<div className="mt-6 p-4 bg-green-50 rounded-lg text-center"><p className="text-green-700">✅ Your report is ready! <button onClick={() => navigate('/patient/lab-reports')} className="underline">Click here to view</button></p></div>)}
        </div>
      </div>
    </div>
  )
}

export default GetLabStatus