// src/controllers/symptomController.js
const Symptom = require('../models/Symptom');
const SymptomMapping = require('../models/SymptomMapping');
const Doctor = require('../models/Doctor');
const symptomMappingUtils = require('../utils/symptomMapping');

// ==================== SYMPTOM MANAGEMENT ====================

// Get all symptoms
exports.getAllSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find({ isActive: true }).sort('order');
    
    if (symptoms.length === 0) {
      const fallbackSymptoms = symptomMappingUtils.getAllSymptomsList();
      return res.json({
        success: true,
        source: 'fallback',
        count: fallbackSymptoms.length,
        symptoms: fallbackSymptoms.map(s => ({ 
          name: s, 
          displayName: s.replace(/_/g, ' ').toUpperCase(),
          category: 'general'
        }))
      });
    }
    
    res.json({ success: true, source: 'database', count: symptoms.length, symptoms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create symptom
exports.createSymptom = async (req, res) => {
  try {
    const { name, displayName, description, category, commonCauses, homeRemedies, whenToSeeDoctor } = req.body;
    
    const symptom = await Symptom.create({
      name: name.toLowerCase(),
      displayName,
      description,
      category: category || 'general',
      commonCauses: commonCauses || [],
      homeRemedies: homeRemedies || [],
      whenToSeeDoctor: whenToSeeDoctor || ''
    });
    
    res.status(201).json({ success: true, symptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update symptom
exports.updateSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.name) updateData.name = updateData.name.toLowerCase();
    
    const symptom = await Symptom.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!symptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }
    
    res.json({ success: true, symptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete symptom
exports.deleteSymptom = async (req, res) => {
  try {
    const { id } = req.params;
    const symptom = await Symptom.findByIdAndDelete(id);
    
    if (!symptom) {
      return res.status(404).json({ success: false, message: 'Symptom not found' });
    }
    
    res.json({ success: true, message: 'Symptom deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SYMPTOM MAPPING MANAGEMENT ====================

// Get all symptom mappings
exports.getAllSymptomMappings = async (req, res) => {
  try {
    const mappings = await SymptomMapping.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort('-createdAt');
    
    res.json({ success: true, count: mappings.length, mappings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single symptom mapping
exports.getSymptomMappingById = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await SymptomMapping.findById(id);
    
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }
    
    res.json({ success: true, mapping });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create symptom mapping
exports.createSymptomMapping = async (req, res) => {
  try {
    const {
      symptomCombination,
      recommendedSpecializations,
      isEmergency,
      emergencyMessage,
      severityLevel,
      commonInAgeGroup,
      requiresImmediateAttention,
      typicalDuration
    } = req.body;
    
    // Validate symptom combination
    if (!symptomCombination || symptomCombination.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one symptom is required' });
    }
    
    // Validate specializations
    if (!recommendedSpecializations || recommendedSpecializations.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one specialization is required' });
    }
    
    const mapping = await SymptomMapping.create({
      symptomCombination: symptomCombination.map(s => s.toLowerCase()),
      recommendedSpecializations,
      isEmergency: isEmergency || false,
      emergencyMessage: emergencyMessage || '',
      severityLevel: severityLevel || 'mild',
      commonInAgeGroup: commonInAgeGroup || 'all',
      requiresImmediateAttention: requiresImmediateAttention || false,
      typicalDuration: typicalDuration || 'few_days',
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Symptom mapping created successfully',
      mapping
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update symptom mapping
exports.updateSymptomMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };
    
    if (updateData.symptomCombination) {
      updateData.symptomCombination = updateData.symptomCombination.map(s => s.toLowerCase());
    }
    
    const mapping = await SymptomMapping.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }
    
    res.json({
      success: true,
      message: 'Symptom mapping updated successfully',
      mapping
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete symptom mapping
exports.deleteSymptomMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await SymptomMapping.findByIdAndDelete(id);
    
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }
    
    res.json({ success: true, message: 'Symptom mapping deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle mapping active status
exports.toggleMappingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const mapping = await SymptomMapping.findById(id);
    
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }
    
    mapping.isActive = !mapping.isActive;
    await mapping.save();
    
    res.json({
      success: true,
      message: `Mapping ${mapping.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: mapping.isActive
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk create symptom mappings
exports.bulkCreateSymptomMappings = async (req, res) => {
  try {
    const { mappings } = req.body;
    
    if (!mappings || !Array.isArray(mappings)) {
      return res.status(400).json({ success: false, message: 'Mappings array is required' });
    }
    
    const createdMappings = [];
    for (const mapping of mappings) {
      const newMapping = await SymptomMapping.create({
        ...mapping,
        symptomCombination: mapping.symptomCombination.map(s => s.toLowerCase()),
        createdBy: req.user.id
      });
      createdMappings.push(newMapping);
    }
    
    res.status(201).json({
      success: true,
      message: `${createdMappings.length} mappings created successfully`,
      mappings: createdMappings
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get mappings by symptom
exports.getMappingsBySymptom = async (req, res) => {
  try {
    const { symptom } = req.params;
    const mappings = await SymptomMapping.find({
      symptomCombination: symptom.toLowerCase(),
      isActive: true
    });
    
    res.json({ success: true, count: mappings.length, mappings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get emergency mappings
exports.getEmergencyMappings = async (req, res) => {
  try {
    const mappings = await SymptomMapping.find({
      isEmergency: true,
      isActive: true
    });
    
    res.json({ success: true, count: mappings.length, mappings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SYMPTOM ANALYSIS (MAIN FEATURE) ====================

// Analyze symptoms and recommend doctors
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, severity, duration, age } = req.body;
    
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one symptom' });
    }
    
    // Step 1: Check for emergency using utils
    const isEmergency = symptomMappingUtils.isEmergencySymptom(symptoms);
    const emergencyMessage = symptomMappingUtils.getEmergencyMessage(symptoms);
    
    if (isEmergency || severity === 'severe') {
      return res.json({
        success: true,
        isEmergency: true,
        message: emergencyMessage || '⚠️ EMERGENCY! Please visit the nearest hospital immediately.',
        action: 'EMERGENCY',
        emergencyContact: '108 or 102'
      });
    }
    
    // Step 2: Get mappings from database
    let mappings = await SymptomMapping.find({
      symptomCombination: { $in: symptoms.map(s => s.toLowerCase()) },
      isActive: true
    }).sort({ severityLevel: -1 });
    
    let recommendedSpecializations = [];
    
    if (mappings.length > 0) {
      mappings.forEach(mapping => {
        recommendedSpecializations.push(...mapping.recommendedSpecializations);
      });
      // Remove duplicates
      recommendedSpecializations = [...new Map(
        recommendedSpecializations.map(item => [item.specialization, item])
      ).values()];
      recommendedSpecializations.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    }
    
    // Step 3: If no mapping found, use fallback from utils
    if (recommendedSpecializations.length === 0) {
      const fallbackResult = symptomMappingUtils.getSpecializationBySymptoms(symptoms);
      recommendedSpecializations = [
        { specialization: fallbackResult.primary, priority: 1, matchPercentage: 95 }
      ];
      if (fallbackResult.secondary) {
        recommendedSpecializations.push({
          specialization: fallbackResult.secondary,
          priority: 2,
          matchPercentage: 70
        });
      }
    }
    
    // Step 4: Get doctors based on specializations
    const specNames = recommendedSpecializations.map(s => s.specialization);
    let doctors = await Doctor.find({
      specialization: { $in: specNames },
      isAvailable: true
    }).populate('userId', 'name email phone profileImage');
    
    // Add match percentage to doctors
    doctors = doctors.map(doctor => {
      const matchingSpec = recommendedSpecializations.find(
        s => s.specialization === doctor.specialization
      );
      return {
        ...doctor.toObject(),
        matchPercentage: matchingSpec?.matchPercentage || 50
      };
    });
    
    // Sort by match percentage
    doctors.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    
    // Step 5: Generate suggestions
    const suggestions = [];
    if (symptoms.includes('fever')) {
      suggestions.push('💊 Take rest and stay hydrated');
      suggestions.push('🌡️ Monitor your temperature every 4 hours');
    }
    if (symptoms.includes('cough')) {
      suggestions.push('🍯 Take warm water with honey');
    }
    if (symptoms.includes('cold')) {
      suggestions.push('💨 Take steam inhalation');
    }
    if (duration > 3) {
      suggestions.push('📅 Since symptoms persist for more than 3 days, please consult a doctor');
    }
    
    res.json({
      success: true,
      isEmergency: false,
      symptoms: symptoms,
      severity: severity || 'mild',
      recommendedSpecializations: recommendedSpecializations.slice(0, 3),
      doctors: doctors.slice(0, 10),
      suggestions: suggestions,
      disclaimer: '⚠️ This is an AI suggestion. Please consult a doctor for proper diagnosis.'
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback response using utils only
    const fallbackResult = symptomMappingUtils.getSpecializationBySymptoms(req.body.symptoms || []);
    res.json({
      success: true,
      isEmergency: false,
      source: 'fallback',
      recommendedSpecializations: [
        { specialization: fallbackResult.primary, priority: 1, matchPercentage: 100 }
      ],
      doctors: [],
      suggestions: ['Please consult a doctor for proper diagnosis'],
      disclaimer: 'Using fallback mode. Please consult a doctor.'
    });
  }
};

// Get symptoms by category
exports.getSymptomsByCategory = async (req, res) => {
  try {
    const categories = await Symptom.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', symptoms: { $push: '$$ROOT' } } }
    ]);
    
    res.json({ success: true, categories });
  } catch (error) {
    const fallbackCategories = symptomMappingUtils.getSymptomsByCategory();
    res.json({ success: true, source: 'fallback', categories: fallbackCategories });
  }
};

// Search symptoms
exports.searchSymptoms = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }
    
    const symptoms = await Symptom.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    }).limit(10);
    
    res.json({ success: true, count: symptoms.length, symptoms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};