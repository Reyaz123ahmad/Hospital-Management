// src/controllers/patientController.js
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Get patient profile
exports.getPatientProfile = async (req, res) => {
  try {
    let patient = await Patient.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
    
    if (!patient) {
      patient = await Patient.create({ userId: req.user.id });
    }
    
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient profile
exports.updatePatientProfile = async (req, res) => {
  try {
    const { bloodGroup, allergies, emergencyContact, dateOfBirth, gender } = req.body;
    
    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      { bloodGroup, allergies, emergencyContact, dateOfBirth, gender },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add medical history
exports.addMedicalHistory = async (req, res) => {
  try {
    const { disease, diagnosedDate, treatedBy, notes } = req.body;
    
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    patient.medicalHistory.push({
      disease,
      diagnosedDate,
      treatedBy,
      notes
    });
    
    await patient.save();
    
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get medical history
exports.getMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id })
      .populate('medicalHistory.treatedBy', 'specialization');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, medicalHistory: patient.medicalHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add family member
exports.addFamilyMember = async (req, res) => {
  try {
    const { name, relation, age, medicalHistory } = req.body;
    
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    if (!patient.familyMembers) {
      patient.familyMembers = [];
    }
    
    patient.familyMembers.push({
      name,
      relation,
      age,
      medicalHistory
    });
    
    await patient.save();
    
    res.json({ success: true, familyMembers: patient.familyMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get family members
exports.getFamilyMembers = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, familyMembers: patient.familyMembers || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user.id })
      .populate('doctorId', 'specialization')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort('-createdAt');
    
    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Download prescription (PDF - simplified)
exports.downloadPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id)
      .populate('doctorId')
      .populate('patientId', 'name');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    // Simple JSON response for now (can be converted to PDF later)
    res.json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};