import React, { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiFilter, 
  FiSearch, 
  FiRefreshCw,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiCircle,
  FiUser
} from 'react-icons/fi';

const ProgressReporting = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      // Ensure tasks is always an array
      const tasksArray = Array.isArray(data) ? data : 
                        Array.isArray(data?.tasks) ? data.tasks : [];
      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
      setTasks([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (progress) => {
    if (progress >= 90) return 'bg-green-100 text-green-800';
    if (progress >= 50) return 'bg-blue-100 text-blue-800';
    if (progress > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (progress) => {
    if (progress >= 90) return <FiCheckCircle className="text-green-500" />;
    if (progress >= 50) return <FiCircle className="text-blue-500" />;
    return <FiAlertCircle className="text-yellow-500" />;
  };

  // Safe filtering with null checks
  const filteredTasks = tasks?.filter(task => {
    const taskTitle = task?.title || '';
    const taskUsers = task?.users || '';
    const taskProgress = task?.progress || 0;
    
    const matchesSearch = taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         taskUsers.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && taskProgress >= 100) ||
                         (filterStatus === 'in-progress' && taskProgress < 100 && taskProgress > 0) ||
                         (filterStatus === 'not-started' && taskProgress === 0);
    return matchesSearch && matchesStatus;
  }) || [];

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="">
      <div className="max-auto mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <FiTrendingUp className="text-2xl" />
            <h2 className="text-2xl font-bold">Task Progress Reporting</h2>
          </div>
          <p className="mt-1 opacity-90">View progress of all tasks</p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Tasks</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or assigned users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchTasks}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Task Progress Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <FiLoader className="animate-spin text-3xl text-blue-500" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task?._id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{task?.title || 'Untitled Task'}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task?.description || 'No description'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiUser className="mr-2 text-green-500" />
                          {task?.users || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task?.team || 'No team'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(task?.progress || 0)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task?.progress || 0)}`}>
                            {task?.progress >= 100 ? 'Completed' : 
                             task?.progress > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${task?.progress || 0}%`,
                                backgroundColor: task?.progress >= 90 ? '#10B981' : 
                                               task?.progress >= 50 ? '#3B82F6' : '#F59E0B'
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{task?.progress || 0}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No tasks found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressReporting;