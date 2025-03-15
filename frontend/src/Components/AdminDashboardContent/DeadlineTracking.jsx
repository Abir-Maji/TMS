import React, { useState, useEffect } from 'react';

const DeadlineTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
        alert('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleUpdate = async (taskId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update task');
      alert('Task updated successfully');
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Deadline Tracking and Notifications</h2>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {/* <th className="p-2 border">ID</th> */}
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Uploaded Date</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Group</th>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border">
                {/* <td className="p-2 border">{task._id}</td> */}
                <td className="p-2 border text-center">{task.title}</td>
                <td className="p-2 border text-center">{task.description}</td>
                <td className="p-2 border text-center">{task.currentDate}</td>
                <td className="p-2 border text-center">{task.deadline}</td>
                <td className="p-2 border text-center">{task.priority}</td>
                <td className="p-2 border text-center">{task.team}</td>
                <td className="p-2 border text-center">{task.user}</td>
                <td className="p-2 border text-center">
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
      )}

      {editingTask && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Task</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  title: e.target.elements.title.value,
                  description: e.target.elements.description.value,
                  deadline: e.target.elements.deadline.value,
                  priority: e.target.elements.priority.value,
                  team: e.target.elements.team.value,
                  user: e.target.elements.user.value,
                };
                handleUpdate(editingTask._id, updatedData);
              }}
            >
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input type="text" name="title" defaultValue={editingTask.title} className="border rounded px-3 py-2 mb-2 w-full" required />
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea name="description" defaultValue={editingTask.description} className="border rounded px-3 py-2 mb-2 w-full" required />
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Deadline Date
              </label>
              <input type="date" name="deadline" defaultValue={editingTask.deadline} className="border rounded px-3 py-2 mb-2 w-full" required />
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select name="priority" defaultValue={editingTask.priority} className="border rounded px-3 py-2 mb-2 w-full" required>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Group
              </label>
              <input type="text" name="team" defaultValue={editingTask.team} className="border rounded px-3 py-2 mb-2 w-full" required />
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                Employee Name
              </label>
              <input type="text" name="user" defaultValue={editingTask.user} className="border rounded px-3 py-2 mb-2 w-full" required />
              <div className="flex justify-end">
                <button type="button" onClick={() => setEditingTask(null)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineTracking;
