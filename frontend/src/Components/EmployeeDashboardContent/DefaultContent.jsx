import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiAlertTriangle,
  FiCalendar,
  FiSearch,
  FiBriefcase
} from 'react-icons/fi';
import PriorityPieChart from './Charts/PriorityPieChart';
const DefaultContent = () => {
  // Get user data from localStorage
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const team = localStorage.getItem('team');
  const username = localStorage.getItem('username');
  const designation = localStorage.getItem('designation');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading delay (remove in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-md animate-pulse">
          <FiUser className="text-white text-4xl" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading your dashboard...
            </span>
          </h1>
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-md">
          <FiAlertCircle className="text-white text-4xl" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Error loading dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-md">
          <FiUser className="text-white text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {name || username || 'User'}
          </span>!
        </h1>
        {team ? (
          <p className="text-lg text-gray-600 flex items-center">
            <FiUsers className="mr-2 text-blue-500" />
            You're working with the <span className="font-semibold text-blue-600 ml-1">{team}</span> team
          </p>
        ) : (
          <p className="text-lg text-gray-600">Your team information is not available.</p>
        )}
      </div>
     
      {/* Dashboard Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {['Tasks', 'Progress', 'Collaboration', 'Profile'].map((item) => (
          <button
            key={item}
            className={`px-6 py-3 rounded-lg font-medium flex items-center transition-colors ${
              item === 'Progress' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {item === 'Tasks' && <FiBriefcase className="mr-2" />}
            {item === 'Progress' && <FiCheckCircle className="mr-2" />}
            {item === 'Collaboration' && <FiUsers className="mr-2" />}
            {item === 'Profile' && <FiUser className="mr-2" />}
            {item}
          </button>
        ))}
      </div>
      <PriorityPieChart />
      {/* Dashboard Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCalendar className="text-gray-400 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Tasks Overview</h2>
        <p className="text-gray-600 mb-6">All your tasks and progress will appear here</p>
        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <FiRefreshCw className="inline mr-2" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DefaultContent;