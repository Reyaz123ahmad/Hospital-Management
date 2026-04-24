// src/config/constants.js
module.exports = {
  ROLES: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    PATIENT: 'patient'
  },
  
  APPOINTMENT_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESCHEDULED: 'rescheduled',
    AUTO_RESCHEDULED: 'auto_rescheduled'
  },
  
  DOCTOR_TIMINGS: {
    START_HOUR: 9,      // 9 AM
    END_HOUR: 18,       // 6 PM
    LUNCH_START: 13,    // 1 PM
    LUNCH_END: 14,      // 2 PM
    SLOT_DURATION: 15   // 15 minutes
  },
  
  CANCELLATION_POLICY: {
    HOURS_BEFORE: 1,    // Can cancel 1 hour before
    REFUND_PERCENTAGE: 100
  }
};