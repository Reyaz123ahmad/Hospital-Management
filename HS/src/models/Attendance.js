const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'half_day', 'leave'],
    default: 'present'
  },
  checkIn: String,
  checkOut: String,
  lateMinutes: { type: Number, default: 0 },
  leaveRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveRequest' }
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);