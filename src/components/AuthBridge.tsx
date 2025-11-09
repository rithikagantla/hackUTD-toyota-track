import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuthStore } from '../store/auth'

/**
 * AuthBridge synchronizes Auth0 state with Zustand store
 * and wires Auth0 actions to the store's methods.
 */
export function AuthBridge() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0()
  const setFromAuth0 = useAuthStore((s) => s.setFromAuth0)

  // Sync Auth0 status + profile to Zustand
  useEffect(() => {
    setFromAuth0({
      isAuthenticated,
      isLoading,
      email: user?.email ?? null,
      name: user?.name ?? user?.nickname ?? null,
      sub: user?.sub ?? null,
    })
  }, [isAuthenticated, isLoading, user, setFromAuth0])

  // Wire actions (keeps your old API working)
  useEffect(() => {
    useAuthStore.setState({
      login: async (opts?: { screenHint?: 'signup' | 'login' }) =>
        loginWithRedirect({
          appState: { returnTo: '/app' },
          authorizationParams: { screen_hint: opts?.screenHint ?? 'login' },
        }),
      signup: async () =>
        loginWithRedirect({
          appState: { returnTo: '/app' },
          authorizationParams: { screen_hint: 'signup' },
        }),
      logout: async () =>
        logout({
          logoutParams: { returnTo: window.location.origin + '/' },
        }),
    })
  }, [loginWithRedirect, logout])

  return null // No UI
}
