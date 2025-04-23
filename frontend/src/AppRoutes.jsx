import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import EmployeeLogin from './Pages/EmployeeLogin';
import Dashboard from './Components/Dashboard';
import ErrorBoundary from './ErrorBoundary.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import EmployeeDetails from './Components/EmployeeDashboardContent/EmployeeDetails';

// Define API base URL from environment variables
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const AppRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const checkSession = async () => {
        let isMounted = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/check-session`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!isMounted) return;

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setIsAuthenticated(true);
                    setRole(data.role);
                    if (data.role === 'admin') {
                        navigate('/admin/dashboard', { replace: true });
                    } else {
                        navigate('/dashboard', { replace: true });
                    }
                }
            }
        } catch (error) {
            console.error('Session check error:', error);
        } finally {
            if (isMounted) setIsLoading(false);
        }

        return () => { isMounted = false; };
    };

    useEffect(() => {
        checkSession();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setRole(null);
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/EmployeeLogin" element={
                <ErrorBoundary>
                    <EmployeeLogin 
                        apiBaseUrl={API_BASE_URL}
                        onLoginSuccess={(userRole) => {
                            setIsAuthenticated(true);
                            setRole(userRole);
                            navigate('/dashboard', { replace: true });
                        }} 
                    />
                </ErrorBoundary>
            } />
            
            <Route path="/AdminLogin" element={
                <ErrorBoundary>
                    <AdminLogin 
                        apiBaseUrl={API_BASE_URL}
                        onLoginSuccess={() => {
                            setIsAuthenticated(true);
                            setRole('admin');
                            navigate('/admin/dashboard', { replace: true });
                        }} 
                    />
                </ErrorBoundary>
            } />
            
            <Route path="/dashboard" element={
                isAuthenticated && role !== 'admin' ? (
                    <ErrorBoundary>
                        <Dashboard 
                            apiBaseUrl={API_BASE_URL}
                            onLogout={handleLogout} 
                        />
                    </ErrorBoundary>
                ) : <Navigate to="/EmployeeLogin" replace />
            } />
            
            <Route path="/admin/dashboard" element={
                isAuthenticated && role === 'admin' ? (
                    <ErrorBoundary>
                        <AdminDashboard 
                            apiBaseUrl={API_BASE_URL}
                            onLogout={handleLogout} 
                        />
                    </ErrorBoundary>
                ) : <Navigate to="/AdminLogin" replace />
            } />
            
            <Route path="/employee/:username" element={
                <ErrorBoundary>
                    <EmployeeDetails 
                        apiBaseUrl={API_BASE_URL}
                    />
                </ErrorBoundary>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;