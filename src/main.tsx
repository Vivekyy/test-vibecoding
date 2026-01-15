import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App'
import './styles.css'

if (import.meta.env.DEV) {
  const yellowDragon = `
      /\\
 _   /  \\
 \\'-/ /\\ \\
 / / ____ \\
/__/\\____\\_\\
`
  console.log(
    '%cYellow Dragon keeping watch over the console.',
    'color:#facc15;font-size:16px;font-weight:600;'
  )
  console.log(`%c${yellowDragon}`, 'color:#facc15;font-family:monospace;')
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
