import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoutes from './routes/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import Signup from './pages/SignUp'
import GoogleSuccess from './pages/GoogleSuccess'
import useAuth from './hooks/useAuth'

function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1114] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#35E9A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Before login, show the My Finance Track home page
  return <Home />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/home" element={<Home />} />
        
        {/* Auth routes */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* Authenticated Dashboard */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
