import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import EmployeeLogin from './Pages/EmployeeLogin';
import Dashboard from './Components/Dashboard'; 
import ErrorBoundary from './ErrorBoundary.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx'; 
import EmployeeDetails from './Components/EmployeeDashboardContent/EmployeeDetails';
 

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role'); 

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/EmployeeLogin"
          element={
            <ErrorBoundary>
              <EmployeeLogin />
            </ErrorBoundary>
          }
        />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* Employee Details Page - Accessible via URL */}
        <Route path="/employee/:username" element={<EmployeeDetails />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/EmployeeLogin" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/AdminLogin" replace />}
        />

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/EmployeeLogin" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
