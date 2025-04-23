import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiList, 
  FiTrendingUp, 
  FiUsers, 
  FiUserPlus,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiCalendar,
  FiSettings
} from 'react-icons/fi';
import TaskAssignment from '../Components/AdminDashboardContent/TaskAssignment';
import DeadlineTracking from '../Components/AdminDashboardContent/DeadlineTracking';
import ProgressReporting from '../Components/AdminDashboardContent/ProgressReporting';
import Collaboration from '../Components/AdminDashboardContent/Collaboration';
import RegisterEmployee from '../Components/AdminDashboardContent/RegisterEmployee';
import ViewEmployees from '../Components/AdminDashboardContent/ViewEmployees';
import DefaultContent from '../Components/AdminDashboardContent/DefaultContent';
import logo from '../assets/logo1.png';
import NotificationBell from '../Components/AdminNotificationBell';

const AdminDashboard = () => {
  const [activeContent, setActiveContent] = useState('default');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const nameFromStorage = localStorage.getItem('username') || 
                               localStorage.getItem('name') || 
                               'Admin';
        setAdminName(nameFromStorage);

        // Set user data for ChatIcon
        setUser({
          _id: localStorage.getItem('userId'),
          role: 'admin',
          name: nameFromStorage
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setAdminName('Admin');
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
  };

  const sidebarItems = [
    { 
      id: 'default', 
      label: 'Dashboard', 
      component: <DefaultContent />,
      icon: <FiHome size={20} />
    },
    { 
      id: 'taskAssignment', 
      label: 'Task Assignment', 
      component: <TaskAssignment />,
      icon: <FiList size={20} />
    },
    { 
      id: 'deadlineTracking', 
      label: 'Deadlines', 
      component: <DeadlineTracking />,
      icon: <FiCalendar size={20} />
    },
    { 
      id: 'progressReporting', 
      label: 'Progress', 
      component: <ProgressReporting />,
      icon: <FiTrendingUp size={20} />
    },
    { 
      id: 'collaboration', 
      label: 'Collaboration', 
      component: <Collaboration />,
      icon: <FiUsers size={20} />
    },
    { 
      id: 'registerEmployee', 
      label: 'Register Employee', 
      component: <RegisterEmployee />,
      icon: <FiUserPlus size={20} />
    },
    { 
      id: 'viewEmployees', 
      label: 'View Employees', 
      component: <ViewEmployees />,
      icon: <FiUser size={20} />
    },
  ];

  const renderContent = () => {
    const selectedItem = sidebarItems.find((item) => item.id === activeContent);
    return selectedItem ? selectedItem.component : <DefaultContent />;
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <div className={`flex flex-col h-full bg-white transition-all duration-300 shadow-lg ${isSidebarExpanded ? 'w-72' : 'w-20'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {isSidebarExpanded && (
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-8" />
              <span className="text-xl font-semibold text-gray-800">Admin Panel</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isSidebarExpanded ? <FiX size={20} /> : <FiMenu size={20} />}
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
                  <span className={`${activeContent === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
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
            <FiLogOut size={20} />
            {isSidebarExpanded && (
              <span className="ml-4 font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">
              {sidebarItems.find(item => item.id === activeContent)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-sm">
                  {getInitials(adminName)}
                </div>
                {isSidebarExpanded && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{adminName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            {renderContent()}
          </div>
        </div>
        {/* Add ChatIcon component here */}
        
      </div>
    </div>
  );
};

export default AdminDashboard;