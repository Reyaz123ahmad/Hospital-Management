// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ IMPORTANT: Webhook route must be BEFORE express.json()
// Razorpay webhook needs raw body
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    // Pass raw body to webhook handler
    req.rawBody = req.body;
    const paymentController = require('./controllers/paymentController');
    await paymentController.razorpayWebhook(req, res);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Regular middleware (after webhook)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files (if you have frontend)
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/symptoms', require('./routes/symptomRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Home route
app.get('/', (req, res) => {
  res.json({
    name: 'Hospital Management System',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      symptoms: '/api/symptoms',
      patients: '/api/patients',
      admin: '/api/admin',
      reviews: '/api/reviews',
      payments: '/api/payments'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;