import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CompareProvider } from './context/CompareContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CompareProvider>
        <App />
      </CompareProvider>
    </AuthProvider>
  </React.StrictMode>,
)
