import React, { useState, useEffect } from 'react';

const TaskList = ({ team }) => { // Destructure the team prop
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks for the logged-in employee's team
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      if (!team) {
        throw new Error('Team is missing'); // Throw an error if team is missing
      }
  
      // Use template literals to interpolate the team variable
      const response = await fetch(`http://localhost:5000/api/tasks/team/${team}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks); // Set tasks fetched for the team
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [team]); // Fetch tasks whenever team changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
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
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border">
                <td className="p-2 border text-center">{task.title}</td>
                <td className="p-2 border text-center">{task.description}</td>
                <td className="p-2 border text-center">{new Date(task.currentDate).toLocaleDateString()}</td>
                <td className="p-2 border text-center">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="p-2 border text-center">{task.priority}</td>
                <td className="p-2 border text-center">{task.team}</td>
                <td className="p-2 border text-center">{task.user}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => updateTask(task._id, { ...task, priority: 'high' })}
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
    </div>
  );
};

export default TaskList;