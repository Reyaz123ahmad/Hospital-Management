// src/controllers/paymentController.js
const crypto = require('crypto');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const emailService = require('../services/emailService');
const razorpayInstance = require('../config/razorpay'); // ✅ Import instance

// Create order
// exports.createOrder = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;
    
//     console.log("📦 Creating order for appointment:", appointmentId);
    
//     // Get appointment details
//     const appointment = await Appointment.findById(appointmentId)
//       .populate('doctorId', 'consultationFee')
//       .populate('patientId', 'name email');
    
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }
    
//     // Check if already paid
//     if (appointment.paymentStatus === 'paid') {
//       return res.status(400).json({ success: false, message: 'Appointment already paid' });
//     }
    
//     const amount = appointment.amount || appointment.doctorId.consultationFee;
//     const receipt = `receipt_${appointmentId}_${Date.now()}`;
    
//     console.log("💰 Amount:", amount, "Receipt:", receipt);
    
//     // Create Razorpay order using instance
//     const options = {
//       amount: amount * 100, // Amount in paise
//       currency: 'INR',
//       receipt: receipt,
//       payment_capture: 1,
//       notes: {
//         appointmentId: appointmentId.toString(),
//         patientId: req.user.id.toString(),
//         patientEmail: appointment.patientId.email,
//         patientName: appointment.patientId.name
//       }
//     };
    
//     const order = await razorpayInstance.orders.create(options);
    
//     console.log("✅ Order created:", order.id);
    
//     // Store order ID in appointment
//     appointment.razorpayOrderId = order.id;
//     await appointment.save();
    
//     res.json({
//       success: true,
//       order: {
//         id: order.id,
//         amount: order.amount,
//         currency: order.currency,
//         receipt: order.receipt
//       },
//       key_id: process.env.RAZORPAY_KEY_ID,
//       appointmentId: appointmentId,
//       amount: amount
//     });
    
