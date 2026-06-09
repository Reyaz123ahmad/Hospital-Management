import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFilePdf, FaArrowLeft, FaDownload, FaPrint, FaShare, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import doctorService from '../../services/doctorService'
import LoadingSpinner from '../Common/LoadingSpinner'
import Button from '../Common/Button'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const DoctorLabReport = () => {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  const fetchReport = async () => {
    try {
      const res = await doctorService.getLabReport(reportId)
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

  const handlePrint = () => {
    window.print()
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
          {/* Report Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold">Lab Report</h1>
                <p className="text-white/80">Report ID: {report?.reportId}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handlePrint} icon={FaPrint}>Print</Button>
                <Button variant="secondary" size="sm" onClick={handleDownload} icon={FaDownload}>Download</Button>
                <Button variant="secondary" size="sm" icon={FaShare}>Share</Button>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Info */}
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
                <p className="text-xs text-gray-500">Test Name</p>
                <p className="font-semibold">{report?.testName}</p>
              </div>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Parameter</th>
                    <th className="p-3 text-left">Result</th>
                    <th className="p-3 text-left">Reference Range</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {report?.results?.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{result.parameter}</td>
                      <td className="p-3 font-bold">
                        {result.value} {result.unit}
                      </td>
                      <td className="p-3 text-gray-500">{result.referenceRange}</td>
                      <td className="p-3">
                        {result.interpretation === 'normal' ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle size={12} /> Normal
                          </span>
                        ) : result.interpretation === 'high' ? (
                          <span className="flex items-center gap-1 text-red-600">
                            <FaTimesCircle size={12} /> High
                          </span>
                        ) : result.interpretation === 'low' ? (
                          <span className="flex items-center gap-1 text-orange-600">
                            <FaTimesCircle size={12} /> Low
                          </span>
                        ) : (
                          <span className="text-yellow-600">Critical</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary & Recommendations */}
          <div className="p-6 border-t">
            <div className="grid md:grid-cols-2 gap-6">
              {report?.summary && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Summary / Interpretation</h4>
                  <p className="text-blue-700 text-sm">{report.summary}</p>
                </div>
              )}
              {report?.recommendations && (
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-yellow-800 mb-2">Recommendations</h4>
                  <p className="text-yellow-700 text-sm">{report.recommendations}</p>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Signature */}
          <div className="p-6 border-t bg-gray-50">
            <div className="text-right">
              <p className="font-semibold">Dr. {report?.doctorId?.userId?.name}</p>
              <p className="text-sm text-gray-500">{report?.doctorId?.specialization}</p>
              <p className="text-xs text-gray-400 mt-1">Digitally Generated Report</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DoctorLabReport