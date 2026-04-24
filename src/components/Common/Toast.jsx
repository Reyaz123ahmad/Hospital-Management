import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const Toast = ({ type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const variants = {
    success: { bg: 'bg-green-500', icon: <FaCheckCircle /> },
    error: { bg: 'bg-red-500', icon: <FaExclamationCircle /> },
    info: { bg: 'bg-blue-500', icon: <FaInfoCircle /> },
  }

  const { bg, icon } = variants[type] || variants.info

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bg} min-w-[300px]`}
      >
        <span className="text-xl">{icon}</span>
        <span className="flex-1 text-sm">{message}</span>
        <button onClick={onClose} className="hover:opacity-80">
          <FaTimes />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default Toast