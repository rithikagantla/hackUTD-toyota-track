import { useAuth0 } from '@auth0/auth0-react'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0()

  const login = async () => {
    await loginWithRedirect()
  }

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
