const mongoose = require('mongoose');

const salaryTemplateSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true }, // doctor, nurse, lab_technician, etc.
  roleName: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  perDaySalary: { type: Number, default: 0 }
}, { timestamps: true });

salaryTemplateSchema.pre('save', function(next) {
  this.perDaySalary = Math.round(this.baseSalary / 26);
  next();
});

module.exports = mongoose.model('SalaryTemplate', salaryTemplateSchema);