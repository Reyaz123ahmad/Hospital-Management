// import React, { createContext, useState, useEffect, useContext } from 'react'
// import authService from '../services/authService'
// import toast from 'react-hot-toast'

// const AuthContext = createContext()

// export const useAuthContext = () => useContext(AuthContext)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(localStorage.getItem('token'))
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (token) {
//       fetchUser()
//     } else {
//       setLoading(false)
//     }
//   }, [token])

//   const fetchUser = async () => {
//     try {
//       const response = await authService.getProfile()
//       setUser(response.data.user)
//     } catch (error) {
//       console.error('Fetch user error:', error)
//       localStorage.removeItem('token')
//       setToken(null)
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await authService.login(email, password)
//       const { token, user } = response.data
//       localStorage.setItem('token', token)
//       setToken(token)
//       setUser(user)
//       toast.success(`Welcome back, ${user.name}!`)
//       return { success: true, user }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Login failed'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   const register = async (userData) => {
//     try {
//       const response = await authService.register(userData)
//       toast.success('Registration successful! Please login.')
//       return { success: true, data: response.data }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Registration failed'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem('token')
//     setToken(null)
//     setUser(null)
//     toast.success('Logged out successfully')
//   }

//   const updateProfile = async (data) => {
//     try {
//       const response = await authService.updateProfile(data)
//       setUser(response.data.user)
//       toast.success('Profile updated successfully')
//       return { success: true, user: response.data.user }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Update failed'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       await authService.changePassword({ currentPassword, newPassword })
//       toast.success('Password changed successfully')
//       return { success: true }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Password change failed'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   const forgotPassword = async (email) => {
//     try {
//       await authService.forgotPassword(email)
//       toast.success('Reset link sent to your email')
//       return { success: true }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Failed to send reset link'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   const resetPassword = async (token, password) => {
//     try {
//       await authService.resetPassword(token, password)
//       toast.success('Password reset successful! Please login')
//       return { success: true }
//     } catch (error) {
//       const message = error.response?.data?.message || 'Reset failed'
//       toast.error(message)
//       return { success: false, message }
//     }
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       token,
//       loading,
//       login,
//       register,
//       logout,
//       updateProfile,
//       changePassword,
//       forgotPassword,
//       resetPassword,
//       isAuthenticated: !!user,
//       isPatient: user?.role === 'patient',
//       isDoctor: user?.role === 'doctor',
//       isAdmin: user?.role === 'admin'
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

import React, { createContext, useState, useEffect, useContext } from 'react'
import authService from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext()  // ✅ SIRF YAHI CHANGE - "export" laga diya

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile()
      setUser(response.data.user)
    } catch (error) {
      console.error('Fetch user error:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      toast.success(`Welcome back, ${user.name}!`)
      return { success: true, user }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      toast.success('Registration successful! Please login.')
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data)
      setUser(response.data.user)
      toast.success('Profile updated successfully')
      return { success: true, user: response.data.user }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword({ currentPassword, newPassword })
      toast.success('Password changed successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const forgotPassword = async (email) => {
    try {
      await authService.forgotPassword(email)
      toast.success('Reset link sent to your email')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link'
      toast.error(message)
      return { success: false, message }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      await authService.resetPassword(token, password)
      toast.success('Password reset successful! Please login')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Reset failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      isAuthenticated: !!user,
      isPatient: user?.role === 'patient',
      isDoctor: user?.role === 'doctor',
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}
