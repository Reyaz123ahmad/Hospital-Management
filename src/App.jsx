// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import { AnimatePresence } from 'framer-motion'
// import Navbar from './components/Layout/Navbar'
// import Footer from './components/Layout/Footer'
// import { useAuth } from './hooks/useAuth'
// import LoadingSpinner from './components/Common/LoadingSpinner'

// // Public Components
// import Home from './components/Public/Home'
// import DoctorsList from './components/Public/DoctorsList'
// import DoctorDetail from './components/Public/DoctorDetail'
// import SymptomAnalyzer from './components/Public/SymptomAnalyzer'

// // Auth Components
// import Login from './components/Auth/Login'
// import Register from './components/Auth/Register'
// import ForgotPassword from './components/Auth/ForgotPassword'

// // Patient Components
// import PatientDashboard from './components/Patient/PatientDashboard'
// import PatientProfile from './components/Patient/PatientProfile'
// import BookAppointment from './components/Patient/BookAppointment'
// import MyAppointments from './components/Patient/MyAppointments'
// import Prescriptions from './components/Patient/Prescriptions'
// import MedicalHistory from './components/Patient/MedicalHistory'
// import FamilyMembers from './components/Patient/FamilyMembers'
// import Reviews from './components/Patient/Reviews'

// // Doctor Components
// import DoctorDashboard from './components/Doctor/DoctorDashboard'
// import DoctorAppointments from './components/Doctor/DoctorAppointments'
// import DoctorProfile from './components/Doctor/DoctorProfile'
// import AddPrescription from './components/Doctor/AddPrescription'
// import AvailabilitySettings from './components/Doctor/AvailabilitySettings'

// // Lab Test Components
// import TokenVerification from './components/LabStaff/LabTokenVerification';
// import MyLabTests from './components/Patient/MyLabTests';
// import MyReports from './components/Patient/MyLabReports.';
// import AddLabTest from './components/Doctor/AddLabTest';
// import DoctorLabTests from './components/Doctor/DoctorLabTests';

// // Radiology Components
// import RadiologyTokenVerification from './components/Radiology/RadiologyTokenVerification';
// import MyRadiologyTests from './components/Patient/MyRadiologyTests';
// import MyRadiologyReports from './components/Patient/MyRadiologyReports';
// import AddRadiologyTest from './components/Doctor/CreateRadiologyTest';
// import DoctorRadiologyTests from './components/Doctor/DoctorRadiologyTests';

// // Admin Components
// import AdminDashboard from './components/Admin/AdminDashboard'
// import ManageDoctors from './components/Admin/ManageDoctors'
// import ManagePatients from './components/Admin/ManagePatients'
// import ManageUsers from './components/Admin/ManageUsers'
// import Reports from './components/Admin/Reports'
// import SymptomsManagement from './components/Admin/SymptomsManagement'
// import SymptomMappings from './components/Admin/SymptomMappings'

// // Payment Component
// import PaymentPage from './components/Payment/PaymentPage'

// function App() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-white text-lg font-medium">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Navbar />
//       <main className="flex-grow">
//         <AnimatePresence mode="wait">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/doctors" element={<DoctorsList />} />
//             <Route path="/doctors/:id" element={<DoctorDetail />} />
//             <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />

//             {/* Auth Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />

//             {/* Payment Route */}
//             <Route path="/payment/:appointmentId" element={<PaymentPage />} />

//             {/* Patient Routes */}
//             <Route path="/patient/dashboard" element={<PatientDashboard />} />
//             <Route path="/patient/profile" element={<PatientProfile />} />
//             <Route path="/patient/book-appointment" element={<BookAppointment />} />
//             <Route path="/patient/appointments" element={<MyAppointments />} />
//             <Route path="/patient/prescriptions" element={<Prescriptions />} />
//             <Route path="/patient/medical-history" element={<MedicalHistory />} />
//             <Route path="/patient/family-members" element={<FamilyMembers />} />
//             <Route path="/patient/reviews" element={<Reviews />} />

//             {/* Doctor Routes */}
//             <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
//             <Route path="/doctor/appointments" element={<DoctorAppointments />} />
//             <Route path="/doctor/profile" element={<DoctorProfile />} />
//             <Route path="/doctor/prescription/new" element={<AddPrescription />} />
//             <Route path="/doctor/availability" element={<AvailabilitySettings />} />
            
            

//             {/* Admin Routes */}
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/admin/doctors" element={<ManageDoctors />} />
//             <Route path="/admin/patients" element={<ManagePatients />} />
//             <Route path="/admin/users" element={<ManageUsers />} />
//             <Route path="/admin/reports" element={<Reports />} />
//             <Route path="/admin/symptoms" element={<SymptomsManagement />} />
//             <Route path="/admin/symptom-mappings" element={<SymptomMappings />} />
//           </Routes>
//         </AnimatePresence>
//       </main>
//       <Footer />
//     </div>
//   )
// }

// export default App





import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import { useAuth } from './hooks/useAuth'
import LoadingSpinner from './components/Common/LoadingSpinner'

// Public Components
import Home from './components/Public/Home'
import DoctorsList from './components/Public/DoctorsList'
import DoctorDetail from './components/Public/DoctorDetail'
import SymptomAnalyzer from './components/Public/SymptomAnalyzer'

// Auth Components
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ForgotPassword from './components/Auth/ForgotPassword'

