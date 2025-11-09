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
  // Simple email-based login
  login: (email: string, name?: string) => Promise<void>
  signup: (email: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  setFromAuth0: (p: {
    isAuthenticated: boolean
    isLoading: boolean
    email?: string | null
    name?: string | null
    sub?: string | null
  }) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Simple email-based login - no Auth0 required
      login: async (email: string, name?: string) => {
        const user: User = {
          id: email,
          email,
          name: name || email.split('@')[0],
          createdAt: new Date(),
        }
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      signup: async (email: string, name?: string) => {
        const user: User = {
          id: email,
          email,
          name: name || email.split('@')[0],
          createdAt: new Date(),
        }
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      // Kept for compatibility with Auth0 bridge if needed
      setFromAuth0: ({ isAuthenticated, isLoading, email, name, sub }) => {
        set({
          isAuthenticated,
          isLoading,
          user: isAuthenticated
            ? {
                id: sub || email || 'user',
                email: email || 'unknown@example.com',
                name: name || 'User',
                createdAt: new Date(),
              }
            : null,
        })
      },
    }),
    {
      name: 'toyota-nexus-auth',
    }
  )
)
