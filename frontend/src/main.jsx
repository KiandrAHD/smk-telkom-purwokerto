import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import LanguageProvider from './context/LanguageProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SiteSettingsProvider><App /></SiteSettingsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
