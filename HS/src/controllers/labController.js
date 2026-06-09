// const LabTest = require('../models/LabTest');
// const LabReport = require('../models/LabReport');
// const LabTestStatus = require('../models/LabTestStatus');
// const User = require('../models/User');
// const Doctor = require('../models/Doctor');
// const Appointment = require('../models/Appointment');
// const emailService = require('../services/emailService');

// // ==================== DOCTOR: CREATE LAB TEST ====================
// exports.createLabTest = async (req, res) => {
//   try {
//     const { appointmentId, testName, testCategory, labName, labAddress, instructions, fastingRequired, fastingHours, emergency, scheduledDate } = req.body;

//     const appointment = await Appointment.findById(appointmentId).populate('patientId', 'name email phone').populate('doctorId');
//     if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

//     const labTest = await LabTest.create({
//       appointmentId, patientId: appointment.patientId._id, doctorId: appointment.doctorId._id,
//       testName, testCategory, labName, labAddress, instructions, fastingRequired, fastingHours, emergency,
//       scheduledDate: scheduledDate || new Date(), status: 'pending'
//     });

//     await LabTestStatus.create({ testId: labTest._id, status: 'pending', notes: 'Test created by doctor', updatedBy: req.user.id });

//     await emailService.sendLabTestCreated(appointment.patientId.email, appointment.patientId.name, {
//       testId: labTest.testId, tokenNumber: labTest.tokenNumber, testName, labName, labAddress,
//       instructions, fastingRequired, fastingHours, scheduledDate: scheduledDate || new Date()
//     });

//     res.status(201).json({ success: true, message: 'Lab test created successfully', data: labTest });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== VERIFY TOKEN (LAB STAFF) ====================
// exports.verifyToken = async (req, res) => {
//   try {
//     const { tokenNumber } = req.params;
//     const labTest = await LabTest.findOne({ tokenNumber }).populate('patientId', 'name email phone').populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

//     if (!labTest) return res.status(404).json({ success: false, message: 'Invalid token number' });
//     if (labTest.status === 'completed') return res.status(400).json({ success: false, message: 'Test already completed' });
//     if (labTest.status === 'cancelled') return res.status(400).json({ success: false, message: 'Test cancelled' });

//     res.json({ success: true, data: { testId: labTest.testId, tokenNumber: labTest.tokenNumber, patientName: labTest.patientId.name, patientPhone: labTest.patientId.phone, patientEmail: labTest.patientId.email, testName: labTest.testName, testCategory: labTest.testCategory, labName: labTest.labName, labAddress: labTest.labAddress, instructions: labTest.instructions, fastingRequired: labTest.fastingRequired, fastingHours: labTest.fastingHours, emergency: labTest.emergency, currentStatus: labTest.status, scheduledDate: labTest.scheduledDate, doctorName: labTest.doctorId?.userId?.name, doctorSpecialization: labTest.doctorId?.specialization } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== COLLECT SAMPLE ====================
// exports.collectSample = async (req, res) => {
//   try {
//     const { tokenNumber } = req.params;
//     const { notes } = req.body;
//     const labTest = await LabTest.findOne({ tokenNumber }).populate('patientId', 'name email');

//     if (!labTest) return res.status(404).json({ success: false, message: 'Invalid token' });
//     if (labTest.status !== 'pending' && labTest.status !== 'scheduled') return res.status(400).json({ success: false, message: `Cannot collect sample. Status: ${labTest.status}` });

//     labTest.status = 'sample_collected';
//     labTest.sampleCollectedAt = new Date();
//     await labTest.save();

//     await LabTestStatus.create({ testId: labTest._id, status: 'sample_collected', notes: notes || 'Sample collected', updatedBy: req.user.id });
//     await emailService.sendLabTestStatusUpdate(labTest.patientId.email, labTest.patientId.name, { testId: labTest.testId, testName: labTest.testName, oldStatus: 'pending', newStatus: 'sample_collected', notes: 'Your sample has been collected' });

//     res.json({ success: true, message: 'Sample collection confirmed', data: labTest });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== START PROCESSING ====================
// exports.startProcessing = async (req, res) => {
//   try {
//     const { tokenNumber } = req.params;
//     const { notes } = req.body;
//     const labTest = await LabTest.findOne({ tokenNumber }).populate('patientId', 'name email');

//     if (!labTest) return res.status(404).json({ success: false, message: 'Invalid token' });
//     if (labTest.status !== 'sample_collected') return res.status(400).json({ success: false, message: `Cannot process. Status: ${labTest.status}` });

//     labTest.status = 'processing';
//     labTest.processingStartedAt = new Date();
//     await labTest.save();

//     await LabTestStatus.create({ testId: labTest._id, status: 'processing', notes: notes || 'Processing started', updatedBy: req.user.id });
//     await emailService.sendLabTestStatusUpdate(labTest.patientId.email, labTest.patientId.name, { testId: labTest.testId, testName: labTest.testName, oldStatus: 'sample_collected', newStatus: 'processing', notes: 'Your sample is being processed' });

