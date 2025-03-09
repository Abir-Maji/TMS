import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Retrieve the username
    const [tasks, setTasks] = useState([]); // State to store tasks
    const [newTask, setNewTask] = useState(''); // State for new task input

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        localStorage.removeItem('username'); // Clear the username
        navigate('/EmployeeLogin'); // Redirect to the login page
    };

    // Add a new task
    const handleAddTask = () => {
        if (newTask.trim() === '') return; // Prevent empty tasks
        const task = {
            id: Date.now(), // Unique ID for the task
            text: newTask,
            completed: false,
        };
        setTasks([...tasks, task]); // Add the new task to the list
        setNewTask(''); // Clear the input field
    };

    // Delete a task
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id)); // Remove the task by ID
    };

    // Toggle task completion status
    const handleToggleComplete = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Add Task Form */}
                <div className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task"
                            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddTask}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Tasks</h2>
                    {tasks.length === 0 ? (
                        <p className="text-gray-600">No tasks found. Add a new task above!</p>
                    ) : (
                        <ul className="space-y-4">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleComplete(task.id)}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        <span
                                            className={`text-lg ${
                                                task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                                            }`}
                                        >
                                            {task.text}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;