// Patient Components
import PatientDashboard from './components/Patient/PatientDashboard'
import PatientProfile from './components/Patient/PatientProfile'
import BookAppointment from './components/Patient/BookAppointment'
import MyAppointments from './components/Patient/MyAppointments'
import Prescriptions from './components/Patient/Prescriptions'
import MedicalHistory from './components/Patient/MedicalHistory'
import FamilyMembers from './components/Patient/FamilyMembers'
import Reviews from './components/Patient/Reviews'

// Patient Lab + Radiology Components
import MyLabTests from './components/Patient/MyLabTests'
import MyLabReports from './components/Patient/MyLabReports'
import GetLabStatus from './components/Patient/GetLabStatus'
import MyRadiologyTests from './components/Patient/MyRadiologyTests'
import MyRadiologyReports from './components/Patient/MyRadiologyReports'
import GetRadiologyStatus from './components/Patient/GetRadiologyStatus'

// Doctor Components
import DoctorDashboard from './components/Doctor/DoctorDashboard'
import DoctorAppointments from './components/Doctor/DoctorAppointments'
import DoctorProfile from './components/Doctor/DoctorProfile'
import AddPrescription from './components/Doctor/AddPrescription'
import AvailabilitySettings from './components/Doctor/AvailabilitySettings'

// Doctor Lab + Radiology Components
import CreateLabTest from './components/Doctor/CreateLabTest'
import DoctorLabTests from './components/Doctor/DoctorLabTests'
import DoctorLabReport from './components/Doctor/DoctorLabReport'
import CreateRadiologyTest from './components/Doctor/CreateRadiologyTest'
import DoctorRadiologyTests from './components/Doctor/DoctorRadiologyTests'
import DoctorRadiologyReport from './components/Doctor/DoctorRadiologyReport'

// Lab Staff Components
import LabTokenVerification from './components/LabStaff/LabTokenVerification'

// Radiology Staff Components
import RadiologyTokenVerification from './components/RadiologyStaff/RadiologyTokenVerification'

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard'
import ManageDoctors from './components/Admin/ManageDoctors'
import ManagePatients from './components/Admin/ManagePatients'
import ManageUsers from './components/Admin/ManageUsers'
import Reports from './components/Admin/Reports'
import SymptomsManagement from './components/Admin/SymptomsManagement'
import SymptomMappings from './components/Admin/SymptomMappings'
import AdminLabTests from './components/Admin/AdminLabTests'
import AdminRadiologyTests from './components/Admin/AdminRadiologyTests'

// Payment Component
import PaymentPage from './components/Payment/PaymentPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />

            {/* ==================== AUTH ROUTES ==================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ==================== PAYMENT ROUTE ==================== */}
            <Route path="/payment/:appointmentId" element={<PaymentPage />} />

            {/* ==================== PATIENT ROUTES ==================== */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route path="/patient/prescriptions" element={<Prescriptions />} />
            <Route path="/patient/medical-history" element={<MedicalHistory />} />
            <Route path="/patient/family-members" element={<FamilyMembers />} />
            <Route path="/patient/reviews" element={<Reviews />} />
            
            {/* Patient Lab Routes */}
            <Route path="/patient/lab-tests" element={<MyLabTests />} />
            <Route path="/patient/lab-reports" element={<MyLabReports />} />
            <Route path="/patient/lab-status/:testId" element={<GetLabStatus />} />
            
            {/* Patient Radiology Routes */}
            <Route path="/patient/radiology-tests" element={<MyRadiologyTests />} />
            <Route path="/patient/radiology-reports" element={<MyRadiologyReports />} />
            <Route path="/patient/radiology-status/:testId" element={<GetRadiologyStatus />} />

            {/* ==================== DOCTOR ROUTES ==================== */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route path="/doctor/prescription/new" element={<AddPrescription />} />
            <Route path="/doctor/availability" element={<AvailabilitySettings />} />
            
            {/* Doctor Lab Routes */}
            <Route path="/doctor/lab-tests" element={<DoctorLabTests />} />
            <Route path="/doctor/lab-tests/new" element={<CreateLabTest />} />
            <Route path="/doctor/lab-report/:reportId" element={<DoctorLabReport />} />
            
            {/* Doctor Radiology Routes */}
            <Route path="/doctor/radiology-tests" element={<DoctorRadiologyTests />} />
            <Route path="/doctor/radiology-tests/new" element={<CreateRadiologyTest />} />
            <Route path="/doctor/radiology-report/:reportId" element={<DoctorRadiologyReport />} />

            {/* ==================== LAB STAFF ROUTES ==================== */}
            <Route path="/lab/verify" element={<LabTokenVerification />} />

            {/* ==================== RADIOLOGY STAFF ROUTES ==================== */}
            <Route path="/radiology/verify" element={<RadiologyTokenVerification />} />

            {/* ==================== ADMIN ROUTES ==================== */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
            <Route path="/admin/patients" element={<ManagePatients />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/symptoms" element={<SymptomsManagement />} />
            <Route path="/admin/symptom-mappings" element={<SymptomMappings />} />
            
            {/* Admin Lab + Radiology Routes */}
            <Route path="/admin/lab-tests" element={<AdminLabTests />} />
            <Route path="/admin/radiology-tests" element={<AdminRadiologyTests />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App