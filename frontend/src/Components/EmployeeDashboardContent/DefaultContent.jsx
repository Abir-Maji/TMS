import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiAlertTriangle,
  FiRefreshCw,
  FiPlus,
  FiX
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import PriorityPieChart from './Charts/PriorityPieChart';
import TeamMembersPage from './Charts/TeamMembersPage';

const DefaultContent = () => {
  // Get user data from localStorage
  const name = localStorage.getItem('name');
  const team = localStorage.getItem('team');
  const username = localStorage.getItem('username');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full mb-8"
        />
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Loading your dashboard...
        </motion.h1>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh]"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <FiAlertCircle className="text-red-500 text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Error loading dashboard</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-md text-center">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section - Updated with new design */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative mr-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <FiUser className="text-white text-2xl" />
              </div>
              {team && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2
                  }}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full px-3 py-1 text-xs font-semibold text-blue-600 flex items-center shadow-md border border-blue-100"
                >
                  <FiUsers className="mr-1 text-blue-500" />
                  {team}
                </motion.div>
              )}
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                Welcome back,{' '}
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%']
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 4,
                    ease: "linear"
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                >
                  {name || username || 'User'}
                </motion.span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 flex items-center"
              >
                {team ? (
                  <>
                    <span className="relative inline-flex mr-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                      <FiUsers className="relative text-blue-500" />
                    </span>
                    Here's what's happening with your team <span className="font-semibold text-blue-600 ml-1">{team}</span>&nbsp;today
                  </>
                ) : (
                  <>
                    <FiAlertTriangle className="mr-2 text-yellow-500" />
                    Team information not available
                  </>
                )}
              </motion.p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Task
            </button>
            <button 
              onClick={refreshData}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 mb-6"
        >
          <div className="flex items-center">
            <FiCheckCircle className="text-green-500 mr-2" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </motion.div>
      )}

     

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <div className="">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiCheckCircle className="text-blue-500 mr-2" />
                Priority Overview
              </h2>
            </div>
            <PriorityPieChart />
          </div>

          <div className="bg-white rounded-2xl mt-6 shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiUsers className="text-purple-500 mr-2" />
                Team Members
              </h2>
            </div>
            <TeamMembersPage />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DefaultContent;