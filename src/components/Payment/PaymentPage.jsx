

// src/components/Payment/PaymentPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRupeeSign, FaCreditCard, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import paymentService from '../../services/paymentService'
import Button from '../Common/Button'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatCurrency, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const PaymentPage = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  // ✅ Separate state for initial data from location
  const initialAppointment = location.state?.appointment || null
  const initialOrder = location.state?.order || null
  
  const [appointment, setAppointment] = useState(initialAppointment)
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(!initialAppointment)
  const [processing, setProcessing] = useState(false)
  
  // ✅ Use ref to prevent multiple API calls
  const hasFetched = useRef(false)

  // ✅ Memoized fetch function - no setState inside effect directly
  const fetchAppointmentDetails = useCallback(async () => {
    if (hasFetched.current) return
    hasFetched.current = true
    
    try {
      const response = await paymentService.getPaymentStatus(appointmentId)
      if (response?.data?.appointment) {
        setAppointment(response.data.appointment)
      }
    } catch (error) {
      console.error('Error fetching appointment:', error)
      toast.error('Failed to load appointment details')
      navigate('/patient/appointments')
    } finally {
      setLoading(false)
    }
  }, [appointmentId, navigate])

  // ✅ Effect with proper condition - only runs when needed
  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      if (!initialAppointment && isMounted) {
        await fetchAppointmentDetails()
      } else if (isMounted) {
        setLoading(false)
      }
    }
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [initialAppointment, fetchAppointmentDetails])

  // ✅ Load Razorpay script once
  useEffect(() => {
    let script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
    
    return () => {
      // Don't remove script - it might be needed for other payments
    }
  }, [])

  const handlePayment = async () => {
    if (!appointment) {
      toast.error('Appointment details not loaded')
      return
    }

    setProcessing(true)

    try {
      let orderData = order
      if (!orderData) {
        const orderResponse = await paymentService.createOrder(appointmentId)
        orderData = orderResponse.data.order
        setOrder(orderData)
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error('Payment gateway is loading. Please try again.')
        setProcessing(false)
        return
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hospital Management System',
        description: `Appointment Booking - ${appointmentId}`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId: appointmentId
            })
            if (verifyResponse.data.success) {
              toast.success('Payment successful! Appointment confirmed.')
              navigate('/patient/appointments')
            } else {
              toast.error('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: appointment?.patientId?.name || '',
          email: appointment?.patientId?.email || '',
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment')
    } finally {
      setProcessing(false)
    }
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner fullScreen />
  }
  
  // No appointment state
  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No appointment details available</p>
          <Button onClick={() => navigate('/patient/appointments')}>
            Go to Appointments
          </Button>
        </div>
      </div>
    )
  }

  const totalAmount = (appointment?.amount || 0) * 1.18

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Complete Payment</h1>
            <p className="text-white/80 mt-1">Secure checkout to confirm your appointment</p>
          </div>

          <div className="p-6">
            {/* Appointment Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">Appointment Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-medium">{appointment?.doctorId?.userId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialization</span>
                  <span>{appointment?.doctorId?.specialization || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time</span>
                  <span>
                    {appointment?.date ? formatDate(appointment.date) : 'N/A'} 
                    {appointment?.timeSlot ? ` at ${appointment.timeSlot}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">Payment Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span>{formatCurrency(appointment?.amount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST (18%)</span>
                  <span>{formatCurrency((appointment?.amount || 0) * 0.18)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-primary-600 text-xl">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-3">Select Payment Method</h2>
              <div className="border rounded-xl p-4 bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    checked 
                    readOnly 
                    className="w-4 h-4 text-green-600 accent-green-600" 
                  />
                  <FaCreditCard className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium text-green-800">Credit/Debit Card</p>
                    <p className="text-sm text-green-600">Powered by Razorpay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secure Payment Note */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <FaLock className="text-gray-400" />
              <span>100% Secure Payments. Your data is encrypted.</span>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              variant="primary"
              size="lg"
              fullWidth
              disabled={processing}
              icon={processing ? FaSpinner : FaRupeeSign}
            >
              {processing ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
            </Button>

            <p className="text-center text-xs text-gray-400 mt-4">
              By completing this payment, you agree to our Terms of Service and Cancellation Policy
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentPage