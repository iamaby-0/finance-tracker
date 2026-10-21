import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoutes from './routes/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { Income } from './pages/Income'
import { Budgets } from './pages/Budgets'
import { Transactions } from './pages/Transactions'
import { Expenses } from './pages/Expenses'
import { Analytics } from './pages/Analytics'
import { Reports } from './pages/Reports'
import Signup from './pages/Signup'
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* Authenticated Dashboard, Income, Budgets, Transactions & Expenses */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/budget" element={<Budgets />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expense" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
