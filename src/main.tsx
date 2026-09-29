// tokens.css starts with the Google Fonts @import, so it must be the first CSS in the bundle.
import './styles/tokens.css'
import './styles/base.css'
import './styles/primitives.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App, preloadScreens } from './App'
import { installAutoGrowFallback } from './lib/autoGrow'

// Sentence boxes grow with their text; this sizes them where CSS field-sizing is missing.
installAutoGrowFallback()

// A deep link's screens start loading now; everything else once the first page has loaded.
preloadScreens()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
