import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './routes/AppRoutes.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { UserAuthProvider } from './context/UserAuthContext.jsx'
import './assets/fonts/gilroy.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AdminAuthProvider>
      <UserAuthProvider>
        <MotionConfig reducedMotion="never">
          <App />
        </MotionConfig>
      </UserAuthProvider>
    </AdminAuthProvider>
  </BrowserRouter>,
);
