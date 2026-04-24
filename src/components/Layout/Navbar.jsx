// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUserMd, FaCalendarAlt, FaStethoscope } from 'react-icons/fa'
// import { useAuth } from '../../hooks/useAuth'

// const Navbar = () => {
//   const { user, logout, isAuthenticated } = useAuth()
//   const navigate = useNavigate()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)

//   const handleLogout = () => {
//     logout()
//     navigate('/')
//     setIsDropdownOpen(false)
//   }

//   const getDashboardLink = () => {
//     if (!user) return '/'
//     switch(user.role) {
//       case 'patient': return '/patient/dashboard'
//       case 'doctor': return '/doctor/dashboard'
//       case 'admin': return '/admin/dashboard'
//       default: return '/'
//     }
//   }

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Doctors', path: '/doctors' },
//     { name: 'Symptom Analyzer', path: '/symptom-analyzer' },
//   ]

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
//               <FaStethoscope className="text-white text-xl" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
//               HospitalMS
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center gap-6">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </div>

//           {/* Desktop Auth Section */}
//           <div className="hidden md:flex items-center gap-4">
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
//                     {user?.name?.charAt(0)}
//                   </div>
//                   <span className="text-gray-700">{user?.name?.split(' ')[0]}</span>
//                 </button>

//                 <AnimatePresence>
//                   {isDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
//                     >
//                       <Link
//                         to={getDashboardLink()}
//                         className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
//                         onClick={() => setIsDropdownOpen(false)}
//                       >
//                         <FaTachometerAlt size={16} />
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
//                       >
//                         <FaSignOutAlt size={16} />
//                         Logout
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all"
//                 >
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden text-gray-600 text-2xl"
//           >
//             {isMenuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden pb-4"
//             >
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//               <div className="border-t pt-4 mt-2">
//                 {isAuthenticated ? (
//                   <>
//                     <Link
//                       to={getDashboardLink()}
//                       className="block py-2 text-gray-600 hover:text-primary-600"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Dashboard
//                     </Link>
//                     <button
//                       onClick={() => {
//                         handleLogout()
//                         setIsMenuOpen(false)
//                       }}
//                       className="block w-full text-left py-2 text-red-600"
//                     >
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       to="/login"
//                       className="block py-2 text-gray-600 hover:text-primary-600"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Login
//                     </Link>
//                     <Link
//                       to="/register"
//                       className="block py-2 text-primary-600 font-medium"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Register
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   )
// }

// export default Navbar



import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaStethoscope } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
    setIsMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    switch(user.role) {
      case 'patient': return '/patient/dashboard'
      case 'doctor': return '/doctor/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
    }
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Symptom Analyzer', path: '/symptom-analyzer' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - FIXED: Removed bg-clip-text */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-linear-to-r from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <FaStethoscope className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-indigo-700">
              HospitalMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-indigo-600 transition-all duration-300 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section - FIXED: Removed px-90 */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-linear-to-r from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
                    >
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaTachometerAlt size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <FaSignOutAlt size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-linear-to-r from-indigo-500 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 text-2xl shrink-0 hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 mt-2"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2.5 px-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-3 mt-2 border-t border-gray-100">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 py-2.5 px-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaTachometerAlt size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 py-2.5 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <FaSignOutAlt size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block py-2.5 px-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block py-2.5 px-3 bg-linear-to-r from-indigo-500 to-indigo-700 text-white rounded-lg text-center font-medium hover:shadow-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar