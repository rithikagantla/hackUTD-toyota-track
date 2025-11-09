import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from '../components/ui/Button'

export default function Login() {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/app'
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: { returnTo: '/app' },
    })
  }

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center">
      {/* Subtle background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-toyota-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-20 h-20 mx-auto mb-4">
              <img
                src="/toyota_logo_signup.png"
                alt="Toyota Nexus"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-toyota-black mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Toyota Nexus account</p>
        </div>

        {/* Auth0 Login Button */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            <Button
              onClick={handleLogin}
              fullWidth
              size="lg"
              disabled={isLoading}
              className="!py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Sign In with Auth0'
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Secure authentication powered by Auth0
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-toyota-red hover:text-red-600 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-toyota-black text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
