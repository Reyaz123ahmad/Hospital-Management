const Attendance = require('../models/Attendance');
const LeaveBalance = require('../models/LeaveBalance');
const LeaveRequest = require('../models/LeaveRequest');
const SalaryTemplate = require('../models/SalaryTemplate');
const StaffSalary = require('../models/StaffSalary');
const Salary = require('../models/Salary');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// ==================== HELPER FUNCTIONS ====================

// Calculate salary based on role, specialization, experience
const calculateIndividualSalary = async (role, specialization, experience) => {
  const template = await SalaryTemplate.findOne({ role });
  if (!template) return 20000;
  
  let salary = template.baseSalary;
  
  // Experience increment (3% per year, max 50%)
  if (experience) {
    const increment = Math.min(experience * 3, 50);
    salary += (salary * increment) / 100;
  }
  
  return Math.round(salary);
};

// ==================== ADMIN: CREATE SALARY TEMPLATE ====================
exports.createSalaryTemplate = async (req, res) => {
  try {
    const { role, roleName, baseSalary } = req.body;
    const existing = await SalaryTemplate.findOne({ role });
    if (existing) return res.status(400).json({ success: false, message: 'Template exists' });
    
    const template = await SalaryTemplate.create({ role, roleName, baseSalary });
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN: GET ALL TEMPLATES ====================
exports.getSalaryTemplates = async (req, res) => {
  try {
    const templates = await SalaryTemplate.find();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN: UPDATE STAFF SALARY (Individual) ====================
exports.updateStaffSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { monthlySalary } = req.body;
    
    const staffSalary = await StaffSalary.findOneAndUpdate(
      { userId: id },
      { monthlySalary },
      { new: true }
    );
    
    res.json({ success: true, staffSalary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN: CREATE STAFF ====================
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, experience } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'Email exists' });
    
    const password = Math.random().toString(36).slice(-8);
    user = await User.create({ name, email, password, phone, role: 'staff', isActive: true });
    
    // Calculate individual salary
    const monthlySalary = await calculateIndividualSalary(role, null, experience);
    
    await StaffSalary.create({
      userId: user._id,
      role,
      monthlySalary,
      experienceIncrement: Math.min(experience * 3, 50)
    });
    
    await LeaveBalance.create({ userId: user._id });
    
    res.json({ 
      success: true, 
      message: `${role} created. Salary: ₹${monthlySalary}/month`,
      data: { userId: user._id, name, email, role, monthlySalary }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ALL STAFF WITH SALARY ====================
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await StaffSalary.find().populate('userId', 'name email phone');
    res.json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MARK ATTENDANCE ====================
exports.markAttendance = async (req, res) => {
  try {
    const { userId, date, status, checkIn, checkOut } = req.body;
    
    let attendance = await Attendance.findOne({ userId, date: new Date(date) });
    
    if (!attendance) {
      attendance = new Attendance({ userId, date: new Date(date), status, checkIn, checkOut });
    } else {
      attendance.status = status;
      attendance.checkIn = checkIn;
      attendance.checkOut = checkOut;
    }
    
    if (status === 'late' && checkIn) {
      const [hours, minutes] = checkIn.split(':');
      attendance.lateMinutes = (hours - 9) * 60 + minutes;
    }
    
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== APPLY LEAVE ====================
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const userId = req.user.id;
    
    let balance = await LeaveBalance.findOne({ userId });
    if (!balance) balance = await LeaveBalance.create({ userId });
    
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    
    let available = 0;
    if (leaveType === 'annual') available = balance.annual - balance.usedAnnual;
    else if (leaveType === 'sick') available = balance.sick - balance.usedSick;
    else if (leaveType === 'casual') available = balance.casual - balance.usedCasual;
    
    const isPaid = days <= available;
    
    const leaveRequest = await LeaveRequest.create({
      userId, leaveType, fromDate, toDate, totalDays: days, reason,
      status: 'pending'
    });
    
    res.json({ 
      success: true, 
      message: `Leave request submitted. ${isPaid ? days : available} days paid, ${days - available} days unpaid.`,
      data: leaveRequest 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== APPROVE LEAVE (Admin) ====================
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    
    const leave = await LeaveRequest.findById(id);
    if (!leave) return res.status(404).json({ success: false });
    
    if (status === 'approved') {
      let balance = await LeaveBalance.findOne({ userId: leave.userId });
      if (leave.leaveType === 'annual') balance.usedAnnual += leave.totalDays;
      else if (leave.leaveType === 'sick') balance.usedSick += leave.totalDays;
      else if (leave.leaveType === 'casual') balance.usedCasual += leave.totalDays;
      await balance.save();
      
      let current = new Date(leave.fromDate);
      const end = new Date(leave.toDate);
      while (current <= end) {
        await Attendance.findOneAndUpdate(
          { userId: leave.userId, date: current },
          { status: 'leave', leaveRequestId: leave._id },
          { upsert: true }
        );
        current.setDate(current.getDate() + 1);
      }
    }
    
    leave.status = status;
    leave.remarks = remarks;
    leave.approvedBy = req.user.id;
    await leave.save();
    
    res.json({ success: true, message: `Leave ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET LEAVES (Admin) ====================
exports.getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'pending' }).populate('userId', 'name email');
    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET LEAVE BALANCE ====================
exports.getLeaveBalance = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    let balance = await LeaveBalance.findOne({ userId });
    if (!balance) balance = await LeaveBalance.create({ userId });
    
    res.json({ 
      success: true, 
      balance: {
        annual: { total: balance.annual, used: balance.usedAnnual, available: balance.annual - balance.usedAnnual },
        sick: { total: balance.sick, used: balance.usedSick, available: balance.sick - balance.usedSick },
        casual: { total: balance.casual, used: balance.usedCasual, available: balance.casual - balance.usedCasual }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GENERATE MONTHLY SALARY ====================
exports.generateSalary = async (req, res) => {
  try {
    const { month, year } = req.body;
    const staffList = await StaffSalary.find().populate('userId');
    const salaries = [];
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const totalDays = endDate.getDate();
    
    for (const staff of staffList) {
      let existing = await Salary.findOne({ userId: staff.userId._id, month, year });
      if (existing) {
        salaries.push(existing);
        continue;
      }
      
      // Get attendance
      const attendance = await Attendance.find({
        userId: staff.userId._id,
        date: { $gte: startDate, $lte: endDate }
      });
      
      const present = attendance.filter(a => a.status === 'present').length;
      const absent = attendance.filter(a => a.status === 'absent').length;
      const late = attendance.filter(a => a.status === 'late').length;
      const leave = attendance.filter(a => a.status === 'leave').length;
      
      // Get leave requests for unpaid calculation
      const leaves = await LeaveRequest.find({
        userId: staff.userId._id,
        status: 'approved',
        fromDate: { $lte: endDate },
        toDate: { $gte: startDate }
      });
      
      let unpaidDays = 0;
      for (const l of leaves) {
        const lStart = new Date(Math.max(l.fromDate, startDate));
        const lEnd = new Date(Math.min(l.toDate, endDate));
        const days = Math.ceil((lEnd - lStart) / (1000 * 60 * 60 * 24)) + 1;
        if (!l.isPaid) unpaidDays += days;
      }
      
      // Calculate salary
      const perDaySalary = staff.monthlySalary / 26;
      const leaveDeduction = unpaidDays * perDaySalary;
      const lateDeduction = late * (perDaySalary / 8);
      
      const netSalary = staff.monthlySalary - leaveDeduction - lateDeduction;
      
      const salary = await Salary.create({
        userId: staff.userId._id,
        month, year,
        baseSalary: staff.monthlySalary,
        leaveDeduction,
        lateDeduction,
        netSalary: Math.max(0, netSalary),
        attendance: { totalDays, present, absent, late, leave },
        leaves: { paid: leave - unpaidDays, unpaid: unpaidDays, deduction: leaveDeduction },
        paymentStatus: 'pending'
      });
      
      salaries.push(salary);
    }
    
    res.json({ success: true, message: `Generated ${salaries.length} salaries`, data: salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET MY SALARY ====================
exports.getMySalary = async (req, res) => {
  try {
    const salaries = await Salary.find({ userId: req.user.id }).sort('-year -month');
    const staffInfo = await StaffSalary.findOne({ userId: req.user.id });
    res.json({ success: true, salaries, currentSalary: staffInfo?.monthlySalary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ALL SALARIES (Admin) ====================
exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('userId', 'name email');
    res.json({ success: true, salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MARK SALARY PAID ====================
exports.markSalaryPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.findByIdAndUpdate(
      id,
      { paymentStatus: 'paid', paymentDate: new Date() },
      { new: true }
    );
    res.json({ success: true, salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};