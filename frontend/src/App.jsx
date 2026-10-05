
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoutes from './routes/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>

       <Routes>
        
          <Route path='/signin' element={Login} />

          <Route path='/signup' element={Register} />

          <Route element = {<ProtectedRoutes/>}>
             <Route path='/' element={<Dashboard/>} />
          </Route>

       </Routes>
    
    </BrowserRouter>
  )
}

export default App
