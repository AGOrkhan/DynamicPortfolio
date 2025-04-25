import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './styles.css'
import App from './App.jsx'
import AdminApp from './AdminApp.jsx'
import ProjectBlog from './ProjectBlog.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/projects" element={<ProjectBlog />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)