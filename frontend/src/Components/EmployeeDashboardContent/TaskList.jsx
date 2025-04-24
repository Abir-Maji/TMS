import React, { useState, useEffect } from 'react';
import {
  FiClock, FiCalendar, FiUsers, FiUser, FiAlertTriangle,
  FiAlertCircle, FiCheckCircle, FiSearch, FiChevronDown,
  FiGrid, FiList, FiEdit, FiRefreshCw, FiCheck, FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date-newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [editingTask, setEditingTask] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [completingTaskId, setCompletingTaskId] = useState(null);

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
        const processedTasks = data.tasks.map(task => ({
          ...task,
          status: task.progress === 100 ? 'completed' : (task.status || 'in-progress')
        }));
        setTasks(processedTasks);
        setFilteredTasks(processedTasks);
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

  const getPriorityBadge = (priority) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
        priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
      }`}>
      {priority}
    </span>
  );

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 90) return 'bg-green-400';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
        (task.users && task.users.toLowerCase().includes(term)) ||
        task.team.toLowerCase().includes(term)
      );
      setFilteredTasks(filtered);
    }
  };

  const handleSort = (option) => {
    setSortOption(option);
    setIsSortOpen(false);
    let sortedTasks = [...filteredTasks];

    switch (option) {
      case 'priority-high':
        sortedTasks.sort((a, b) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()];
        });
        break;
      case 'priority-low':
        sortedTasks.sort((a, b) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[b.priority.toLowerCase()] - priorityOrder[a.priority.toLowerCase()];
        });
        break;
      case 'date-newest':
        sortedTasks.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
        break;
      case 'date-oldest':
        sortedTasks.sort((a, b) => new Date(a.currentDate) - new Date(b.currentDate));
        break;
      case 'deadline-asc':
        sortedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'deadline-desc':
        sortedTasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        break;
      case 'progress-high':
        sortedTasks.sort((a, b) => b.progress - a.progress);
        break;
      case 'progress-low':
        sortedTasks.sort((a, b) => a.progress - b.progress);
        break;
      default:
        sortedTasks = [...tasks].filter(task =>
          searchTerm === '' ||
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.priority.toLowerCase().includes(searchTerm) ||
          (task.users && task.users.toLowerCase().includes(searchTerm)) ||
          task.team.toLowerCase().includes(searchTerm)
        );
    }

    setFilteredTasks(sortedTasks);
  };

  const updateProgress = async (taskId, newProgress) => {
    try {
      const updateData = { progress: newProgress };

      if (newProgress === 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date().toISOString();
        updateData.completedBy = localStorage.getItem('username') || 'Unknown User';
      } else {
        updateData.status = 'in-progress';
      }

      const response = await fetch(`${API_BASE_URL}/api/employee/tasks/update-progress/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const updatedTask = await response.json();

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? {
            ...task,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'in-progress',
            completedAt: newProgress === 100 ? new Date().toISOString() : null,
            completedBy: newProgress === 100 ? (localStorage.getItem('username') || 'Unknown User') : null
          } : task
        )
      );

      setFilteredTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? {
            ...task,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'in-progress',
            completedAt: newProgress === 100 ? new Date().toISOString() : null,
            completedBy: newProgress === 100 ? (localStorage.getItem('username') || 'Unknown User') : null
          } : task
        )
      );

      setEditingTask(null);

      if (newProgress === 100) {
        toast.success('Task marked as completed successfully!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error(`Failed to update progress: ${error.message}`);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setProgressValue(task.progress);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const handleProgressChange = (e) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setProgressValue(value);
  };

  const completeTask = async (taskId) => {
    try {
      setCompletingTaskId(taskId);
      await updateProgress(taskId, 100);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setCompletingTaskId(null);
    }
  };

  const handleCheckboxChange = async (task) => {
    if (task.progress === 100) return;
    await completeTask(task._id);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    handleSort(sortOption);
  }, [tasks, searchTerm]);

  const getSortLabel = (option) => {
    switch (option) {
      case 'priority-high': return 'Priority (High to Low)';
      case 'priority-low': return 'Priority (Low to High)';
      case 'date-newest': return 'Newest First';
      case 'date-oldest': return 'Oldest First';
      case 'deadline-asc': return 'Deadline (Soonest)';
      case 'deadline-desc': return 'Deadline (Latest)';
      case 'progress-high': return 'Progress (High)';
      case 'progress-low': return 'Progress (Low)';
      default: return 'Sort by';
    }
  };

  const renderProgressBar = (task) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className={`h-2.5 rounded-full ${getProgressColor(task.progress)}`}
        style={{ width: `${task.progress}%` }}
      ></div>
    </div>
  );

  const renderProgressEditor = (task) => (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="range"
        min="0"
        max="100"
        value={progressValue}
        onChange={handleProgressChange}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm font-medium w-10 text-center">{progressValue}%</span>
      <button
        onClick={() => updateProgress(task._id, progressValue)}
        className="p-1 text-green-600 hover:text-green-800"
        title="Save"
      >
        <FiCheck />
      </button>
      <button
        onClick={cancelEditing}
        className="p-1 text-red-600 hover:text-red-800"
        title="Cancel"
      >
        <FiX />
      </button>
    </div>
  );

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className={`rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl border ${task.progress === 100 ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-white'
            }`}
        >
          <div className={`h-2 bg-gradient-to-r ${getPriorityGradient(task.priority)}`}></div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800 truncate">{task.title}</h3>
              <div className="flex items-center gap-2">
                {task.progress === 100 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Completed
                  </span>
                )}
                {getPriorityBadge(task.priority)}
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${task.progress === 100 ? 'text-green-600' : 'text-blue-600'
                }`}>
                {task.progress}% Complete
              </span>
              {editingTask !== task._id && task.progress < 100 && (
                <button
                  onClick={() => startEditing(task)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FiEdit className="mr-1" /> Update
                </button>
              )}
            </div>

            {editingTask === task._id ? renderProgressEditor(task) : renderProgressBar(task)}

            <div className="space-y-3 mt-4">
              <div className="flex items-center text-gray-700">
                <FiCalendar className="mr-2 text-purple-600 flex-shrink-0" />
                <span className="font-medium">Uploaded:</span>
                <span className="ml-2">{new Date(task.currentDate).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <FiClock className="mr-2 text-purple-600 flex-shrink-0" />
                <span className="font-medium">Deadline:</span>
                <span className={`ml-2 ${new Date(task.deadline) < new Date() && task.progress < 100 ? 'text-red-600 font-bold' : ''
                  }`}>
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <FiUsers className="mr-2 text-purple-600 flex-shrink-0" />
                <span className="font-medium">Team:</span>
                <span className="ml-2 truncate">{task.team}</span>
              </div>

              <div className="flex items-start text-gray-700">
                <FiUser className="mr-2 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <span className="font-medium">Assigned to:</span>
                  <span className="ml-2 break-words">{task.users || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            {task.progress === 100 && task.completedAt && (
              <div className="mt-3 pt-3 border-t border-green-200 text-sm text-green-600">
                Completed on {new Date(task.completedAt).toLocaleDateString()}
                {task.completedBy && ` by ${task.completedBy}`}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uploaded
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <tr key={task._id} className={`hover:bg-gray-50 transition-colors ${task.progress === 100 ? 'bg-green-50' : ''
              }`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    {getPriorityIcon(task.priority)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getPriorityBadge(task.priority)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-32 mr-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${getProgressColor(task.progress)}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                  {task.progress === 100 ? 'Completed' : 'In Progress'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.currentDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm ${new Date(task.deadline) < new Date() && task.progress < 100 ? 'text-red-600 font-bold' : 'text-gray-500'
                  }`}>
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.team}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.progress === 100 ? (
                  <span className="text-green-600">Completed</span>
                ) : editingTask === task._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progressValue}
                      onChange={handleProgressChange}
                      className="border p-1 w-16 text-center rounded"
                    />
                    <button
                      onClick={() => updateProgress(task._id, progressValue)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(task)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs flex items-center"
                  >
                    <FiEdit className="mr-1" />
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Team Tasks
          </h2>
          <p className="text-gray-600 mt-1">Manage and track all team tasks in one place</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
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
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getSortLabel(sortOption)}
                <FiChevronDown className={`ml-2 transition-transform ${isSortOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-3 py-1 text-xs text-gray-500 uppercase font-medium">Date</div>
                    <button
                      onClick={() => handleSort('date-newest')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'date-newest' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => handleSort('date-oldest')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'date-oldest' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Oldest First
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-3 py-1 text-xs text-gray-500 uppercase font-medium">Deadline</div>
                    <button
                      onClick={() => handleSort('deadline-asc')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'deadline-asc' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Deadline (Soonest)
                    </button>
                    <button
                      onClick={() => handleSort('deadline-desc')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'deadline-desc' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Deadline (Latest)
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-3 py-1 text-xs text-gray-500 uppercase font-medium">Progress</div>
                    <button
                      onClick={() => handleSort('progress-high')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'progress-high' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Progress (High)
                    </button>
                    <button
                      onClick={() => handleSort('progress-low')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'progress-low' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Progress (Low)
                    </button>

                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-3 py-1 text-xs text-gray-500 uppercase font-medium">Priority</div>
                    <button
                      onClick={() => handleSort('priority-high')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'priority-high' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Priority (High to Low)
                    </button>
                    <button
                      onClick={() => handleSort('priority-low')}
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'priority-low' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Priority (Low to High)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-700'} hover:bg-gray-50 transition-colors`}
                title="Card View"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-700'} hover:bg-gray-50 transition-colors`}
                title="Table View"
              >
                <FiList />
              </button>
            </div>

            <button
              onClick={fetchTasks}
              disabled={isLoading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiRefreshCw className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
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
        viewMode === 'cards' ? renderCardsView() : renderTableView()
      ) : (
        !isLoading && !error && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
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