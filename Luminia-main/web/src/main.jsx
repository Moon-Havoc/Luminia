import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import KeyPage from './KeyPage.jsx'

function Router() {
  const path = window.location.pathname
  if (path === '/key') return <KeyPage />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
