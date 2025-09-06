import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import socketService from '../services/socket'

export const useSocket = () => {
  const { user, token } = useAuthStore()

  useEffect(() => {
    if (user && token) {
      socketService.connect(token)
    }

    return () => {
      socketService.disconnect()
    }
  }, [user, token])

  return socketService
}
