import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Body from './pages/Body.jsx'
import appStore from './utils/appStore.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Body />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
