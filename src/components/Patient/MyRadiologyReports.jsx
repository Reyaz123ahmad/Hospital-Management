import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaFilePdf, FaEye, FaDownload, FaCalendarAlt } from 'react-icons/fa'
import labService from '../../services/patientService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import Modal from '../Common/Modal'
import { formatDate } from '../../utils/helpers'

const MyRadiologyReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    labService.getMyRadiologyReports().then(res => setReports(res.data.reports || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white"><h1 className="text-2xl font-bold flex items-center gap-2"><FaFilePdf /> Radiology Reports</h1></div>
          <div className="p-6">
            {reports.length === 0 ? (<div className="text-center py-12"><FaFilePdf className="text-6xl text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No reports available</p></div>
            ) : (reports.map((report, idx) => (
              <div key={report._id} className="border rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center"><div><h3 className="font-bold">{report.testName}</h3><p className="text-sm text-gray-500">Report ID: {report.reportId}</p><p className="text-xs text-gray-400">{formatDate(report.createdAt)}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(report)}><FaEye /> View</Button><Button size="sm" variant="primary"><FaDownload /> PDF</Button></div></div>
              </div>
            )))}
          </div>
        </div>
      </div>

      <Modal isOpen={selected} onClose={() => setSelected(null)} title="Radiology Report" size="lg">
        {selected && (<div className="space-y-4"><div><h3 className="text-xl font-bold">{selected.testName}</h3><p className="text-sm text-gray-500">Report ID: {selected.reportId} | Date: {formatDate(selected.createdAt)}</p></div><div className="bg-gray-50 p-3 rounded"><p className="font-semibold">Findings</p><p>{selected.findings || 'No findings recorded'}</p></div><div className="bg-gray-50 p-3 rounded"><p className="font-semibold">Impression</p><p>{selected.impression || 'No impression recorded'}</p></div></div>)}
      </Modal>
    </div>
  )
}

export default MyRadiologyReports