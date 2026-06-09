const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  annual: { type: Number, default: 15 },
  sick: { type: Number, default: 12 },
  casual: { type: Number, default: 12 },
  usedAnnual: { type: Number, default: 0 },
  usedSick: { type: Number, default: 0 },
  usedCasual: { type: Number, default: 0 },
  year: { type: Number, default: () => new Date().getFullYear() }
}, { timestamps: true });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);