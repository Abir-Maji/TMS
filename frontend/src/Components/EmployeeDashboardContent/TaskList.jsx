import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiUsers, FiUser, FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiSearch } from 'react-icons/fi';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const team = localStorage.getItem('team');
      if (!team) throw new Error('No team found in localStorage. Please log in again.');

      const response = await fetch(`${API_BASE_URL}/api/employee/tasks/by-team?team=${team.trim()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      if (!data.tasks || data.tasks.length === 0) {
        setError('No tasks found for your team.');
      } else {
        setTasks(data.tasks);
        setFilteredTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Failed to fetch tasks. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityGradient = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'from-red-500 to-red-400';
      case 'medium':
        return 'from-yellow-500 to-yellow-400';
      case 'low':
        return 'from-green-500 to-green-400';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <FiAlertTriangle className="text-red-600" />;
      case 'medium':
        return <FiAlertCircle className="text-yellow-600" />;
      case 'low':
        return <FiCheckCircle className="text-green-600" />;
      default:
        return <FiAlertCircle className="text-gray-600" />;
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.priority.toLowerCase().includes(term) ||
        (task.users && task.users.toLowerCase().includes(term)) || // Changed from task.user to task.users
        task.team.toLowerCase().includes(term)
      );
      setFilteredTasks(filtered);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Your Team Tasks
      </h2>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <span className="absolute right-3 top-2 text-sm text-gray-500">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div 
              key={task._id}
              className={`rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-xl`}
            >
              <div className={`h-2 bg-gradient-to-r ${getPriorityGradient(task.priority)}`}></div>
              
              <div className="p-5 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 truncate">{task.title}</h3>
                  <div className="flex items-center">
                    {getPriorityIcon(task.priority)}
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="mr-2 text-purple-600" />
                    <span className="font-medium">Uploaded:</span>
                    <span className="ml-2">{new Date(task.currentDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FiClock className="mr-2 text-purple-600" />
                    <span className="font-medium">Deadline:</span>
                    <span className={`ml-2 ${
                      new Date(task.deadline) < new Date() ? 'text-red-600 font-bold' : ''
                    }`}>
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FiUsers className="mr-2 text-purple-600" />
                    <span className="font-medium">Team:</span>
                    <span className="ml-2">{task.team}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FiUser className="mr-2 text-purple-600" />
                    <span className="font-medium">Assigned to:</span>
                    <span className="ml-2">{task.users || 'Unassigned'}</span> {/* Changed from task.user to task.users */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && !error && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {searchTerm ? (
                <FiSearch className="text-gray-400 text-3xl" />
              ) : (
                <FiCalendar className="text-gray-400 text-3xl" />
              )}
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              {searchTerm ? 'No matching tasks found' : 'No tasks found'}
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? 'Try a different search term' : 'There are currently no tasks assigned to your team'}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilteredTasks(tasks);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;