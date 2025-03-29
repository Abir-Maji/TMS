import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiUsers, FiActivity, FiCheckCircle, 
  FiUserPlus, FiList, FiSettings, FiRefreshCw, 
  FiTrendingUp, FiTrendingDown, FiAlertCircle 
} from 'react-icons/fi';
import PieChartComponent from '../AdminDashboardContent/Charts/PieChartComponent';

const DefaultContent = () => {
  const [stats, setStats] = useState([
    { title: 'Active Tasks', value: 24, icon: <FiCheckCircle className="text-blue-500" size={20} />, change: 12 },
    { title: 'Team Members', value: 15, icon: <FiUsers className="text-green-500" size={20} />, change: 3 },
    { title: 'Projects', value: 8, icon: <FiActivity className="text-purple-500" size={20} />, change: 5 },
    { title: 'Productivity', value: 86, icon: <FiActivity className="text-orange-500" size={20} />, change: 7 }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // Chart data
  const departmentData = {
    labels: ['Development', 'Marketing', 'Design', 'Support'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderWidth: 1
      }
    ]
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStats(prevStats => prevStats.map(stat => ({
        ...stat,
        value: Math.max(5, stat.value + (Math.random() > 0.5 ? 1 : -1)),
        change: Math.floor(Math.random() * 10) - 2
      })));
      
      setRecentActivity([
        { id: 1, action: 'Task completed', project: 'Web Redesign', time: '2 mins ago' },
        { id: 2, action: 'New member added', project: 'Marketing Team', time: '15 mins ago' },
        { id: 3, action: 'Project updated', project: 'Mobile App', time: '1 hour ago' }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md mr-4">
              <FiUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin</span>
              </h1>
              <p className="text-gray-600 flex items-center">
                <FiUsers className="mr-2 text-blue-500" />
                <span>Manage the <span className="font-semibold text-blue-600">Admin</span> teams</span>
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const isPositive = stat.change >= 0;
          return (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}{stat.title === 'Productivity' ? '%' : ''}</p>
                  <div className="flex items-center mt-1">
                    {isPositive ? (
                      <FiTrendingUp className="text-green-500 mr-1" />
                    ) : (
                      <FiTrendingDown className="text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(stat.change)}% {isPositive ? 'increase' : 'decrease'} from last week
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section - Now only Pie Chart */}
      <div className="grid grid-cols-1">
        <PieChartComponent 
          data={departmentData} 
          title="Team Distribution" 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
            <FiUserPlus className="text-blue-500 mb-2" size={24} />
            <span className="text-sm font-medium">Add User</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-100">
            <FiList className="text-green-500 mb-2" size={24} />
            <span className="text-sm font-medium">Create Task</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-100">
            <FiUsers className="text-purple-500 mb-2" size={24} />
            <span className="text-sm font-medium">Manage Team</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-100">
            <FiSettings className="text-orange-500 mb-2" size={24} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <FiActivity className="text-blue-500" size={16} />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.project} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <FiAlertCircle className="mr-2" />
            <span>No recent activity</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultContent;