import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import Chatbot from './components/Chatbot'
import LoadingScreen from './components/LoadingScreen'
import { useAuthStore } from './store/auth'

// Public routes
import Landing from './routes/Landing'
import Login from './routes/Login'
import Signup from './routes/Signup'

// Protected routes
import Home from './routes/Home'
import Explore from './routes/Explore'
import VehicleDetail from './routes/VehicleDetail'
import ProfileQuiz from './routes/ProfileQuiz'
import QuizResults from './routes/QuizResults'
import About from './routes/About'

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Layout />
}

// Layout wrapper with navigation and footer (for authenticated users)
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

// Animated page wrapper
function AnimatedOutlet() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

// Main app component with routing
export default function App() {
  const [showLoading, setShowLoading] = useState(true)

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen onComplete={() => setShowLoading(false)} duration={2000} />
        )}
      </AnimatePresence>

      {!showLoading && (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<AnimatedOutlet />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="vehicle/:id" element={<VehicleDetail />} />
              <Route path="quiz" element={<ProfileQuiz />} />
              <Route path="quiz-results" element={<QuizResults />} />
              <Route path="about" element={<About />} />
            </Route>
          </Route>

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
