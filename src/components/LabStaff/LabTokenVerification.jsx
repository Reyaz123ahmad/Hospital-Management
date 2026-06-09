import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaQrcode, FaSyringe, FaMicroscope, FaFileAlt, FaCheckCircle, FaUser, FaFlask } from 'react-icons/fa'
import labStaffService from '../../services/labStaffService'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const LabTokenVerification = () => {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [test, setTest] = useState(null)

  const handleVerify = async () => {
    if (!token) return toast.error('Enter token')
    setLoading(true)
    try {
      const res = await labStaffService.verifyToken(token)
      setTest(res.data.data)
      toast.success('Token verified!')
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setLoading(false) }
  }

  const handleAction = async (action) => {
    setLoading(true)
    try {
      if (action === 'collect') await labStaffService.collectSample(test._id, 'lab')
      if (action === 'process') await labStaffService.startProcessing(test._id, 'lab')
      if (action === 'report') await labStaffService.generateReport(test._id, 'lab', { results: [{ parameter: 'Complete Blood Count', value: 'Normal', unit: '', referenceRange: 'Normal', interpretation: 'normal' }], summary: 'All parameters within normal limits', recommendations: 'No further action needed' })
      toast.success(action === 'collect' ? 'Sample collected!' : action === 'process' ? 'Processing started!' : 'Report generated & sent!')
      handleVerify()
    } catch (err) { toast.error(err.response?.data?.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white"><h1 className="text-2xl font-bold flex items-center gap-2"><FaQrcode /> Lab Token Verification</h1><p className="text-white/80">Verify patient token and process lab tests</p></div>
          <div className="p-6">
            <div className="flex gap-3 mb-6"><input type="text" placeholder="Enter Token Number (e.g., LAB1234567890)" className="flex-1 p-3 border rounded-xl font-mono" value={token} onChange={e => setToken(e.target.value.toUpperCase())} onKeyPress={e => e.key === 'Enter' && handleVerify()} /><Button onClick={handleVerify} loading={loading}>Verify</Button></div>
            {test && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-green-200 rounded-xl p-5 bg-green-50"><div className="flex items-center gap-2 text-green-700 mb-3"><FaCheckCircle /> Token Verified</div>
              <div className="grid grid-cols-2 gap-3 mb-4"><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Patient</p><p className="font-semibold">{test.patientName}</p><p className="text-xs">{test.patientPhone}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Test</p><p className="font-semibold">{test.testName}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Doctor</p><p className="font-semibold">Dr. {test.doctorName}</p></div><div className="bg-white p-2 rounded"><p className="text-xs text-gray-500">Status</p><span className="inline-block px-2 py-0.5 rounded-full text-xs bg-yellow-100">{test.currentStatus}</span></div></div>
              {test.fastingRequired && <div className="bg-yellow-50 p-2 rounded mb-3 text-sm">⚠️ Fasting Required: {test.fastingHours} hours</div>}
              {test.instructions && <div className="bg-blue-50 p-2 rounded mb-3 text-sm">📋 {test.instructions}</div>}
              <div className="flex flex-wrap gap-3 mt-4">
                {test.currentStatus === 'pending' && <Button onClick={() => handleAction('collect')} icon={FaSyringe}>Collect Sample</Button>}
                {test.currentStatus === 'sample_collected' && <Button onClick={() => handleAction('process')} icon={FaMicroscope}>Start Processing</Button>}
                {test.currentStatus === 'processing' && <Button onClick={() => handleAction('report')} icon={FaFileAlt}>Generate Report</Button>}
                {test.currentStatus === 'completed' && <div className="text-green-600"><FaCheckCircle /> Test Completed - Report Sent</div>}
              </div></motion.div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LabTokenVerification