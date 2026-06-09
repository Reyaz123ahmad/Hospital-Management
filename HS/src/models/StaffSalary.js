const mongoose = require('mongoose');

const staffSalarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  role: { type: String, required: true },
  monthlySalary: { type: Number, required: true }, // Individual salary for this staff
  specialization: { type: String }, // For doctors
  experienceIncrement: { type: Number, default: 0 },
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    bankName: String
  }
}, { timestamps: true });

module.exports = mongoose.model('StaffSalary', staffSalarySchema);