//   } catch (error) {
//     console.error('❌ Razorpay order error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    console.log("📦 Creating order for appointment:", appointmentId);
    
    // Get appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', 'consultationFee')
      .populate('patientId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check if already paid
    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Appointment already paid' });
    }
    
    const amount = appointment.amount || appointment.doctorId.consultationFee;
    
    // ✅ FIXED: Receipt length 40 chars se kam
    const receipt = appointmentId.slice(-20); // 20 chars max
    // OR
    // const receipt = appointmentId; // 24 chars
    
    console.log("💰 Amount:", amount, "Receipt:", receipt, "Length:", receipt.length);
    
    // Create Razorpay order using instance
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: receipt, // ✅ Fixed
      payment_capture: 1,
      notes: {
        appointmentId: appointmentId.toString(),
        patientId: req.user.id.toString(),
        patientEmail: appointment.patientId.email,
        patientName: appointment.patientId.name
      }
    };
    
    const order = await razorpayInstance.orders.create(options);
    
    console.log("✅ Order created:", order.id);
    
    // Store order ID in appointment
    appointment.razorpayOrderId = order.id;
    await appointment.save();
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      key_id: process.env.RAZORPAY_KEY_ID,
      appointmentId: appointmentId,
      amount: amount
    });
    
  } catch (error) {
    console.error('❌ Razorpay order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       appointmentId
//     } = req.body;
    
//     console.log("🔐 Verifying payment for order:", razorpay_order_id);
    
//     // Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');
    
//     const isAuthentic = expectedSignature === razorpay_signature;
    
//     if (!isAuthentic) {
//       console.log("❌ Invalid signature");
//       return res.status(400).json({ success: false, message: 'Invalid signature' });
//     }
    
//     // Update appointment
//     const appointment = await Appointment.findById(appointmentId)
//       .populate('patientId', 'name email')
//       .populate({
//         path: 'doctorId',
//         populate: { path: 'userId', select: 'name' }
//       });
    
//     if (!appointment) {
//       return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }
    
//     appointment.paymentStatus = 'paid';
//     appointment.razorpayPaymentId = razorpay_payment_id;
//     appointment.razorpaySignature = razorpay_signature;
//     appointment.status = 'confirmed';
//     await appointment.save();
    
//     console.log("✅ Payment verified for appointment:", appointmentId);
    
//     // Send payment confirmation email
//     await emailService.sendPaymentConfirmation(
//       appointment.patientId.email,
//       appointment.patientId.name,
//       {
//         appointmentId: appointment._id,
//         amount: appointment.amount,
//         paymentId: razorpay_payment_id,
//         date: appointment.date,
//         doctorName: appointment.doctorId.userId?.name
//       }
//     );
    
//     res.json({
//       success: true,
//       message: 'Payment verified successfully',
//       appointmentId: appointment._id
//     });
    
//   } catch (error) {
//     console.error('❌ Verification error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId
    } = req.body;
    
    // 🔥 POSTMAN TESTING MODE - HATANA BAAD MEIN
    const isPostmanTest = razorpay_signature === 'test_signature_123';
    
    if (isPostmanTest) {
      console.log("📦 POSTMAN TEST MODE: Skipping signature verification");
      
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          paymentCompletedAt: new Date()
        },
        { new: true }
      );
      
      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }
      
      return res.json({
        success: true,
        message: 'Payment verified successfully (TEST MODE)',
        appointment: {
          id: appointment._id,
          status: appointment.status,
          paymentStatus: appointment.paymentStatus
        }
      });
    }
    
    // REAL RAZORPAY VERIFICATION - Production ke liye
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: 'paid',
        status: 'confirmed',
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentCompletedAt: new Date()
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      appointment
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointment = await Appointment.findById(appointmentId)
      .select('paymentStatus razorpayPaymentId razorpayOrderId amount');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({
      success: true,
      paymentStatus: appointment.paymentStatus,
      orderId: appointment.razorpayOrderId,
      paymentId: appointment.razorpayPaymentId,
      amount: appointment.amount
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Appointment.find({
      patientId: req.user.id,
      paymentStatus: 'paid'
    })
      .populate('doctorId', 'consultationFee specialization')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .select('razorpayPaymentId razorpayOrderId amount date timeSlot paymentStatus createdAt')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: payments.length,
      payments
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not found or already refunded' });
    }
    
    console.log("🔄 Processing refund for payment:", appointment.razorpayPaymentId);
    
    // Create refund using instance
    const refund = await razorpayInstance.payments.refund(appointment.razorpayPaymentId, {
      amount: appointment.amount * 100,
      notes: {
        reason: reason || 'Cancellation refund',
        appointmentId: appointmentId
      }
    });
    
    console.log("✅ Refund processed:", refund.id);
    
    // Update appointment
    appointment.paymentStatus = 'refunded';
    appointment.refundId = refund.id;
    appointment.refundReason = reason;
    await appointment.save();
    
    // Send refund email
    const patient = await User.findById(appointment.patientId);
    await emailService.sendRefundConfirmation(
      patient.email,
      patient.name,
      {
        appointmentId: appointment._id,
        amount: appointment.amount,
        refundId: refund.id
      }
    );
    
    res.json({
      success: true,
      message: 'Refund processed successfully',
      refundId: refund.id
    });
    
  } catch (error) {
    console.error('❌ Refund error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpayInstance.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook handler
exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    console.log("📨 Webhook event:", event, "Payment ID:", payment.id);
    
    if (event === 'payment.captured') {
      // Find appointment by order ID
      const appointment = await Appointment.findOne({ 
        razorpayOrderId: payment.order_id 
      });
      
      if (appointment && appointment.paymentStatus !== 'paid') {
        appointment.paymentStatus = 'paid';
        appointment.razorpayPaymentId = payment.id;
        appointment.status = 'confirmed';
        await appointment.save();
        
        console.log("✅ Webhook: Payment captured for appointment:", appointment._id);
        
        // Send email
        const patient = await User.findById(appointment.patientId);
        if (patient) {
          await emailService.sendPaymentConfirmation(
            patient.email,
            patient.name,
            {
              appointmentId: appointment._id,
              amount: appointment.amount,
              paymentId: payment.id
            }
          );
        }
      }
    }
    
    res.json({ success: true, received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};