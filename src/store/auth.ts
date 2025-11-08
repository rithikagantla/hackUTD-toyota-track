import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  setLoading: (loading: boolean) => void
}

// Simulate async auth (in production, this would call an API)
const simulateAuth = (duration: number = 1500) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        await simulateAuth()

        // Simple validation
        if (email && password.length >= 6) {
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            createdAt: new Date(),
          }
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        }

        set({ isLoading: false })
        return false
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        await simulateAuth()

        // Simple validation
        if (email && password.length >= 6 && name) {
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            createdAt: new Date(),
          }
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        }

        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'toyota-nexus-auth',
    }
  )
)
