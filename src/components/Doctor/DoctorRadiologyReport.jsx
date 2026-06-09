import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaXRay, FaArrowLeft, FaDownload, FaPrint, FaShare, FaUserMd, FaCalendarAlt, FaHospital } from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Button from '../Common/Button'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const DoctorRadiologyReport = () => {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  const fetchReport = async () => {
    try {
      const res = await doctorService.getRadiologyReport(reportId)
      setReport(res.data.report)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    toast.success('Download started')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4">
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FaXRay /> Radiology Report
                </h1>
                <p className="text-white/80">Report ID: {report?.reportId}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={FaPrint}>Print</Button>
                <Button variant="secondary" size="sm" onClick={handleDownload} icon={FaDownload}>Download</Button>
                <Button variant="secondary" size="sm" icon={FaShare}>Share</Button>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Patient Name</p>
                <p className="font-semibold">{report?.patientId?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Patient ID</p>
                <p className="font-mono text-sm">{report?.patientId?._id?.slice(-8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Report Date</p>
                <p className="font-semibold">{formatDate(report?.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Referring Doctor</p>
                <p className="font-semibold">Dr. {report?.doctorId?.userId?.name}</p>
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <FaXRay className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Test Type</p>
                  <p className="font-semibold">{report?.testType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserMd className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Body Part</p>
                  <p className="font-semibold">{report?.bodyPart || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaHospital className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Radiology Center</p>
                  <p className="font-semibold">{report?.radiologyCenter || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Findings</h3>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 whitespace-pre-line">{report?.findings || 'No findings recorded'}</p>
            </div>
          </div>

          {/* Impression */}
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Impression / Conclusion</h3>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-700 whitespace-pre-line">{report?.impression || 'No impression recorded'}</p>
            </div>
          </div>

          {/* Recommendations */}
          {report?.recommendations && (
            <div className="p-6 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <p className="text-yellow-700">{report.recommendations}</p>
              </div>
            </div>
          )}

          {/* Technique & Quality */}
          {(report?.technique || report?.imageQuality) && (
            <div className="p-6 border-t bg-gray-50">
              <div className="grid md:grid-cols-2 gap-4">
                {report?.technique && (
                  <div>
                    <p className="text-xs text-gray-500">Technique</p>
                    <p className="text-sm">{report.technique}</p>
                  </div>
                )}
                {report?.imageQuality && (
                  <div>
                    <p className="text-xs text-gray-500">Image Quality</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      report.imageQuality === 'optimal' ? 'bg-green-100 text-green-700' :
                      report.imageQuality === 'suboptimal' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>{report.imageQuality}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Radiologist Signature */}
          <div className="p-6 border-t text-right">
            <p className="font-semibold">Radiologist</p>
            <p className="text-sm text-gray-500">{report?.radiologistName || 'Staff Radiologist'}</p>
            <p className="text-xs text-gray-400 mt-1">Digitally Signed Report</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DoctorRadiologyReport