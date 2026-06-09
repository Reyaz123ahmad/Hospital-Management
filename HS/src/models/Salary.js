const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  salaryId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  
  // Salary components
  baseSalary: Number,
  leaveDeduction: { type: Number, default: 0 },
  lateDeduction: { type: Number, default: 0 },
  netSalary: Number,
  
  // Attendance summary
  attendance: {
    totalDays: Number,
    present: Number,
    absent: Number,
    late: Number,
    leave: Number
  },
  
  // Leave summary
  leaves: {
    paid: Number,
    unpaid: Number,
    deduction: Number
  },
  
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paymentDate: Date
}, { timestamps: true });

salarySchema.pre('save', async function(next) {
  if (!this.salaryId) {
    const count = await mongoose.model('Salary').countDocuments();
    this.salaryId = `SAL${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Salary', salarySchema);