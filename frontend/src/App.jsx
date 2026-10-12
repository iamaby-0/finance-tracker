import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoutes from './routes/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import Signup from './pages/SignUp'
import GoogleSuccess from './pages/GoogleSuccess'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
