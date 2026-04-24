import { useCallback } from 'react'
import toast from 'react-hot-toast'

export const useToast = () => {
  const showSuccess = useCallback((message) => {
    toast.success(message, {
      icon: '✅',
      style: {
        background: '#22c55e',
        color: '#fff',
      },
    })
  }, [])

  const showError = useCallback((message) => {
    toast.error(message, {
      icon: '❌',
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    })
  }, [])

  const showInfo = useCallback((message) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    })
  }, [])

  const showLoading = useCallback((message) => {
    return toast.loading(message)
  }, [])

  return { showSuccess, showError, showInfo, showLoading }
}