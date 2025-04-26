import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiEdit2, 
  FiTrash2, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiUser,
  FiX,
  FiSave,
  FiLoader,
  FiAward,
  FiFlag
} from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeadlineTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    taskId: null,
    taskTitle: ''
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      const tasksArray = Array.isArray(data) ? data : 
                        Array.isArray(data?.tasks) ? data.tasks : [];
      // Sort tasks by deadline (newest first)
      const sortedTasks = [...tasksArray].sort((b, a) => {
        return new Date(b.deadline) - new Date(a.deadline);
      });
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    setIsLoadingTeams(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch/team`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data.map(team => ({ value: team, label: team })));
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const fetchEmployees = async (team) => {
    if (!team) {
      setEmployees([]);
      return;
    }
    
    setIsLoadingEmployees(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/fetch/team/${team}`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data.map(employee => ({
        value: employee._id,
        label: employee.name
      })));
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const showDeleteConfirmation = (taskId, taskTitle) => {
    setDeleteConfirmation({
      show: true,
      taskId,
      taskTitle
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      show: false,
      taskId: null,
      taskTitle: ''
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.taskId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${deleteConfirmation.taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      hideDeleteConfirmation();
    }
  };

  const handleUpdate = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedData,
          users: updatedData.assignedEmployees.map(emp => emp.label).join(', ')
        }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      toast.success('Task updated successfully');
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks?.filter(task => {
    const taskTitle = task?.title || '';
    const taskUsers = task?.users || '';
    const matchesSearch = taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         taskUsers.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task?.priority === filterPriority;
    return matchesSearch && matchesPriority;
  }) || [];

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (editingTask?.team) {
      fetchEmployees(editingTask.team);
    }
  }, [editingTask?.team]);

  const handleTeamSelect = (selectedOption) => {
    const team = selectedOption ? selectedOption.value : '';
    setEditingTask(prev => ({
      ...prev,
      team,
      assignedEmployees: []
    }));
    fetchEmployees(team);
  };

  const handleEmployeeSelect = (selectedOptions) => {
    setEditingTask(prev => ({
      ...prev,
      assignedEmployees: selectedOptions || []
    }));
  };

  return (
    <div className="">
      <div className="max-auto mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-2xl" />
            <h2 className="text-2xl font-bold">Deadline Tracking</h2>
          </div>
          <p className="mt-1 opacity-90">View and manage all tasks with their deadlines</p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Tasks</label>
              <input
                type="text"
                placeholder="Search by title or assigned users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Priority</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchTasks}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition"
              >
                Refresh Tasks
              </button>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <FiLoader className="animate-spin text-3xl text-blue-500" />
            </div>
          ) : (
            <div className="min-w-full">
              {/* Mobile View */}
              <div className="md:hidden">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task._id} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900 mb-2">{task?.title || 'Untitled Task'}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingTask({
                                ...task,
                                assignedEmployees: task.users 
                                  ? task.users.split(', ').map(user => ({ value: user, label: user }))
                                  : []
                              });
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 className="inline" />
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(task._id, task.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2 whitespace-pre-wrap">
                        {task?.description || 'No description'}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Deadline</div>
                          <div className="flex items-center">
                            <FiClock className="mr-1 text-blue-500" />
                            <span>{task?.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {task?.deadline ? 
                              `${Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining` :
                              'No deadline set'}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">Priority</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task?.priority)}`}>
                            {task?.priority || 'Not specified'}
                          </span>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">Team</div>
                          <div className="flex items-center">
                            <FiUsers className="mr-1 text-purple-500" />
                            {task?.team || 'No team'}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700">Assigned To</div>
                          <div className="flex items-center">
                            <FiUser className="mr-1 text-green-500" />
                            <span className="whitespace-pre-wrap">{task?.users || 'Unassigned'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="font-medium text-gray-700">Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${task?.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{task?.progress || 0}% complete</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No tasks found matching your criteria
                  </div>
                )}
              </div>
              
              {/* Desktop View */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{task?.title || 'Untitled Task'}</div>
                          <div className="text-sm text-gray-500 whitespace-pre-wrap max-w-xs">{task?.description || 'No description'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-blue-500" />
                            <span>{task?.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {task?.deadline ? 
                              `${Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining` :
                              'No deadline set'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task?.priority)}`}>
                            {task?.priority || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiUsers className="mr-2 text-purple-500" />
                            {task?.team || 'No team'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-green-500" />
                            <span className="whitespace-pre-wrap">{task?.users || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${task?.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{task?.progress || 0}% complete</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingTask({
                                ...task,
                                assignedEmployees: task.users 
                                  ? task.users.split(', ').map(user => ({ value: user, label: user }))
                                  : []
                              });
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FiEdit2 className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => showDeleteConfirmation(task._id, task.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No tasks found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FiEdit2 className="mr-2 text-blue-500" />
                Edit Task
              </h3>
              <button 
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  title: e.target.elements.title.value,
                  description: e.target.elements.description.value,
                  deadline: e.target.elements.deadline.value,
                  priority: e.target.elements.priority.value,
                  team: editingTask.team,
                  assignedEmployees: editingTask.assignedEmployees,
                  progress: parseInt(e.target.elements.progress.value)
                };
                handleUpdate(editingTask._id, updatedData);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiAward className="mr-2 text-blue-500" />
                    Task Title *
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    defaultValue={editingTask?.title || ''} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required 
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiAlertTriangle className="mr-2 text-blue-500" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingTask?.description || ''}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiFlag className="mr-2 text-blue-500" />
                    Priority *
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || 'medium'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiCalendar className="mr-2 text-blue-500" />
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    defaultValue={editingTask?.deadline ? new Date(editingTask.deadline).toISOString().split('T')[0] : ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUsers className="mr-2 text-blue-500" />
                    Team/Group *
                  </label>
                  <Select
                    options={teams}
                    value={teams.find(team => team.value === editingTask.team)}
                    onChange={handleTeamSelect}
                    placeholder="Select a team"
                    isLoading={isLoadingTeams}
                    isClearable
                    isSearchable
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiUser className="mr-2 text-blue-500" />
                    Assign To *
                  </label>
                  <Select
                    isMulti
                    options={employees}
                    value={editingTask.assignedEmployees}
                    onChange={handleEmployeeSelect}
                    placeholder="Select employees"
                    isLoading={isLoadingEmployees}
                    isDisabled={!editingTask.team || isLoadingEmployees}
                    closeMenuOnSelect={false}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    defaultValue={editingTask?.progress || 0}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {editingTask?.progress || 0}% Complete
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition flex items-center"
                >
                  <FiSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FiAlertTriangle className="mr-2 text-red-500" />
                Confirm Deletion
              </h3>
              <button 
                onClick={hideDeleteConfirmation}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the task <span className="font-semibold">"{deleteConfirmation.taskTitle}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={hideDeleteConfirmation}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition flex items-center"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineTracking;