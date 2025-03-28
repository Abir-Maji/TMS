import React from 'react';
import { FiUser, FiUsers } from 'react-icons/fi';

const DefaultContent = () => {
  // Get user data from localStorage
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const team = localStorage.getItem('team');
  const username = localStorage.getItem('username');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center text-center mb-8">
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
            You're working with the<span className="font-semibold text-blue-600 ml-1">{team}&ensp;</span>team
          </p>
        ) : (
          <p className="text-lg text-gray-600">Your team information is not available.</p>
        )}
      </div>
    </div>
  );
};

export default DefaultContent;