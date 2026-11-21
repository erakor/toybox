import { createRoot } from 'react-dom/client'
import { ToyboxThemeProvider } from '@erakor/toybox'
import '@erakor/toybox/styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <ToyboxThemeProvider className="min-h-screen">
    <App />
  </ToyboxThemeProvider>,
)
