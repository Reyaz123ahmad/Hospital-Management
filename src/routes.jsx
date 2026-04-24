import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Lazy load components for better performance
const Home = React.lazy(() => import('./components/Public/Home'))
const DoctorsList = React.lazy(() => import('./components/Public/DoctorsList'))
const DoctorDetail = React.lazy(() => import('./components/Public/DoctorDetail'))
const SymptomAnalyzer = React.lazy(() => import('./components/Public/SymptomAnalyzer'))
const Login = React.lazy(() => import('./components/Auth/Login'))
const Register = React.lazy(() => import('./components/Auth/Register'))
const ForgotPassword = React.lazy(() => import('./components/Auth/ForgotPassword'))
const PatientDashboard = React.lazy(() => import('./components/Patient/PatientDashboard'))
const DoctorDashboard = React.lazy(() => import('./components/Doctor/DoctorDashboard'))
const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'))

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const AppRoutes = () => {
  const { user } = useAuth()
  
  // Get dashboard route based on role
  const getDashboardRoute = () => {
    if (!user) return '/'
    switch(user.role) {
      case 'patient': return '/patient/dashboard'
      case 'doctor': return '/doctor/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
    }
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Patient Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Doctor Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirect to appropriate dashboard */}
        <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />
      </Routes>
    </React.Suspense>
  )
}

export default AppRoutes