import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFilePdf, FaEye, FaDownload, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import labService from '../../services/patientService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const MyLabReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await labService.getMyLabReports()
      setReports(res.data.reports || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (reportId) => {
    toast.success('Download started')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaFilePdf /> Lab Reports
            </h1>
            <p className="text-white/80 mt-1">View and download your test reports</p>
          </div>

          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FaFilePdf className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report, idx) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border rounded-xl p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FaFilePdf className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{report.testName}</h3>
                          <p className="text-sm text-gray-500">Report ID: {report.reportId}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><FaCalendarAlt /> {formatDate(report.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelected(report)}>
                          <FaEye /> View
                        </Button>
                        <Button size="sm" variant="primary" onClick={() => handleDownload(report._id)}>
                          <FaDownload /> Download
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal isOpen={selected} onClose={() => setSelected(null)} title="Lab Report" size="lg">
        {selected && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-gray-800">{selected.testName}</h3>
              <p className="text-sm text-gray-500">Report ID: {selected.reportId}</p>
              <p className="text-sm text-gray-500">Date: {formatDate(selected.createdAt)}</p>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Parameter</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Reference Range</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {selected.results?.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 font-medium">{r.parameter}</td>
                    <td className="p-2 font-bold">{r.value} {r.unit}</td>
                    <td className="p-2 text-gray-500">{r.referenceRange}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        r.interpretation === 'normal' ? 'bg-green-100 text-green-700' :
                        r.interpretation === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.interpretation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selected.summary && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800">Summary</h4>
                <p className="text-blue-700 text-sm">{selected.summary}</p>
              </div>
            )}

            {selected.recommendations && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Recommendations</h4>
                <p className="text-yellow-700 text-sm">{selected.recommendations}</p>
              </div>
            )}

            <div className="text-center text-gray-400 text-xs pt-2">
              This is a computer generated report. No signature required.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MyLabReports