import React, { useState } from 'react';
import { 
  FiPlusCircle, 
  FiCalendar, 
  FiAlertTriangle, 
  FiUser, 
  FiUsers,
  FiFlag,
  FiClock,
  FiAward
} from 'react-icons/fi';

const TaskAssignment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    currentDate: new Date().toISOString().split('T')[0],
    deadline: '',
    priority: 'medium',
    team: '',
    user: '',
    progress: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'team' ? value.toUpperCase() : value;
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentDate = new Date(formData.currentDate);
    const deadlineDate = new Date(formData.deadline);

    if (deadlineDate < currentDate) {
      alert('Deadline cannot be in the past.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit task');

      const result = await response.json();
      console.log('Task submitted successfully:', result);
      alert('Task added successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        currentDate: new Date().toISOString().split('T')[0],
        deadline: '',
        priority: 'medium',
        team: '',
        user: '',
        progress: 0,
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('An error occurred while submitting the task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="max-auto mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <FiPlusCircle className="text-2xl" />
            <h2 className="text-2xl font-bold">Create New Task</h2>
          </div>
          <p className="mt-1 opacity-90">Fill out the form below to assign a new task to your team</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
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

            {/* Description */}
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

            {/* Dates */}
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
              />
            </div>

            {/* Priority */}
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

            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUsers className="mr-2 text-blue-500" />
                Team/Group
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., MARKETING"
                required
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                Assign To
              </label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Employee name"
                required
              />
            </div>
          </div>

          {/* Hidden Progress */}
          <input type="hidden" name="progress" value={formData.progress} />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
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