//     res.json({ success: true, message: 'Processing started', data: labTest });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== COMPLETE TEST & GENERATE REPORT ====================
// exports.completeTest = async (req, res) => {
//   try {
//     const { tokenNumber } = req.params;
//     const { results, summary, recommendations } = req.body;
//     const labTest = await LabTest.findOne({ tokenNumber }).populate('patientId', 'name email').populate('doctorId');

//     if (!labTest) return res.status(404).json({ success: false, message: 'Invalid token' });

//     const report = await LabReport.create({ testId: labTest._id, patientId: labTest.patientId._id, doctorId: labTest.doctorId._id, testName: labTest.testName, results, summary, recommendations });

//     labTest.status = 'completed';
//     labTest.completedAt = new Date();
//     await labTest.save();

//     await LabTestStatus.create({ testId: labTest._id, status: 'completed', notes: 'Report generated', updatedBy: req.user.id });

//     await emailService.sendLabReportReady(labTest.patientId.email, labTest.patientId.name, { testId: labTest.testId, testName: labTest.testName, reportId: report.reportId });

//     const doctor = await User.findById(labTest.doctorId.userId);
//     await emailService.sendLabReportToDoctor(doctor.email, doctor.name, { patientName: labTest.patientId.name, testId: labTest.testId, testName: labTest.testName, reportId: report.reportId });

//     res.json({ success: true, message: 'Test completed and report generated', data: { labTest, report } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== PATIENT: GET MY TESTS ====================
// exports.getMyLabTests = async (req, res) => {
//   try {
//     const tests = await LabTest.find({ patientId: req.user.id }).populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } }).sort('-createdAt');
//     const testsWithHistory = await Promise.all(tests.map(async (test) => {
//       const history = await LabTestStatus.find({ testId: test._id }).sort('createdAt');
//       return { ...test.toObject(), statusHistory: history };
//     }));
//     res.json({ success: true, tests: testsWithHistory });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== PATIENT: GET MY REPORTS ====================
// exports.getMyReports = async (req, res) => {
//   try {
//     const reports = await LabReport.find({ patientId: req.user.id }).populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } }).sort('-createdAt');
//     await LabReport.updateMany({ patientId: req.user.id, isViewedByPatient: false }, { isViewedByPatient: true });
//     res.json({ success: true, reports });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== DOCTOR: GET MY LAB TESTS ====================
// exports.getDoctorLabTests = async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ userId: req.user.id });
//     const tests = await LabTest.find({ doctorId: doctor._id }).populate('patientId', 'name email phone').sort('-createdAt');
//     res.json({ success: true, tests });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ==================== GET SINGLE REPORT ====================
// exports.getReportById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const report = await LabReport.findById(id).populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
//     if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
//     res.json({ success: true, report });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };






// src/controllers/labController.js
const LabTest = require('../models/LabTest');
const LabReport = require('../models/LabReport');
const RadiologyTest = require('../models/RadiologyTest');
const RadiologyReport = require('../models/RadiologyReport');

// ==================== VERIFY TOKEN ====================
exports.verifyToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    let test = await LabTest.findOne({ tokenNumber })
      .populate('patientId', 'name email phone')
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
    
    if (!test) {
      test = await RadiologyTest.findOne({ tokenNumber })
        .populate('patientId', 'name email phone')
        .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
    }
    
    if (!test) return res.status(404).json({ success: false, message: 'Invalid token' });
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COLLECT SAMPLE / IMAGES ====================
exports.collectSample = async (req, res) => {
  try {
    const { testId, type } = req.body;
    let test;
    if (type === 'lab') {
      test = await LabTest.findByIdAndUpdate(testId, { status: 'sample_collected' }, { new: true });
    } else {
      test = await RadiologyTest.findByIdAndUpdate(testId, { status: 'images_taken' }, { new: true });
    }
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== START PROCESSING ====================
exports.startProcessing = async (req, res) => {
  try {
    const { testId, type } = req.body;
    let test;
    if (type === 'lab') {
      test = await LabTest.findByIdAndUpdate(testId, { status: 'processing' }, { new: true });
    } else {
      test = await RadiologyTest.findByIdAndUpdate(testId, { status: 'processing' }, { new: true });
    }
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GENERATE REPORT ====================
exports.generateReport = async (req, res) => {
  try {
    const { testId, type, results, findings } = req.body;
    
    if (type === 'lab') {
      const report = await LabReport.create({ testId, results });
      await LabTest.findByIdAndUpdate(testId, { status: 'completed', reportId: report._id });
      res.json({ success: true, report });
    } else {
      const report = await RadiologyReport.create({ testId, findings });
      await RadiologyTest.findByIdAndUpdate(testId, { status: 'completed', reportId: report._id });
      res.json({ success: true, report });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};