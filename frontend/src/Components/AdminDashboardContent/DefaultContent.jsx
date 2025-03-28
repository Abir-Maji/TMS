import React from 'react';
import { FiUser, FiUsers, FiActivity, FiAward, FiBarChart2, FiCheckCircle, FiUserPlus, FiList, FiSettings } from 'react-icons/fi';

const DefaultContent = () => {
  // Get user data from localStorage
  const username = localStorage.getItem('username');
  const team = localStorage.getItem('team');
  const role = localStorage.getItem('role') || 'Administrator';

  // Dashboard statistics
  const stats = [
    { title: 'Active Tasks', value: '24', icon: <FiCheckCircle className="text-blue-500" size={20} />, change: '+12%' },
    { title: 'Team Members', value: '15', icon: <FiUsers className="text-green-500" size={20} />, change: '+3%' },
    { title: 'Projects', value: '8', icon: <FiActivity className="text-purple-500" size={20} />, change: '+5%' },
    { title: 'Productivity', value: '86%', icon: <FiBarChart2 className="text-orange-500" size={20} />, change: '+7%' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-md">
            <FiUser className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {'Admin'}
            </span>
          </h1>
          <p className="text-gray-600 flex items-center justify-center">
            {team ? (
              <>
                <FiUsers className="mr-2 text-blue-500" />
                <span>Manage the <span className="font-semibold text-blue-600"></span> teams</span>
              </>
            ) : (
              "Administrator Dashboard"
            )}
          </p>
          <div className="mt-3 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {role}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-green-500 mt-1">{stat.change} from last week</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FiUserPlus className="text-blue-500 mb-2" size={20} />
            <span className="text-sm font-medium">Add User</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <FiList className="text-green-500 mb-2" size={20} />
            <span className="text-sm font-medium">Create Task</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FiUsers className="text-purple-500 mb-2" size={20} />
            <span className="text-sm font-medium">Manage Team</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <FiSettings className="text-orange-500 mb-2" size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          Select a feature from the sidebar to manage your team, assign tasks, or view reports.
        </p>
        <div className="flex items-center text-blue-600">
          <FiActivity className="mr-2" />
          <span className="text-sm font-medium">Recent activity will appear here</span>
        </div>
      </div>
    </div>
  );
};

export default DefaultContent;