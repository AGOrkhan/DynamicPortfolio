import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from './utils/api'
import AdminLogin from './components/Admin/AdminLogin'
import AdminPanel from './components/Admin/AdminPanel'

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const verifyAuth = async () => {
            const token = sessionStorage.getItem('adminToken')
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                await api.post('/api/admin/verify')
                setIsAuthenticated(true)
            } catch (error) {
                sessionStorage.removeItem('adminToken')
                toast.error('Session expired, please login again')
            } finally {
                setIsLoading(false)
            }
        }

        verifyAuth()
    }, [navigate])

    if (isLoading) {
        return <div className="min-h-screen bg-[#0b263a] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    }

    return (
        <div className='min-h-screen bg-[#0b263a]'>
            <Routes>
                {/* Prevent authenticated users from seeing login */}
                <Route path="login" element={
                    !isAuthenticated 
                        ? <AdminLogin /> 
                        : <Navigate to="/admin" replace />
                } />
                
                {/* Protect admin routes */}
                <Route path="/" element={
                    isAuthenticated 
                        ? <AdminPanel /> 
                        : <Navigate to="/admin/login" replace />
                } />
                
                {/* Catch invalid paths */}
                <Route path="*" element={
                    <Navigate to="/admin/login" replace />
                } />
            </Routes>
        </div>
    );
}

export default AdminApp