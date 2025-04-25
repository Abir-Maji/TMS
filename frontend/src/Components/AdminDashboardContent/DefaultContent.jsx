import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiUser, 
  FiBriefcase,
  FiUsers,
  FiRefreshCw,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiX
} from 'react-icons/fi';
import PieChartComponent from '../AdminDashboardContent/Charts/PieChartComponent';
import PropTypes from 'prop-types';

// Constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ALL_DESIGNATIONS = [
  { title: 'Software Engineer', icon: <FiBriefcase className="text-blue-500" size={24} />, color: 'bg-blue-100 text-blue-600' },
  { title: 'Senior Software Engineer', icon: <FiBriefcase className="text-green-500" size={24} />, color: 'bg-green-100 text-green-600' },
  { title: 'Team Lead', icon: <FiBriefcase className="text-purple-500" size={24} />, color: 'bg-purple-100 text-purple-600' },
  { title: 'Project Manager', icon: <FiBriefcase className="text-yellow-500" size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  { title: 'UI/UX Designer', icon: <FiBriefcase className="text-pink-500" size={24} />, color: 'bg-pink-100 text-pink-600' },
  { title: 'QA Engineer', icon: <FiBriefcase className="text-red-500" size={24} />, color: 'bg-red-100 text-red-600' },
  { title: 'DevOps Engineer', icon: <FiBriefcase className="text-indigo-500" size={24} />, color: 'bg-indigo-100 text-indigo-600' },
  { title: 'Product Manager', icon: <FiBriefcase className="text-teal-500" size={24} />, color: 'bg-teal-100 text-teal-600' },
  { title: 'HR Manager', icon: <FiBriefcase className="text-orange-500" size={24} />, color: 'bg-orange-100 text-orange-600' },
  { title: 'Marketing Specialist', icon: <FiBriefcase className="text-cyan-500" size={24} />, color: 'bg-cyan-100 text-cyan-600' }
];

const CHART_COLORS = [
  'rgba(99, 102, 241, 0.7)',
  'rgba(16, 185, 129, 0.7)',
  'rgba(245, 158, 11, 0.7)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(139, 92, 246, 0.7)'
];

// Sub-components
const DesignationCard = ({ designation }) => {
  const isPositive = designation?.change >= 0;
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{designation?.title || 'N/A'}</p>
          <p className="text-2xl font-bold mt-1">{designation?.count || 0}</p>
          <div className="flex items-center mt-1">
            {isPositive ? (
              <FiUsers className="text-green-500 mr-1" />
            ) : (
              <FiUsers className="text-red-500 mr-1" />
            )}
            <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(designation?.change || 0)}% {isPositive ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${designation?.color || 'bg-gray-100 text-gray-600'}`}>
          {designation?.icon || <FiBriefcase size={24} />}
        </div>
      </div>
    </div>
  );
};

DesignationCard.propTypes = {
  designation: PropTypes.shape({
    title: PropTypes.string,
    icon: PropTypes.element,
    color: PropTypes.string,
    count: PropTypes.number,
    change: PropTypes.number,
    key: PropTypes.string
  })
};

const AddAdminModal = ({ isOpen, onClose, onAddAdmin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'admin',
    status: 'active',
    permissions: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password || !formData.name) {
      setError('Required fields are missing');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const permissionsArray = formData.permissions 
        ? formData.permissions.split(',').map(p => p.trim())
        : [];
  
      await onAddAdmin({
        ...formData,
        permissions: permissionsArray
      });
      setFormData({ 
        username: '',
        password: '',
        name: '',
        role: 'admin',
        status: 'active',
        permissions: ''
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add admin');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Add New Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
            <input
              type="text"
              name="permissions"
              value={formData.permissions}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comma-separated permissions (e.g., create,read,update)"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank for default permissions</p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddAdminModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddAdmin: PropTypes.func.isRequired
};

const DefaultContent = ({ authToken }) => {
  const [designationStats, setDesignationStats] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get user data from localStorage with fallbacks
  const username = localStorage.getItem('adminUsername') ;
  const name = localStorage.getItem('adminName') || username;
  const role = localStorage.getItem('adminRole') || 'admin';
  const id = localStorage.getItem('adminId') || '';

  const fetchDesignationData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/control/stats/designations`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      const apiDataArray = Array.isArray(apiData) ? apiData : [];

      const mergedData = ALL_DESIGNATIONS.map(designation => {
        const apiStats = apiDataArray.find(item => item?.designation === designation.title) || {
          count: 0,
          teamCount: 0,
          change: 0
        };
        
        return {
          ...designation,
          count: apiStats.count || 0,
          teamCount: apiStats.teamCount || 0,
          change: apiStats.change || 0,
          key: designation.title
        };
      });

      setDesignationStats(mergedData);
      setTeamStats(apiDataArray.map(item => ({ 
        name: item?.designation || 'Unknown',
        count: item?.count || 0,
        key: item?.designation || 'unknown-' + Math.random()
      })));
    } catch (error) {
      console.error('Error fetching designation data:', error);
      setError(error.message || 'Failed to load designation statistics. Please try again.');

      if (process.env.NODE_ENV === 'development') {
        const sampleData = ALL_DESIGNATIONS.map(designation => ({
          ...designation,
          count: Math.floor(Math.random() * 10),
          teamCount: Math.floor(Math.random() * 3) + 1,
          change: Math.floor(Math.random() * 10) - 3,
          key: designation.title
        }));
        setDesignationStats(sampleData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchDesignationData();
  };

  const handleAddAdmin = async (adminData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admins/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...adminData,
          role: 'admin',
          status: 'active'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add admin');
      }

      setSuccessMessage('Admin added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  const departmentData = useMemo(() => ({
    labels: teamStats?.map(team => team?.name) || [],
    datasets: [{
      data: teamStats?.map(team => team?.count) || [],
      backgroundColor: CHART_COLORS,
      borderWidth: 1
    }]
  }), [teamStats]);

  useEffect(() => {
    fetchDesignationData();
  }, [authToken]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md mr-4">
              <FiUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{name}</span>
              </h1>
              <p className="text-gray-600 flex items-center">
                <FiBriefcase className="mr-2 text-blue-500" />
                <span>View <span className="font-semibold text-blue-600">designation statistics</span></span>
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Admin
            </button>
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              aria-label="Refresh data"
              aria-busy={isLoading}
            >
              <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-green-500 mr-2" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Designation Statistics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Designation Statistics</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : designationStats?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {designationStats.map((designation) => (
              <DesignationCard key={designation?.key || Math.random()} designation={designation} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <FiAlertCircle className="mr-2" />
            <span>No designation data available</span>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <PieChartComponent 
        data={departmentData} 
        title="Team Distribution" 
        key={JSON.stringify(teamStats)}
      />

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAdmin={handleAddAdmin}
      />
    </div>
  );
};

DefaultContent.propTypes = {
  authToken: PropTypes.string.isRequired
};

export default DefaultContent;