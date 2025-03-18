import React, { useState, useEffect } from 'react';

const ProgressReporting = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tasks for the specified team
    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const team = localStorage.getItem('team'); 

            if (!team) {
                throw new Error('No team found in localStorage. Please log in again.');
            }

            console.log('Fetching tasks for team:', team);

            const response = await fetch(`http://localhost:5000/api/employee/tasks/by-team?team=${team.trim()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();
            console.log('Fetched tasks:', data.tasks);

            if (!data.tasks || data.tasks.length === 0) {
                setError('No tasks found for your team.');
            } else {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError(error.message || 'Failed to fetch tasks. Please check your connection or try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to update task progress
    const updateProgress = async (taskId, newProgress) => {
        try {
            const response = await fetch(`http://localhost:5000/api/employee/tasks/update-progress/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ progress: newProgress }),
            });

            if (!response.ok) {
                throw new Error('Failed to update progress');
            }

            // Update progress in the UI
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, progress: newProgress } : task
                )
            );
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('Failed to update progress');
        }
    };

    // Fetch tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Task List</h2>

            {isLoading && <p>Loading tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!isLoading && tasks.length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Progress%</th>
                            <th className="p-2 border">Update Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id} className="border">
                                <td className="p-2 border text-center">{task.title}</td>
                                <td className="p-2 border text-center">{task.description}</td>
                                <td className="p-2 border text-center">{task.progress}%</td>
                                <td className="p-2 border text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        defaultValue={task.progress}
                                        onChange={(e) => updateProgress(task._id, e.target.value)}
                                        className="border p-1 w-16 text-center"
                                    />
                                     <span className="ml-1">%</span>
                                    {/* <button
                                        onClick={() => updateProgress(task._id, document.querySelector(`input[type="number"][value="${task.progress}"]`).value)}
                                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Update
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !isLoading && !error && <p>No tasks found for your team.</p>
            )}
        </div>
    );
};

export default ProgressReporting;
