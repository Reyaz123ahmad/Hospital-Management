const RadiologyTest = require('../models/RadiologyTest');
const RadiologyReport = require('../models/RadiologyReport');
const RadiologyStatus = require('../models/RadiologyStatus');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const emailService = require('../services/emailService');

// ==================== DOCTOR: CREATE RADIOLOGY TEST ====================
exports.createRadiologyTest = async (req, res) => {
  try {
    const { appointmentId, testType, testSubType, bodyPart, contrastRequired, contrastType,
            radiologyCenter, centerAddress, centerPhone, preparationInstructions,
            fastingRequired, fastingHours, pregnancyWarning, emergency, priority,
            scheduledDate, scheduledTime, clinicalHistory } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patientId', 'name email phone')
      .populate('doctorId');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const radiologyTest = await RadiologyTest.create({
      appointmentId, patientId: appointment.patientId._id, doctorId: appointment.doctorId._id,
      testType, testSubType, bodyPart, contrastRequired, contrastType,
      radiologyCenter, centerAddress, centerPhone, preparationInstructions,
      fastingRequired, fastingHours, pregnancyWarning, emergency, priority,
      scheduledDate, scheduledTime, clinicalHistory, status: 'pending'
    });

    await RadiologyStatus.create({
      testId: radiologyTest._id, status: 'pending',
      notes: 'Radiology test created by doctor', updatedBy: req.user.id
    });

    // Send email to patient
    const testTypeNames = {
      xray: 'X-Ray', ultrasound: 'Ultrasound', ct_scan: 'CT Scan',
      mri: 'MRI', mammogram: 'Mammogram', fluoroscopy: 'Fluoroscopy', pet_scan: 'PET Scan'
    };

    await emailService.sendRadiologyTestCreated(appointment.patientId.email, appointment.patientId.name, {
      testId: radiologyTest.testId, tokenNumber: radiologyTest.tokenNumber,
      testType: testTypeNames[testType] || testType, testSubType,
      radiologyCenter, centerAddress, centerPhone,
      preparationInstructions, fastingRequired, fastingHours,
      pregnancyWarning, scheduledDate, scheduledTime
    });

    res.status(201).json({ success: true, message: 'Radiology test created', data: radiologyTest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== VERIFY TOKEN ====================
exports.verifyToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const test = await RadiologyTest.findOne({ tokenNumber })
      .populate('patientId', 'name email phone')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });
    if (test.status === 'completed') return res.status(400).json({ success: false, message: 'Test already completed' });

    const testTypeNames = { xray: 'X-Ray', ultrasound: 'Ultrasound', ct_scan: 'CT Scan', mri: 'MRI' };

    res.json({ success: true, data: {
      testId: test.testId, tokenNumber: test.tokenNumber, testType: testTypeNames[test.testType] || test.testType,
      testSubType: test.testSubType, bodyPart: test.bodyPart, patientName: test.patientId.name,
      patientPhone: test.patientId.phone, patientEmail: test.patientId.email,
      radiologyCenter: test.radiologyCenter, centerAddress: test.centerAddress,
      preparationInstructions: test.preparationInstructions, fastingRequired: test.fastingRequired,
      fastingHours: test.fastingHours, pregnancyWarning: test.pregnancyWarning, emergency: test.emergency,
      currentStatus: test.status, scheduledDate: test.scheduledDate, scheduledTime: test.scheduledTime,
      doctorName: test.doctorId?.userId?.name, clinicalHistory: test.clinicalHistory
    } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PATIENT ARRIVAL ====================
exports.markArrived = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const test = await RadiologyTest.findOne({ tokenNumber }).populate('patientId', 'name email');
    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });

    test.status = 'arrived';
    test.arrivalTime = new Date();
    await test.save();

    await RadiologyStatus.create({ testId: test._id, status: 'arrived', notes: 'Patient arrived at center', updatedBy: req.user.id });
    await emailService.sendRadiologyStatusUpdate(test.patientId.email, test.patientId.name, {
      testId: test.testId, testName: test.testSubType || test.testType,
      oldStatus: 'pending', newStatus: 'arrived', notes: 'Patient has arrived for the scan'
    });

    res.json({ success: true, message: 'Patient marked as arrived' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== IMAGES TAKEN ====================
exports.imagesTaken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { imageUrls, technicianNotes } = req.body;
    const test = await RadiologyTest.findOne({ tokenNumber }).populate('patientId', 'name email');

    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });

    test.status = 'images_taken';
    test.imagesTakenAt = new Date();
    if (imageUrls) test.imageUrls.push(...imageUrls);
    test.technicianNotes = technicianNotes;
    await test.save();

    await RadiologyStatus.create({ testId: test._id, status: 'images_taken', notes: 'Images captured', updatedBy: req.user.id });
    await emailService.sendRadiologyStatusUpdate(test.patientId.email, test.patientId.name, {
      testId: test.testId, testName: test.testSubType || test.testType,
      oldStatus: 'arrived', newStatus: 'images_taken', notes: 'Images have been captured'
    });

    res.json({ success: true, message: 'Images captured' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== RADIOLOGIST REVIEW ====================
exports.radiologistReview = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { findings, impression, recommendations, measurements, technique, imageQuality, limitations, comparisonStudy } = req.body;
    const test = await RadiologyTest.findOne({ tokenNumber }).populate('patientId', 'name email');

    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });

    test.status = 'radiologist_review';
    test.radiologistReviewedAt = new Date();
    await test.save();

    // Store report data temporarily or directly create report
    const report = await RadiologyReport.create({
      testId: test._id, patientId: test.patientId._id, doctorId: test.doctorId,
      testType: test.testType, testName: test.testSubType || test.testType, bodyPart: test.bodyPart,
      findings, impression, recommendations, measurements, technique, imageQuality, limitations, comparisonStudy
    });

    await RadiologyStatus.create({ testId: test._id, status: 'radiologist_review', notes: 'Radiologist reviewing images', updatedBy: req.user.id });

    res.json({ success: true, message: 'Radiologist review submitted', reportId: report._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMPLETE TEST & SEND REPORT ====================
exports.completeTest = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const test = await RadiologyTest.findOne({ tokenNumber })
      .populate('patientId', 'name email')
      .populate('doctorId');

    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });

    const report = await RadiologyReport.findOne({ testId: test._id });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    test.status = 'report_ready';
    test.reportReadyAt = new Date();
    await test.save();

    await RadiologyStatus.create({ testId: test._id, status: 'report_ready', notes: 'Report ready', updatedBy: req.user.id });

    // Send email to patient
    await emailService.sendRadiologyReportReady(test.patientId.email, test.patientId.name, {
      testId: test.testId, testName: test.testSubType || test.testType, reportId: report.reportId
    });

    // Send email to doctor
    const doctor = await User.findById(test.doctorId.userId);
    await emailService.sendRadiologyReportToDoctor(doctor.email, doctor.name, {
      patientName: test.patientId.name, testId: test.testId, testName: test.testSubType || test.testType, reportId: report.reportId
    });

    res.json({ success: true, message: 'Report ready and sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PATIENT: GET MY RADIOLOGY TESTS ====================
exports.getMyRadiologyTests = async (req, res) => {
  try {
    const tests = await RadiologyTest.find({ patientId: req.user.id })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort('-createdAt');
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PATIENT: GET MY RADIOLOGY REPORTS ====================
exports.getMyRadiologyReports = async (req, res) => {
  try {
    const reports = await RadiologyReport.find({ patientId: req.user.id })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
      .sort('-createdAt');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET SINGLE REPORT ====================
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await RadiologyReport.findById(id)
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DOCTOR: GET MY RADIOLOGY TESTS ====================
exports.getDoctorRadiologyTests = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    const tests = await RadiologyTest.find({ doctorId: doctor._id })
      .populate('patientId', 'name email phone')
      .sort('-createdAt');
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};