import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiRefreshCw, FiEdit, FiSearch } from 'react-icons/fi';

const ProgressReporting = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [progressValue, setProgressValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const team = localStorage.getItem('team');
            if (!team) throw new Error('No team found. Please log in again.');

            const response = await fetch(`http://localhost:5000/api/employee/tasks/by-team?team=${team.trim()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();
            if (!data.tasks || data.tasks.length === 0) {
                setError('No tasks found for your team.');
                setTasks([]);
                setFilteredTasks([]);
            } else {
                // Ensure completed status is properly set for tasks with 100% progress
                const processedTasks = data.tasks.map(task => ({
                    ...task,
                    status: task.progress === 100 ? 'completed' : (task.status || 'in-progress')
                }));
                setTasks(processedTasks);
                setFilteredTasks(processedTasks);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError(error.message || 'Failed to fetch tasks. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProgress = async (taskId, newProgress) => {
        try {
            const updateData = { progress: newProgress };
            
            if (newProgress === 100) {
                updateData.status = 'completed';
                updateData.completedAt = new Date().toISOString();
            } else {
                updateData.status = 'in-progress';
            }

            const response = await fetch(`http://localhost:5000/api/employee/tasks/update-progress/${taskId}`, {
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

            // Ensure status is set correctly in the updated task
            const finalTask = {
                ...updatedTask.task,
                status: newProgress === 100 ? 'completed' : 'in-progress'
            };

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? finalTask : task
                )
            );
            
            setFilteredTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? finalTask : task
                )
            );
            
            setEditingTask(null);

            if (newProgress === 100) {
                alert('Task marked as completed successfully!');
            }
            return finalTask;
        } catch (error) {
            console.error('Error updating progress:', error);
            alert(`Failed to update progress: ${error.message}`);
            throw error;
        }
    };

    const handleCheckboxChange = async (task) => {
        if (task.progress === 100) return;
        
        try {
            setIsLoading(true);
            // Optimistically update the UI
            const optimisticTasks = tasks.map(t => 
                t._id === task._id ? { ...t, status: 'completed', progress: 100 } : t
            );
            setTasks(optimisticTasks);
            setFilteredTasks(optimisticTasks);
            
            // Then make the API call
            await updateProgress(task._id, 100);
        } catch (error) {
            // Revert on error
            fetchTasks();
        } finally {
            setIsLoading(false);
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

    const getProgressColor = (progress) => {
        if (progress === 100) return 'bg-green-500';
        if (progress >= 90) return 'bg-green-400';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getPriorityIcon = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return <FiAlertTriangle className="text-red-500 mr-1" />;
            case 'medium':
                return <FiInfo className="text-yellow-500 mr-1" />;
            default:
                return <FiCheckCircle className="text-green-500 mr-1" />;
        }
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
                task.user.toLowerCase().includes(term)
            );
            setFilteredTasks(filtered);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Task Progress Dashboard
                    </h2>
                    <button
                        onClick={fetchTasks}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks by title, description, or priority..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && (
                        <span className="absolute right-3 top-2 text-sm text-gray-500">
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'result' : 'results'}
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                        <p>{error}</p>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                            <div key={task._id} className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg relative ${
                                task.progress === 100 ? 'border-l-4 border-green-500 bg-green-50' : ''
                            }`}>
                                <div className="absolute top-4 left-4">
                                    <input
                                        type="checkbox"
                                        checked={task.progress === 100}
                                        onChange={() => handleCheckboxChange(task)}
                                        className="h-5 w-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                        disabled={isLoading || task.progress === 100}
                                    />
                                </div>
                                
                                {task.progress === 100 && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-bl-lg">
                                        COMPLETED
                                    </div>
                                )}
                                <div className="p-5 pl-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                {getPriorityIcon(task.priority)}
                                                {task.title}
                                                {task.progress === 100 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                        Completed
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                task.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {task.progress}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${
                                                    task.progress === 100 ? 'bg-green-500' : getProgressColor(task.progress)
                                                }`}
                                                style={{ width: `${task.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            <span>Assigned to: {task.user} • Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                            {task.progress === 100 && task.completedAt && (
                                                <span className="block text-green-600 mt-1">
                                                    Completed on: {new Date(task.completedAt).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {task.progress === 100 ? (
                                            <span className="text-green-600 font-medium flex items-center">
                                                <FiCheckCircle className="mr-1" /> Completed
                                            </span>
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
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    <FiEdit className="mr-1" />
                                                    Update Progress
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        {searchTerm ? (
                            <>
                                <FiSearch className="mx-auto text-4xl text-gray-400 mb-3" />
                                <h3 className="text-lg font-medium text-gray-700">No matching tasks found</h3>
                                <p className="text-gray-500 mt-1">Try a different search term</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilteredTasks(tasks);
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <FiCheckCircle className="mx-auto text-4xl text-gray-400 mb-3" />
                                <h3 className="text-lg font-medium text-gray-700">No tasks assigned</h3>
                                <p className="text-gray-500 mt-1">There are currently no tasks assigned to your team</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressReporting;