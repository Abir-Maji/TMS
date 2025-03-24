import React, { useState, useEffect } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks for the specified team
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const team = localStorage.getItem('team'); // Get the team from localStorage

      if (!team) {
        throw new Error('No team found in localStorage. Please log in again.');
      }

      // console.log('Fetching tasks for team:', team); // Log the team being fetched

      // Fetch tasks from the backend
      const response = await fetch(`http://localhost:5000/api/employee/tasks/by-team?team=${team.trim()}`);
      console.log("res",response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Fetched tasks:', data.tasks); // Log the fetched tasks

      if (!data.tasks || data.tasks.length === 0) {
        setError('No tasks found for your team.');
      } else {
        setTasks(data.tasks); // Set the fetched tasks
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Failed to fetch tasks. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Task List</h2>

      {/* Loading State */}
      {isLoading && <p>Loading tasks...</p>}

      {/* Error State */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tasks Table */}
      {!isLoading && tasks.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Uploaded Date</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Team</th>
              <th className="p-2 border">Employee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border">
                <td className="p-2 border text-center">{task.title}</td>
                <td className="p-2 border text-center">{task.description}</td>
                <td className="p-2 border text-center">
                  {new Date(task.currentDate).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="p-2 border text-center">{task.priority}</td>
                <td className="p-2 border text-center">{task.team}</td>
                <td className="p-2 border text-center">{task.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // No Tasks Found
        !isLoading && !error && <p>No tasks found for your team.</p>
      )}
    </div>
  );
};

export default TaskList;