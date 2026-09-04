import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Body from './pages/Body.jsx'
import DiscoverPage from './pages/discover/DiscoverPage.jsx'
import Connections from './pages/Connections.jsx'
import Requests from './pages/Requests.jsx'
import appStore from './utils/appStore.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Body />} />
          <Route path="login" element={<Login />} />
          <Route path="requests" element={<Requests />} />
          <Route path="connections" element={<Connections />} />
        </Route>
        {/* full-screen mobile experience - outside the App shell so the site
            navbar doesn't compete with its own top/bottom navigation */}
        <Route path="/discover" element={<DiscoverPage />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
