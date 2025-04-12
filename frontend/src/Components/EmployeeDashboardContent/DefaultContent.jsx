import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiAlertTriangle
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-16 relative"
      >
        {/* Profile avatar with animated ring */}
        <div className="relative mb-6">
          <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
            <FiUser className="text-white text-5xl z-10" />
            {/* Animated gradient ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 via-indigo-500 rounded-full opacity-20"
              style={{
                backgroundImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6)',
                backgroundSize: '400% 400%'
              }}
            />
          </div>
          
          {/* Team badge with pulse animation */}
          {team && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }}
              className="absolute -bottom-2 -right-2 bg-white rounded-full px-4 py-1 text-sm font-semibold text-blue-600 flex items-center shadow-md border border-blue-100"
            >
              <FiUsers className="mr-2 text-blue-500" />
              {team} Team
            </motion.div>
          )}
        </div>
        
        {/* Welcome text with gradient animation */}
        <motion.h1 className="text-4xl font-bold text-gray-800 mb-3">
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
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            {name || username || 'User'}
          </motion.span>
          !
        </motion.h1>
        
        {/* Team status with fade-in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {team ? (
            <p className="text-lg text-gray-600 flex items-center justify-center">
              <span className="relative inline-flex mr-2">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                <FiUsers className="relative text-blue-500" />
              </span>
              Here's what's happening with your team <span className="font-semibold text-blue-600 ml-1">{team}</span>&nbsp;today
            </p>
          ) : (
            <p className="text-lg text-gray-400 flex items-center justify-center">
              <FiAlertTriangle className="mr-2 text-yellow-500" />
              Team information not available
            </p>
          )}
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-blue-100 opacity-20 blur-xl -z-10"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-100 opacity-20 blur-xl -z-10"></div>
      </motion.div>

      {/* Dashboard Navigation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-12"
      >
        <motion.button
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 rounded-xl font-medium flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <FiCheckCircle className="mr-3 text-lg" />
          <span className="text-lg">Progress</span>
        </motion.button>
      </motion.div>

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