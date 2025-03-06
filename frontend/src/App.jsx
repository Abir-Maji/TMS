// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import EmployeeLogin from './Pages/EmployeeLogin';
import Dashboard from './Components/Dashboard'; // Import Dashboard
import ErrorBoundary from './ErrorBoundary.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/EmployeeLogin"
          element={
            <ErrorBoundary>
              <EmployeeLogin />
            </ErrorBoundary>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
      </Routes>
    </Router>
  );
};

export default App;