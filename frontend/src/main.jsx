import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (via @fontsource) — remplace les imports Google Fonts
import '@fontsource/metal-mania'
import '@fontsource/rubik-distressed'
import '@fontsource/rubik-moonrocks'
import '@fontsource/permanent-marker'
import '@fontsource/patrick-hand'
import '@fontsource/architects-daughter'
import '@fontsource/caveat-brush'
import '@fontsource/indie-flower'
import '@fontsource/cinzel-decorative'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
