// server.js
const app = require('./src/app');
const connectDB = require('./src/config/database');
const cron = require('node-cron');
const slotService = require('./src/services/slotService');

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🏥 HOSPITAL MANAGEMENT SYSTEM');
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log('📧 Email notifications: ✅ Enabled');
  console.log('💳 Razorpay Payment: ✅ Enabled');
  console.log('='.repeat(50));
  console.log('\n📋 Available endpoints:');
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/doctors`);
  console.log(`   POST   /api/appointments/book`);
  console.log(`   POST   /api/payments/create-order`);
  console.log(`   POST   /api/payments/verify`);
  console.log(`   POST   /api/payments/webhook`);
  console.log('='.repeat(50));
});

// Cron job: Check for overflow appointments every hour
cron.schedule('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] 🔄 Running overflow appointment check...`);
  try {
    // Get all doctors
    const Doctor = require('./src/models/Doctor');
    const doctors = await Doctor.find();
    
    for (const doctor of doctors) {
      await slotService.handleOverflowAppointments(doctor._id, new Date());
    }
    console.log(`[${new Date().toISOString()}] ✅ Overflow check completed`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Overflow check error:`, error.message);
  }
});

// Cron job: Send appointment reminders 24 hours before
cron.schedule('0 9 * * *', async () => {
  console.log(`[${new Date().toISOString()}] 📧 Sending appointment reminders...`);
  try {
    const Appointment = require('./src/models/Appointment');
    const User = require('./src/models/User');
    const emailService = require('./src/services/emailService');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const appointments = await Appointment.find({
      date: { $gte: tomorrow, $lt: nextDay },
      status: 'confirmed'
    }).populate('patientId').populate('doctorId');
    
    for (const appointment of appointments) {
      const doctor = await Doctor.findById(appointment.doctorId).populate('userId');
      await emailService.sendAppointmentReminder(
        appointment.patientId.email,
        appointment.patientId.name,
        {
          doctorName: doctor.userId.name,
          date: appointment.date.toLocaleDateString(),
          timeSlot: appointment.timeSlot
        }
      );
    }
    console.log(`[${new Date().toISOString()}] ✅ Sent ${appointments.length} reminders`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Reminder error:`, error.message);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  server.close(() => process.exit(1));
});