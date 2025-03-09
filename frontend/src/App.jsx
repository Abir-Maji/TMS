import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import EmployeeLogin from './Pages/EmployeeLogin';
import Dashboard from './Components/Dashboard'; // Import Dashboard
import ErrorBoundary from './ErrorBoundary.jsx';
import EmployeeRegister from './Pages/EmployeeRegister.jsx';

const App = () => {
  // Check if the user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

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
        <Route path="/EmployeeRegister" element={<EmployeeRegister />} />

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

        {/* Fallback Route - Redirect to Login if no matching route */}
        <Route path="*" element={<Navigate to="/EmployeeLogin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;