export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
}

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
}

export const SPECIALIZATIONS = [
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
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const GENDERS = ['male', 'female', 'other']

export const SEVERITY_LEVELS = ['mild', 'moderate', 'severe', 'critical']

export const SYMPTOM_CATEGORIES = ['general', 'severe', 'chronic', 'emergency']