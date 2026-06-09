import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaXRay, FaArrowLeft, FaCheckCircle, FaClock, FaSyncAlt, FaUserCheck, FaCamera } from 'react-icons/fa'
import labService from '../../services/patientService'
import LoadingSpinner from '../Common/LoadingSpinner'

const GetRadiologyStatus = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    labService.getRadiologyTestStatus(testId).then(res => setTest(res.data.test)).finally(() => setLoading(false))
  }, [testId])

  const steps = [
    { key: 'pending', label: 'Scheduled', icon: <FaClock />, color: 'text-yellow-500' },
    { key: 'arrived', label: 'Arrived at Center', icon: <FaUserCheck />, color: 'text-blue-500' },
    { key: 'images_taken', label: 'Images Taken', icon: <FaCamera />, color: 'text-purple-500' },
    { key: 'radiologist_review', label: 'Radiologist Review', icon: <FaSyncAlt />, color: 'text-orange-500' },
    { key: 'report_ready', label: 'Report Ready', icon: <FaCheckCircle />, color: 'text-green-500' }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4"><FaArrowLeft /> Back</button>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6"><div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto"><FaXRay className="text-indigo-600 text-3xl" /></div><h1 className="text-2xl font-bold mt-3">{test?.testType} - {test?.bodyPart}</h1><p className="text-gray-500">Token: {test?.tokenNumber}</p></div>
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isCompleted = steps.findIndex(s => s.key === test?.status) >= idx
              const isCurrent = step.key === test?.status
              return (<div key={step.key}><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>{isCompleted ? <FaCheckCircle className="text-green-500 text-xl" /> : step.icon}</div><div><p className={`font-semibold ${isCurrent ? 'text-indigo-600' : ''}`}>{step.label}</p><p className="text-sm text-gray-500">{isCurrent ? 'Current Status' : isCompleted ? 'Completed' : 'Pending'}</p></div></div>{idx < steps.length - 1 && <div className="h-10 w-0.5 bg-gray-200 mx-6"></div>}</div>)
            })}
          </div>
          {test?.status === 'report_ready' && (<div className="mt-6 p-4 bg-green-50 rounded-lg text-center"><p className="text-green-700">✅ Your radiology report is ready! <button onClick={() => navigate('/patient/radiology-reports')} className="underline">Click here to view</button></p></div>)}
        </div>
      </div>
    </div>
  )
}

export default GetRadiologyStatus