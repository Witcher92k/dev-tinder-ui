import { Outlet } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'

// Layout shell. Shared chrome (Navbar, toasts) goes around <Outlet />.
function App() {
  return (
    <div className="min-h-svh bg-stone-50">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
