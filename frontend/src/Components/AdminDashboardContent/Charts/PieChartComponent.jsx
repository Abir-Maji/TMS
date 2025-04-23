import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FiCheckCircle, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      
      // Ensure tasks is always an array
      const tasksArray = Array.isArray(data) ? data : 
                        Array.isArray(data?.tasks) ? data.tasks : [];
      
      setTasks(tasksArray);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      setTasks([]); // Ensure tasks is set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  // Safe calculation of task statistics
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => 
    task?.status === 'completed' || task?.progress === 100
  )?.length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Safe filtering for task lists
  const completedTasksList = tasks?.filter(task => 
    task?.status === 'completed' || task?.progress === 100
  )?.slice(0, 3) || [];

  const pendingTasksList = tasks?.filter(task => 
    task?.status !== 'completed' && task?.progress < 100
  )?.slice(0, 3) || [];

  // Process data for pie chart with null checks
  const getPriorityData = () => {
    const counts = tasks?.reduce((acc, task) => {
      const priority = task?.priority?.toLowerCase() || 'unassigned';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      labels: Object.keys(counts).map(priority => `${priority} Priority`),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',  // Low
          'rgba(255, 206, 86, 0.7)',   // Medium
          'rgba(255, 99, 132, 0.7)',    // High
          'rgba(153, 102, 255, 0.7)'   // Unassigned
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  // Process data for team distribution bar chart with null checks
  const getTeamDistributionData = () => {
    const teamCounts = tasks?.reduce((acc, task) => {
      const teamName = task?.team || 'Unassigned';
      acc[teamName] = (acc[teamName] || 0) + 1;
      return acc;
    }, {}) || {};

    const teamNames = Object.keys(teamCounts);
    const taskCounts = Object.values(teamCounts);

    // Generate distinct colors for each team
    const backgroundColors = teamNames.map((_, index) => {
      const hue = (index * 137.508) % 360; // Golden angle approximation
      return `hsla(${hue}, 70%, 60%, 0.7)`;
    });

    return {
      labels: teamNames,
      datasets: [{
        label: 'Tasks Assigned',
        data: taskCounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  };

  if (loading && tasks.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading tasks...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchTasks}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-600">
              {totalTasks} total tasks • {completedTasks} completed ({completionPercentage}%)
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Task Priority Distribution</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Real-time
              </span>
            </div>
            <div className="h-80 relative">
              <Pie 
                data={getPriorityData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'right',
                      labels: {
                        padding: 20,
                        font: {
                          size: 14
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      titleFont: { size: 14 },
                      bodyFont: { size: 14 },
                      padding: 12,
                      callbacks: {
                        label: ctx => {
                          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((ctx.raw / total) * 100);
                          return `${ctx.label}: ${ctx.raw} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '60%',
                  animation: {
                    animateScale: true,
                    animateRotate: true
                  }
                }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Hover over segments for details
            </div>
          </div>

          {/* Task Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Tasks Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">Completion</span>
                    <span className="text-sm font-medium text-gray-600">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalTasks}</p>
                    <p className="text-xs text-blue-500">Total Tasks</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-xs text-green-500">Completed</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
                    <p className="text-xs text-yellow-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Priority Summary</h3>
              <div className="space-y-3">
                {['High', 'Medium', 'Low'].map(priority => {
                  const count = tasks.filter(t => t.priority === priority.toLowerCase()).length;
                  const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                  
                  return (
                    <div key={priority}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-600">{priority} Priority</span>
                        <span className="text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            priority === 'High' ? 'bg-red-500' : 
                            priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Completed Tasks */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <FiCheckCircle className="text-green-500 mr-2" />
                    Completed Tasks
                  </h3>
                  <div className="space-y-4">
                    {completedTasksList.length > 0 ? (
                      completedTasksList.map(task => (
                        <div key={task._id} className="flex items-start p-3 bg-green-50 rounded-lg">
                          <div className="h-3 w-3 rounded-full mt-1.5 bg-green-500"></div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                {task.progress}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                            {/* <p className="text-xs text-gray-500 mt-1">
                              Completed on: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A'}
                            </p> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <FiCheckCircle className="mx-auto text-2xl mb-2 text-gray-400" />
                        No completed tasks
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Tasks */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                    <FiClock className="text-yellow-500 mr-2" />
                    Pending Tasks
                  </h3>
                  <div className="space-y-4">
                    {pendingTasksList.length > 0 ? (
                      pendingTasksList.map(task => (
                        <div key={task._id} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                          <div className={`h-3 w-3 rounded-full mt-1.5 ${
                            task.priority === 'high' ? 'bg-red-500' : 
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-gray-800">{task.title}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.progress}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{task.description || 'No description'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <FiAlertCircle className="mx-auto text-2xl mb-2 text-gray-400" />
                        No pending tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Distribution Bar Chart */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiUsers className="mr-2 text-blue-500" />
              Tasks Distribution by Team
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Real-time
            </span>
          </div>
          <div className="h-80 relative">
            <Bar 
              data={getTeamDistributionData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Hover over bars to see task counts per team
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;