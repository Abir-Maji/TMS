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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Determine device type based on window width
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

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
  )?.slice(0, isMobile ? 2 : 3) || [];

  const pendingTasksList = tasks?.filter(task => 
    task?.status !== 'completed' && task?.progress < 100
  )?.slice(0, isMobile ? 2 : 3) || [];

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

  // Chart options with responsive settings
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: isMobile ? 'bottom' : 'right',
        labels: {
          padding: isMobile ? 10 : 15,
          font: {
            size: isMobile ? 10 : (isTablet ? 12 : 14)
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: isMobile ? 10 : 12 },
        bodyFont: { size: isMobile ? 10 : 12 },
        padding: isMobile ? 8 : 12,
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((ctx.raw / total) * 100);
            return `${ctx.label}: ${ctx.raw} (${percentage}%)`;
          }
        }
      }
    },
    cutout: isMobile ? '50%' : '60%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const barChartOptions = {
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
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 10 : (isTablet ? 12 : 14)
          }
        }
      }
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg font-medium text-gray-700">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg max-w-md w-full text-center">
          <div className="text-red-500 text-3xl sm:text-4xl mb-2 sm:mb-3">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-1 sm:mb-2">Error Loading Data</h2>
          <p className="text-sm sm:text-base text-red-600">{error}</p>
          <button 
            onClick={fetchTasks}
            className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Task Dashboard</h1>
          <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center justify-between'} mt-1 sm:mt-2`}>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              {totalTasks} total tasks • {completedTasks} completed ({completionPercentage}%)
            </p>
            {lastUpdated && (
              <p className="text-xs sm:text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className={`grid ${isDesktop ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4 sm:gap-5 md:gap-6`}>
          {/* Priority Pie Chart */}
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center justify-between'} mb-3 sm:mb-4 md:mb-6`}>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">Task Priority Distribution</h2>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full self-start sm:self-auto">
                Real-time
              </span>
            </div>
            <div className={`${isMobile ? 'h-48' : (isTablet ? 'h-64' : 'h-72')} relative`}>
              <Pie data={getPriorityData()} options={pieChartOptions} />
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
              {isMobile ? 'Tap segments for details' : 'Hover over segments for details'}
            </div>
          </div>

          {/* Task Summary Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : (isTablet ? 'grid-cols-2' : 'grid-cols-2')} gap-3 sm:gap-4 md:gap-6`}>
            {/* Tasks Overview Card */}
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3">Tasks Overview</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Completion</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-green-500 h-1.5 sm:h-2 rounded-full" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className={`grid grid-cols-3 gap-2 ${isMobile ? '' : 'sm:gap-3 md:gap-4'}`}>
                  <div className="bg-blue-50 p-1 sm:p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{totalTasks}</p>
                    <p className="text-2xs sm:text-xs text-blue-500">Total</p>
                  </div>
                  <div className="bg-green-50 p-1 sm:p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-2xs sm:text-xs text-green-500">Completed</p>
                  </div>
                  <div className="bg-yellow-50 p-1 sm:p-2 md:p-3 rounded-lg text-center">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">{pendingTasks}</p>
                    <p className="text-2xs sm:text-xs text-yellow-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Summary Card */}
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3">Priority Summary</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {['High', 'Medium', 'Low'].map(priority => {
                  const count = tasks.filter(t => t.priority === priority.toLowerCase()).length;
                  const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                  
                  return (
                    <div key={priority}>
                      <div className="flex justify-between text-xs sm:text-sm mb-0.5 sm:mb-1">
                        <span className="font-medium text-gray-600">{priority}</span>
                        <span className="text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
                        <div 
                          className={`h-1 sm:h-1.5 rounded-full ${
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

            {/* Tasks Lists Card */}
            <div className={`bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 ${isMobile ? '' : 'col-span-2'}`}>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-3 sm:gap-4 md:gap-6`}>
                {/* Completed Tasks */}
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                    <FiCheckCircle className="text-green-500 mr-1 sm:mr-2" size={isMobile ? 16 : 20} />
                    <span>Completed Tasks</span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {completedTasksList.length > 0 ? (
                      completedTasksList.map(task => (
                        <div key={task._id} className="flex items-start p-2 sm:p-3 bg-green-50 rounded-lg">
                          <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full mt-1 sm:mt-1.5 bg-green-500`}></div>
                          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 truncate">
                                {task.title}
                              </h4>
                              <span className="text-2xs sm:text-xs px-1 sm:px-2 py-0.5 rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                                {task.progress}%
                              </span>
                            </div>
                            <p className="text-2xs sm:text-xs text-gray-600 mt-0.5 line-clamp-2">
                              {task.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 sm:py-3 text-gray-500">
                        <FiCheckCircle className="mx-auto text-lg sm:text-xl md:text-2xl mb-1 text-gray-400" />
                        <p className="text-xs sm:text-sm">No completed tasks</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending Tasks */}
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                    <FiClock className="text-yellow-500 mr-1 sm:mr-2" size={isMobile ? 16 : 20} />
                    <span>Pending Tasks</span>
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {pendingTasksList.length > 0 ? (
                      pendingTasksList.map(task => (
                        <div key={task._id} className="flex items-start p-2 sm:p-3 bg-yellow-50 rounded-lg">
                          <div className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full mt-1 sm:mt-1.5 ${
                            task.priority === 'high' ? 'bg-red-500' : 
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 truncate">
                                {task.title}
                              </h4>
                              <span className="text-2xs sm:text-xs px-1 sm:px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                                {task.progress}%
                              </span>
                            </div>
                            <p className="text-2xs sm:text-xs text-gray-600 mt-0.5 line-clamp-2">
                              {task.description || 'No description'}
                            </p>
                            {task.deadline && (
                              <p className="text-2xs sm:text-xs text-gray-500 mt-0.5">
                                Deadline: {new Date(task.deadline).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 sm:py-3 text-gray-500">
                        <FiAlertCircle className="mx-auto text-lg sm:text-xl md:text-2xl mb-1 text-gray-400" />
                        <p className="text-xs sm:text-sm">No pending tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Distribution Bar Chart */}
        <div className="mt-4 sm:mt-5 md:mt-6 bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center justify-between'} mb-3 sm:mb-4 md:mb-6`}>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <FiUsers className="mr-1 sm:mr-2 text-blue-500" size={isMobile ? 16 : 20} />
              <span>Tasks by Team</span>
            </h2>
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full self-start sm:self-auto">
              Real-time
            </span>
          </div>
          <div className={`${isMobile ? 'h-48' : (isTablet ? 'h-64' : 'h-72')} relative`}>
            <Bar data={getTeamDistributionData()} options={barChartOptions} />
          </div>
          <div className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
            {isMobile ? 'Tap bars for details' : 'Hover over bars for details'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;