import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', credentials)
          const { user, accessToken } = response.data
          
          set({ 
            user, 
            token: accessToken, 
            isLoading: false 
          })
          
          // Set token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          
          toast.success(`Welcome back, ${user.name}!`)
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/register', userData)
          const { user, accessToken } = response.data
          
          set({ 
            user, 
            token: accessToken, 
            isLoading: false 
          })
          
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          
          toast.success(`Welcome to SynergySphere, ${user.name}!`)
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, token: null })
          delete api.defaults.headers.common['Authorization']
          toast.success('Logged out successfully')
        }
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          set({ user: response.data, isLoading: false })
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ user: null, token: null, isLoading: false })
          delete api.defaults.headers.common['Authorization']
        }
      },

      updateProfile: async (userData) => {
        try {
          const response = await api.patch('/auth/me', userData)
          set({ user: response.data })
          toast.success('Profile updated successfully')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.message || 'Update failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true })
        try {
          await api.post('/auth/forgot-password', { email })
          set({ isLoading: false })
          toast.success('Password reset link sent to your email')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Failed to send reset email'
          toast.error(message)
          return { success: false, error: message }
        }
      },

      resetPassword: async (resetData) => {
        set({ isLoading: true })
        try {
          await api.post('/auth/reset-password', resetData)
          set({ isLoading: false })
          toast.success('Password reset successfully')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Password reset failed'
          toast.error(message)
          return { success: false, error: message }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
)

export { useAuthStore }
