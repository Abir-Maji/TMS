import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import EmployeeLogin from './Pages/EmployeeLogin';
import Dashboard from './Components/Dashboard'; // Import Dashboard
import ErrorBoundary from './ErrorBoundary.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx'; // Import Admin Dashboard
import EmployeeDetails from './Components/EmployeeDashboardContent/EmployeeDetails'; // Import View Profile

const App = () => {
  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Get the user's role

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
        <Route path="/employee/:id" element={<EmployeeDetails />} /> {/* Route for employee details by ID */}
        <Route path="/employee/username/:username" element={<EmployeeDetails />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />

        {/* Protected Route - Only accessible if authenticated */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/EmployeeLogin" replace />
            )
          }
        />

        {/* Admin Dashboard Route - Only accessible if authenticated and role is admin */}
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/AdminLogin" replace />
            )
          }
        />

        {/* Fallback Route - Redirect to Login if no matching route */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
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