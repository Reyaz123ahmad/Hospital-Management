// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { FaUsers, FaUserMd, FaUser, FaShieldAlt, FaBan, FaCheckCircle, FaEdit } from 'react-icons/fa'
// import adminService from '../../services/adminService'
// import Button from '../Common/Button'
// import Modal from '../Common/Modal'
// import LoadingSpinner from '../Common/LoadingSpinner'
// import { formatDate } from '../../utils/helpers'
// import toast from 'react-hot-toast'

// const ManageUsers = () => {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [showRoleModal, setShowRoleModal] = useState(false)
//   const [newRole, setNewRole] = useState('')

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const fetchUsers = async () => {
//     try {
//       const response = await adminService.getUsers()
//       setUsers(response.data.users || [])
//     } catch (error) {
//       console.error('Error fetching users:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleBlockUser = async (userId, isActive) => {
//     try {
//       if (isActive) {
//         await adminService.blockUser(userId)
//         toast.success('User blocked successfully')
//       } else {
//         await adminService.unblockUser(userId)
//         toast.success('User unblocked successfully')
//       }
//       fetchUsers()
//     } catch (error) {
//       console.error('Error updating user status:', error)
//     }
//   }

//   const handleRoleChange = async () => {
//     if (!newRole) return
//     try {
//       await adminService.changeUserRole(selectedUser._id, newRole)
//       toast.success(`Role changed to ${newRole}`)
//       setShowRoleModal(false)
//       fetchUsers()
//     } catch (error) {
//       console.error('Error changing role:', error)
//     }
//   }

//   const getRoleIcon = (role) => {
//     switch(role) {
//       case 'admin': return <FaShieldAlt className="text-red-500" />
//       case 'doctor': return <FaUserMd className="text-blue-500" />
//       default: return <FaUser className="text-green-500" />
//     }
//   }

//   const getRoleBadge = (role) => {
//     const styles = {
//       admin: 'bg-red-100 text-red-700',
//       doctor: 'bg-blue-100 text-blue-700',
//       patient: 'bg-green-100 text-green-700'
//     }
//     return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>{role}</span>
//   }

//   if (loading) return <LoadingSpinner />

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <FaUsers /> Manage Users
//             </h1>
//             <p className="text-white/80 mt-1">View, manage roles, and control user access</p>
//           </div>

//           <div className="p-6">
//             {users.length === 0 ? (
//               <div className="text-center py-12">
//                 <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No users found</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
//                       <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {users.map((user, idx) => (
//                       <motion.tr
//                         key={user._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.05 }}
//                         className="hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-3">
//                           <div>
//                             <p className="font-medium text-gray-800 flex items-center gap-2">
//                               {getRoleIcon(user.role)}
//                               {user.name}
//                             </p>
//                             <p className="text-xs text-gray-500">ID: {user._id?.slice(-6)}</p>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">
//                           <p className="text-sm text-gray-600">{user.email}</p>
//                           <p className="text-sm text-gray-500">{user.phone}</p>
//                         </td>
//                         <td className="px-4 py-3">
//                           {getRoleBadge(user.role)}
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                             {user.isActive ? 'Active' : 'Blocked'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-500">
//                           {formatDate(user.createdAt)}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex gap-2">
//                             {user.role !== 'admin' && (
//                               <Button size="sm" variant="outline" onClick={() => {
//                                 setSelectedUser(user)
//                                 setNewRole(user.role)
//                                 setShowRoleModal(true)
//                               }}>
//                                 <FaEdit /> Role
//                               </Button>
//                             )}
//                             <Button 
//                               size="sm" 
//                               variant={user.isActive ? 'danger' : 'success'} 
//                               onClick={() => handleBlockUser(user._id, user.isActive)}
//                             >
//                               {user.isActive ? <FaBan /> : <FaCheckCircle />}
//                               {user.isActive ? ' Block' : ' Unblock'}
//                             </Button>
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       {/* Change Role Modal */}
//       <Modal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} title="Change User Role">
//         {selectedUser && (
//           <div className="space-y-4">
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-500">User</p>
//               <p className="font-medium">{selectedUser.name}</p>
//               <p className="text-sm text-gray-500">{selectedUser.email}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
//               <select
//                 value={newRole}
//                 onChange={(e) => setNewRole(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg"
//               >
//                 <option value="patient">Patient</option>
//                 <option value="doctor">Doctor</option>
//               </select>
//             </div>
//             <div className="flex gap-3">
//               <Button type="button" variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
//               <Button type="button" variant="primary" onClick={handleRoleChange}>Change Role</Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default ManageUsers



import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaUserMd, FaUser, FaShieldAlt, FaBan, FaCheckCircle, FaEdit } from 'react-icons/fa'
import adminService from '../../services/adminService'
import Button from '../Common/Button'
import Modal from '../Common/Modal'
import LoadingSpinner from '../Common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [newRole, setNewRole] = useState('')

  // ✅ Cleanup flag ke saath Effect - 100% error free
  useEffect(() => {
    let isMounted = true
    
    const fetchUsers = async () => {
      try {
        const response = await adminService.getUsers()
        if (isMounted) {
          setUsers(response.data.users || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchUsers()
    
    return () => {
      isMounted = false
    }
  }, [])

  const handleBlockUser = async (userId, isActive) => {
    try {
      if (isActive) {
        await adminService.blockUser(userId)
        toast.success('User blocked successfully')
      } else {
        await adminService.unblockUser(userId)
        toast.success('User unblocked successfully')
      }
      
      // Refresh users list after block/unblock
      const response = await adminService.getUsers()
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleRoleChange = async () => {
    if (!newRole) return
    try {
      await adminService.changeUserRole(selectedUser._id, newRole)
      toast.success(`Role changed to ${newRole}`)
      setShowRoleModal(false)
      
      // Refresh users list after role change
      const response = await adminService.getUsers()
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error changing role:', error)
      toast.error('Failed to change role')
    }
  }

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <FaShieldAlt className="text-red-500" />
      case 'doctor': return <FaUserMd className="text-blue-500" />
      default: return <FaUser className="text-green-500" />
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-700',
      doctor: 'bg-blue-100 text-blue-700',
      patient: 'bg-green-100 text-green-700'
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>{role}</span>
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaUsers /> Manage Users
            </h1>
            <p className="text-white/80 mt-1">View, manage roles, and control user access</p>
          </div>

          <div className="p-6">
            {users.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((user, idx) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                              {getRoleIcon(user.role)}
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">ID: {user._id?.slice(-6)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.isActive ? 'Active' : 'Blocked'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {user.role !== 'admin' && (
                              <Button size="sm" variant="outline" onClick={() => {
                                setSelectedUser(user)
                                setNewRole(user.role)
                                setShowRoleModal(true)
                              }}>
                                <FaEdit /> Role
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant={user.isActive ? 'danger' : 'success'} 
                              onClick={() => handleBlockUser(user._id, user.isActive)}
                            >
                              {user.isActive ? <FaBan /> : <FaCheckCircle />}
                              {user.isActive ? ' Block' : ' Unblock'}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Change Role Modal */}
      <Modal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} title="Change User Role">
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowRoleModal(false)}>Cancel</Button>
              <Button type="button" variant="primary" onClick={handleRoleChange}>Change Role</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ManageUsers