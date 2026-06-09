import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaQrcode, FaUserCheck, FaCamera, FaStethoscope, FaFileAlt, FaCheckCircle, FaXRay } from 'react-icons/fa'
import radiologyStaffService from '../../services/radiologyStaffService'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const RadiologyTokenVerification = () => {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [test, setTest] = useState(null)

  const handleVerify = async () => {
    if (!token) return toast.error('Enter token')
    setLoading(true)
    try {
      const res = await radiologyStaffService.verifyToken(token)
      setTest(res.data.data)
      toast.success('Token verified!')
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setLoading(false) }
  }

  const handleAction = async (action, data = {}) => {
    setLoading(true)
    try {
      if (action === 'arrive') await radiologyStaffService.markArrived(token)
      if (action === 'images') await radiologyStaffService.imagesTaken(token, { imageUrls: ['sample1.jpg', 'sample2.jpg'], technicianNotes: data.notes })
      if (action === 'review') await radiologyStaffService.submitReview(token, { findings: 'No acute abnormalities detected. Normal study.', impression: 'Normal', recommendations: 'Clinical correlation advised' })
      if (action === 'complete') await radiologyStaffService.completeTest(token)
      toast.success(action === 'arrive' ? 'Patient marked as arrived!' : action === 'images' ? 'Images captured!' : action === 'review' ? 'Radiologist review submitted!' : 'Report completed and sent!')
      handleVerify()
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white"><h1 className="text-2xl font-bold flex items-center gap-2"><FaQrcode /> Radiology Token Verification</h1><p className="text-white/80">Verify patient token for X-Ray, CT Scan, MRI, Ultrasound</p></div>
          <div className="p-6">
            <div className="flex gap-3 mb-6"><input type="text" placeholder="Enter Token Number (e.g., RAD1234567890)" className="flex-1 p-3 border rounded-xl font-mono" value={token} onChange={e => setToken(e.target.value.toUpperCase())} onKeyPress={e => e.key === 'Enter' && handleVerify()} /><Button onClick={handleVerify} loading={loading}>Verify</Button></div>
            {test && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-green-200 rounded-xl p-5 bg-green-50"><div className="flex items-center gap-2 text-green-700 mb-3"><FaCheckCircle /> Token Verified</div>
              <div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Patient</p><p className="font-semibold">{test.patientName}</p><p className="text-xs">{test.patientPhone}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Test</p><p className="font-semibold">{test.testType} - {test.bodyPart}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Center</p><p className="font-semibold">{test.radiologyCenter}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Status</p><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-yellow-100">{test.currentStatus}</span></div></div>
              {test.fastingRequired && <div className="bg-yellow-50 p-2 rounded mb-3 text-sm">⚠️ Fasting Required: {test.fastingHours} hours</div>}
              {test.pregnancyWarning && <div className="bg-red-50 p-2 rounded mb-3 text-sm">⚠️ Pregnancy Warning: Inform patient about radiation risks</div>}
              {test.preparationInstructions && <div className="bg-blue-50 p-2 rounded mb-3 text-sm">📋 {test.preparationInstructions}</div>}
              <div className="flex flex-wrap gap-3 mt-4">
                {test.currentStatus === 'pending' && <Button onClick={() => handleAction('arrive')} icon={FaUserCheck}>Mark Arrived</Button>}
                {test.currentStatus === 'arrived' && <Button onClick={() => handleAction('images')} icon={FaCamera}>Images Taken</Button>}
                {test.currentStatus === 'images_taken' && <Button onClick={() => handleAction('review')} icon={FaStethoscope}>Submit Review</Button>}
                {test.currentStatus === 'radiologist_review' && <Button onClick={() => handleAction('complete')} icon={FaFileAlt}>Complete & Send</Button>}
                {test.currentStatus === 'report_ready' && <div className="text-green-600"><FaCheckCircle /> Report Ready - Sent to Patient & Doctor</div>}
              </div></motion.div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadiologyTokenVerification