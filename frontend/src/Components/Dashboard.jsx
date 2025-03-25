import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../Components/EmployeeDashboardContent/TaskList';
import EmployeeDetails from './EmployeeDashboardContent/EmployeeDetails';
import ProgressReporting from '../Components/EmployeeDashboardContent/ProgressReporting';
import Collaboration from '../Components/EmployeeDashboardContent/Collaboration';
import RoleManagement from '../Components/AdminDashboardContent/RoleManagement';
import DefaultContent from '../Components/EmployeeDashboardContent/DefaultContent';
import logo from '../assets/logo1.png';

const Dashboard = () => {
  const username = localStorage.getItem('username');

  const [activeContent, setActiveContent] = useState('default');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const sidebarItems = [
    {
      id: 'default',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      label: 'Dashboard'
    },
    {
      id: 'TaskList',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      label: 'Tasks'
    },
    {
      id: 'progressReporting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      ),
      label: 'Progress'
    },
    {
      id: 'collaboration',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      label: 'Collaboration'
    },
    {
      id: 'EmployeeDetails',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      label: 'Profile'
    }
  ];

  const renderContent = () => {
    switch (activeContent) {
      case 'TaskList': return <TaskList />;
      case 'progressReporting': return <ProgressReporting />;
      case 'collaboration': return <Collaboration />;
      case 'roleManagement': return <RoleManagement />;
      case 'EmployeeDetails': return <EmployeeDetails />;
      default: return <DefaultContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar inspired by finance dashboard */}
      <div className={`flex flex-col h-full bg-white transition-all duration-300 shadow-lg ${isSidebarExpanded ? 'w-72' : 'w-20'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {isSidebarExpanded ? (
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-8" />
              <span className="text-xl font-semibold text-gray-800">TaskHub</span>
            </div>
          ) : (
            <></>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isSidebarExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveContent(item.id)}
                  className={`flex items-center w-full p-4 rounded-xl transition-colors ${activeContent === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className={`flex items-center justify-center ${activeContent === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {isSidebarExpanded && (
                    <span className="ml-4 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-4 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isSidebarExpanded && (
              <span className="ml-4 font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header with rounded corners and shadow */}
          <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeContent === 'default' && 'Dashboard Overview'}
              {activeContent === 'TaskList' && 'Task Management'}
              {activeContent === 'progressReporting' && 'Progress Reports'}
              {activeContent === 'collaboration' && 'Team Collaboration'}
              {activeContent === 'EmployeeDetails' && 'My Profile'}
            </h1>
            <div className="flex items-center space-x-4">
              {/* <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}
              <button className="p-2 rounded-xl bg-white shadow-sm hover:bg-gray-50 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
                  AD
                </div>
                {isSidebarExpanded && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{username}</p>
                    {/* <p className="text-xs text-gray-500">Admin</p> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content area with rounded corners */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;