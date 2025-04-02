import React, { useState, useEffect } from 'react';
import {
  FiPlusCircle,
  FiCalendar,
  FiAlertTriangle,
  FiUser,
  FiUsers,
  FiFlag,
  FiClock,
  FiAward,
  FiX,
} from 'react-icons/fi';
import Select from 'react-select';

const TaskAssignment = () => {
  const defaultFormData = {
    title: '',
    description: '',
    currentDate: new Date().toISOString().split('T')[0],
    deadline: '',
    priority: 'medium',
    team: '',
    assignedEmployees: [],
    progress: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [apiEndpoints, setApiEndpoints] = useState([
    'http://localhost:5000/api/tasks',
  ]);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const response = await fetch('http://localhost:5000/api/fetch/team');
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        setTeams(data.map(team => ({ value: team, label: team })));
      } catch (error) {
        console.error('Error fetching teams:', error);
        try {
          const fallbackResponse = await fetch('http://localhost:5000/api/fetch/team');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTeams(fallbackData.map(team => ({ value: team, label: team })));
          }
        } catch (fallbackError) {
          console.error('Fallback endpoint also failed:', fallbackError);
        }
      } finally {
        setIsLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (formData.team) {
      const fetchEmployees = async () => {
        setIsLoadingEmployees(true);
        try {
          const response = await fetch(`http://localhost:5000/api/fetch/team/${formData.team}`);
          if (!response.ok) throw new Error('Failed to fetch employees');
          const data = await response.json();
          setEmployees(data.map(employee => ({
            value: employee._id,
            label: employee.name
          })));
        } catch (error) {
          console.error('Error fetching employees:', error);
          try {
            const fallbackResponse = await fetch(`http://localhost:5000/api/fetch/team/${formData.team}`);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              setEmployees(fallbackData.map(employee => ({
                value: employee._id,
                label: employee.name
              })));
            }
          } catch (fallbackError) {
            console.error('Fallback endpoint also failed:', fallbackError);
          }
        } finally {
          setIsLoadingEmployees(false);
        }
      };

      fetchEmployees();
    } else {
      setEmployees([]);
      setFormData(prev => ({ ...prev, assignedEmployees: [] }));
    }
  }, [formData.team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'team' && { assignedEmployees: [] }),
    });
  };

  const handleTeamSelect = (selectedOption) => {
    setFormData({
      ...formData,
      team: selectedOption ? selectedOption.value : '',
      assignedEmployees: [],
    });
  };

  const handleEmployeeSelect = (selectedOptions) => {
    setFormData({
      ...formData,
      assignedEmployees: selectedOptions || [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.deadline || !formData.team || formData.assignedEmployees.length === 0) {
      alert('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    const currentDate = new Date(formData.currentDate);
    const deadlineDate = new Date(formData.deadline);

    if (deadlineDate < currentDate) {
      alert('Deadline cannot be in the past.');
      setIsSubmitting(false);
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      team: formData.team,
      users: formData.assignedEmployees.map(emp => emp.value),
      progress: formData.progress
    };

    let lastError = null;

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status ${response.status}`);
        }

        const result = await response.json();
        alert('Task added successfully!');
        setFormData({ ...defaultFormData });
        setIsSubmitting(false);
        return;
      } catch (error) {
        console.error(`Submission failed for ${endpoint}:`, error);
        lastError = error;
      }
    }

    alert(lastError ? `Failed to submit task: ${lastError.message}` : 'Failed to submit task: All endpoints failed');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <FiPlusCircle className="text-2xl" />
            <h2 className="text-2xl font-bold">Create New Task</h2>
          </div>
          <p className="mt-1 opacity-90">Fill out the form below to assign a new task</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiAward className="mr-2 text-blue-500" />
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiAlertTriangle className="mr-2 text-blue-500" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Describe the task in detail"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiClock className="mr-2 text-blue-500" />
                Current Date
              </label>
              <input
                type="text"
                name="currentDate"
                value={formData.currentDate}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" />
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                min={formData.currentDate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiFlag className="mr-2 text-blue-500" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
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
                <FiUsers className="mr-2 text-blue-500" />
                Team/Group
              </label>
              <Select
                options={teams}
                value={teams.find(team => team.value === formData.team)}
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
                Assign To
              </label>
              <Select
                isMulti
                options={employees}
                value={formData.assignedEmployees}
                onChange={handleEmployeeSelect}
                placeholder="Select employees"
                isLoading={isLoadingEmployees}
                isDisabled={!formData.team || isLoadingEmployees}
              />

              {formData.assignedEmployees.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Assigned to: {formData.assignedEmployees.map(emp => emp.label).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || formData.assignedEmployees.length === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                isSubmitting || formData.assignedEmployees.length === 0
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating Task...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskAssignment;