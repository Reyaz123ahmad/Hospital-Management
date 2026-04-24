// src/utils/symptomMapping.js

// Simple JSON-based symptom to doctor mapping (Fallback/Reference)

const SYMPTOM_TO_SPECIALIZATION_MAPPING = {
  // ==================== FEVER RELATED ====================
  'fever': {
    primary: 'General Physician',
    secondary: 'Internal Medicine',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,cold': {
    primary: 'General Physician',
    secondary: 'Internal Medicine',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,cough': {
    primary: 'General Physician',
    secondary: 'Pulmonologist',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,cold,cough': {
    primary: 'General Physician',
    secondary: 'Pulmonologist',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,body_ache': {
    primary: 'General Physician',
    secondary: 'Rheumatologist',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,headache': {
    primary: 'General Physician',
    secondary: 'Neurologist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'high_fever': {
    primary: 'General Physician',
    secondary: 'Infectious Disease Specialist',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'High fever detected! Please consult immediately.'
  },

  // ==================== THROAT RELATED ====================
  'sore_throat': {
    primary: 'ENT Specialist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,sore_throat': {
    primary: 'ENT Specialist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'cough,sore_throat': {
    primary: 'ENT Specialist',
    secondary: 'Pulmonologist',
    isEmergency: false,
    severityLevel: 'mild'
  },

  // ==================== CHEST RELATED (EMERGENCY) ====================
  'chest_pain': {
    primary: 'Cardiologist',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'critical',
    message: '⚠️ EMERGENCY! Chest pain requires immediate medical attention.'
  },
  'chest_pain,breathing_difficulty': {
    primary: 'Cardiologist',
    secondary: 'Pulmonologist',
    isEmergency: true,
    severityLevel: 'critical',
    message: '⚠️ CRITICAL EMERGENCY! Visit nearest hospital immediately.'
  },
  'breathing_difficulty': {
    primary: 'Pulmonologist',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Difficulty breathing detected! Seek medical help now.'
  },

  // ==================== SKIN RELATED ====================
  'skin_rash': {
    primary: 'Dermatologist',
    secondary: 'Allergist',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'fever,skin_rash': {
    primary: 'Dermatologist',
    secondary: 'Infectious Disease Specialist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'itching': {
    primary: 'Dermatologist',
    secondary: 'Allergist',
    isEmergency: false,
    severityLevel: 'mild'
  },

  // ==================== STOMACH RELATED ====================
  'stomach_pain': {
    primary: 'Gastroenterologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'stomach_pain,nausea': {
    primary: 'Gastroenterologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'vomiting': {
    primary: 'Gastroenterologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'diarrhea': {
    primary: 'Gastroenterologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },

  // ==================== HEAD RELATED ====================
  'headache': {
    primary: 'Neurologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'migraine': {
    primary: 'Neurologist',
    secondary: 'Psychiatrist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'severe_headache': {
    primary: 'Neurologist',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Severe headache! Please consult neurologist urgently.'
  },

  // ==================== BONE/JOINT RELATED ====================
  'joint_pain': {
    primary: 'Rheumatologist',
    secondary: 'Orthopedic',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'body_ache,joint_pain': {
    primary: 'Rheumatologist',
    secondary: 'Orthopedic',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'back_pain': {
    primary: 'Orthopedic',
    secondary: 'Physiotherapist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'fracture': {
    primary: 'Orthopedic',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Fracture detected! Visit orthopedic immediately.'
  },

  // ==================== EYE RELATED ====================
  'eye_pain': {
    primary: 'Ophthalmologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'red_eyes': {
    primary: 'Ophthalmologist',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'vision_blur': {
    primary: 'Ophthalmologist',
    secondary: 'Neurologist',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Vision problem! Consult ophthalmologist immediately.'
  },

  // ==================== CHILD RELATED ====================
  'fever,child': {
    primary: 'Pediatrician',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'cough,child': {
    primary: 'Pediatrician',
    secondary: 'General Physician',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'vomiting,child': {
    primary: 'Pediatrician',
    secondary: 'Gastroenterologist',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Child vomiting! Consult pediatrician immediately.'
  },

  // ==================== PREGNANCY RELATED ====================
  'pregnancy': {
    primary: 'Gynecologist',
    secondary: 'Obstetrician',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'pregnancy,bleeding': {
    primary: 'Gynecologist',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'critical',
    message: '⚠️ URGENT! Pregnancy with bleeding requires immediate attention.'
  },

  // ==================== MENTAL HEALTH ====================
  'anxiety': {
    primary: 'Psychiatrist',
    secondary: 'Psychologist',
    isEmergency: false,
    severityLevel: 'mild'
  },
  'depression': {
    primary: 'Psychiatrist',
    secondary: 'Psychologist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'panic_attack': {
    primary: 'Psychiatrist',
    secondary: 'Emergency',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Panic attack! Psychiatric help needed.'
  },

  // ==================== KIDNEY/URINARY ====================
  'urine_pain': {
    primary: 'Urologist',
    secondary: 'Nephrologist',
    isEmergency: false,
    severityLevel: 'moderate'
  },
  'kidney_pain': {
    primary: 'Nephrologist',
    secondary: 'Urologist',
    isEmergency: true,
    severityLevel: 'severe',
    message: 'Kidney pain! Consult nephrologist immediately.'
  }
};

// All specializations list
const ALL_SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'ENT Specialist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'Psychiatrist',
  'Ophthalmologist',
  'Gastroenterologist',
  'Urologist',
  'Nephrologist',
  'Pulmonologist',
  'Rheumatologist',
  'Infectious Disease Specialist',
  'Allergist',
  'Physiotherapist',
  'Psychologist',
  'Obstetrician',
  'Internal Medicine',
  'Emergency'
];

// Function to get doctor specialization based on symptoms
function getSpecializationBySymptoms(symptoms) {
  if (!symptoms || symptoms.length === 0) {
    return {
      primary: 'General Physician',
      secondary: null,
      isEmergency: false,
      message: 'Please select symptoms for accurate recommendation'
    };
  }
  
  // Sort symptoms alphabetically to create key
  const sortedSymptoms = [...symptoms].sort();
  const symptomKey = sortedSymptoms.join(',');
  
  // Check for exact match
  if (SYMPTOM_TO_SPECIALIZATION_MAPPING[symptomKey]) {
    return SYMPTOM_TO_SPECIALIZATION_MAPPING[symptomKey];
  }
  
  // Check for partial match (at least 2 symptoms)
  let bestMatch = null;
  let maxMatchCount = 0;
  
  for (const [key, value] of Object.entries(SYMPTOM_TO_SPECIALIZATION_MAPPING)) {
    const keySymptoms = key.split(',');
    const matchCount = symptoms.filter(s => keySymptoms.includes(s)).length;
    
    if (matchCount > maxMatchCount && matchCount >= 2) {
      maxMatchCount = matchCount;
      bestMatch = value;
    }
  }
  
  if (bestMatch) {
    return bestMatch;
  }
  
  // Check for single symptom match
  for (const symptom of symptoms) {
    if (SYMPTOM_TO_SPECIALIZATION_MAPPING[symptom]) {
      return SYMPTOM_TO_SPECIALIZATION_MAPPING[symptom];
    }
  }
  
  // Default fallback
  return {
    primary: 'General Physician',
    secondary: null,
    isEmergency: false,
    message: 'Consult a General Physician for initial checkup'
  };
}

// Function to check if symptoms are emergency
function isEmergencySymptom(symptoms) {
  if (!symptoms) return false;
  
  for (const symptom of symptoms) {
    const mapping = SYMPTOM_TO_SPECIALIZATION_MAPPING[symptom];
    if (mapping && mapping.isEmergency) {
      return true;
    }
  }
  return false;
}

// Function to get emergency message
function getEmergencyMessage(symptoms) {
  for (const symptom of symptoms) {
    const mapping = SYMPTOM_TO_SPECIALIZATION_MAPPING[symptom];
    if (mapping && mapping.isEmergency && mapping.message) {
      return mapping.message;
    }
  }
  return 'Please seek immediate medical attention';
}

// Function to get all symptoms list
function getAllSymptomsList() {
  return Object.keys(SYMPTOM_TO_SPECIALIZATION_MAPPING)
    .filter(key => !key.includes(','))
    .sort();
}

// Function to get symptoms by category
function getSymptomsByCategory() {
  const categories = {
    fever: [],
    pain: [],
    respiratory: [],
    digestive: [],
    skin: [],
    emergency: []
  };
  
  for (const [symptom, value] of Object.entries(SYMPTOM_TO_SPECIALIZATION_MAPPING)) {
    if (symptom.includes(',')) continue;
    
    if (value.isEmergency) {
      categories.emergency.push(symptom);
    } else if (symptom.includes('fever')) {
      categories.fever.push(symptom);
    } else if (symptom.includes('pain')) {
      categories.pain.push(symptom);
    } else if (symptom.includes('cough') || symptom.includes('breathing')) {
      categories.respiratory.push(symptom);
    } else if (symptom.includes('stomach') || symptom.includes('vomiting') || symptom.includes('nausea')) {
      categories.digestive.push(symptom);
    } else if (symptom.includes('rash') || symptom.includes('skin')) {
      categories.skin.push(symptom);
    }
  }
  
  return categories;
}

module.exports = {
  SYMPTOM_TO_SPECIALIZATION_MAPPING,
  ALL_SPECIALIZATIONS,
  getSpecializationBySymptoms,
  isEmergencySymptom,
  getEmergencyMessage,
  getAllSymptomsList,
  getSymptomsByCategory
};