import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Ensure a default background color even if Tailwind isn't applied
try { document.body.style.backgroundColor = '#f8fafc' } catch (e) { /* ignore in non-browser env */ }

const root = document.getElementById('root')
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
