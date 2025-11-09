import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { AuthBridge } from './components/AuthBridge'
import App from './app.tsx'
import './styles/globals.css'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || ''
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || ''

if (!domain || !clientId) {
  console.error('Missing Auth0 environment variables. Please check your .env file.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        window.location.href = appState?.returnTo || '/app'
      }}
    >
      <AuthBridge />
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
