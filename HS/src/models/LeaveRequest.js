const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  requestId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['annual', 'sick', 'casual'], required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: String
}, { timestamps: true });

leaveRequestSchema.pre('save', function(next) {
  if (this.fromDate && this.toDate && !this.totalDays) {
    const diff = Math.abs(this.toDate - this.fromDate);
    this.totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }
  if (!this.requestId) {
    this.requestId = `LEAVE${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);