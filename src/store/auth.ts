import { create } from 'zustand'

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
  // Bridge to Auth0 behaviors
  login: (opts?: { screenHint?: 'signup' | 'login' }) => Promise<void>
  signup: () => Promise<void>
  logout: () => Promise<void>
  setFromAuth0: (p: {
    isAuthenticated: boolean
    isLoading: boolean
    email?: string | null
    name?: string | null
    sub?: string | null
  }) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Filled by the bridge component
  setFromAuth0: ({ isAuthenticated, isLoading, email, name, sub }) => {
    set({
      isAuthenticated,
      isLoading,
      user: isAuthenticated
        ? {
            id: sub || 'auth0',
            email: email || 'unknown@example.com',
            name: name || 'User',
            createdAt: new Date(),
          }
        : null,
    })
  },

  // These will be wired by the bridge to call Auth0
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
}))
