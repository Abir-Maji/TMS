import React, { useState, useEffect } from 'react';

const DeadlineTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Task deleted successfully');
        fetchTasks(); // Refresh the task list
      } else {
        alert('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update a task
  const handleUpdate = async (taskId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5001/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Task updated successfully');
        fetchTasks(); // Refresh the task list
        setEditingTask(null); // Exit edit mode
      } else {
        alert('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Deadline Tracking and Notifications</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Deadline</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border">
              <td className="p-2 border">{task.title}</td>
              <td className="p-2 border">{task.description}</td>
              <td className="p-2 border">{task.deadline}</td>
              <td className="p-2 border">{task.priority}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingTask(task)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Task</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingTask._id, {
                  title: e.target.elements.title.value,
                  description: e.target.elements.description.value,
                  deadline: e.target.elements.deadline.value,
                  priority: e.target.elements.priority.value,
                });
              }}
            >
              <input
                type="text"
                name="title"
                defaultValue={editingTask.title}
                className="border rounded px-3 py-2 mb-2 w-full"
                required
              />
              <textarea
                name="description"
                defaultValue={editingTask.description}
                className="border rounded px-3 py-2 mb-2 w-full"
                required
              />
              <input
                type="date"
                name="deadline"
                defaultValue={editingTask.deadline}
                className="border rounded px-3 py-2 mb-2 w-full"
                required
              />
              <select
                name="priority"
                defaultValue={editingTask.priority}
                className="border rounded px-3 py-2 mb-2 w-full"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineTracking;