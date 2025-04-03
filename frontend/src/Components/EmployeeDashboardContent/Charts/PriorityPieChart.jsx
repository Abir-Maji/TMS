import React, { useState, useEffect, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock,
  FiRefreshCw
} from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [taskStatus, setTaskStatus] = useState({
    pending: 0,
    completed: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const determineTaskStatus = (task) => {
    // First check progress - 100% means completed regardless of status field
    if (task.progress === 100) return 'completed';
    
    // Then check status field
    const status = task.status?.toLowerCase().trim();
    if (status === 'completed') return 'completed';
    if (status === 'in progress' || status === 'in-progress') return 'inProgress';
    
    // Finally, if progress > 0 but < 100, consider it in progress
    if (task.progress > 0 && task.progress < 100) return 'inProgress';
    
    // Otherwise it's pending
    return 'pending';
  };

  const fetchTasksData = useCallback(async () => {
    try {
      const team = localStorage.getItem('team');
      if (!team) throw new Error('No team found in localStorage');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:5000/api/employee/tasks/by-team?team=${team.trim()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.tasks) throw new Error('No tasks data received');

      // Process status counts - matching ProgressReporting component logic exactly
      const statusCounts = data.tasks.reduce((acc, task) => {
        const status = determineTaskStatus(task);
        acc[status]++;
        return acc;
      }, { pending: 0, completed: 0, inProgress: 0 });

      // Process priority data
      const priorityCounts = data.tasks.reduce((acc, task) => {
        const priority = task.priority?.toLowerCase() || 'unknown';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      setChartData({
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [{
          data: [
            priorityCounts['high'] || 0,
            priorityCounts['medium'] || 0,
            priorityCounts['low'] || 0
          ],
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1
        }]
      });

      setTaskStatus(statusCounts);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching task data:', err);
      setError(err);
      setChartData(null);
      setTaskStatus({ pending: 0, completed: 0, inProgress: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksData();
    const intervalId = setInterval(fetchTasksData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchTasksData]);

  // ... (rest of the component remains the same, including the return statement)
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header with last updated time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Task Overview - Team: <span className="text-blue-600">{localStorage.getItem('team') || 'Unknown'}</span>
        </h2>
        <div className="flex items-center mt-2 md:mt-0">
          {lastUpdated && (
            <span className="text-sm text-gray-500 mr-3">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button 
            onClick={fetchTasksData}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Refresh now"
            disabled={loading}
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Task Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Pending Tasks Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg mr-3">
              <FiClock className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-bold">{taskStatus.pending}</p>
            </div>
          </div>
        </div>
        
        {/* In Progress Tasks Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
              <FiRefreshCw className="text-lg animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-xl font-bold">{taskStatus.inProgress}</p>
            </div>
          </div>
        </div>
        
        {/* Completed Tasks Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
              <FiCheckCircle className="text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-xl font-bold">{taskStatus.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-64">
          {chartData && (
            <Pie 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle',
                      font: { size: 12 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                },
                cutout: '60%',
                animation: { duration: 500 }
              }}
            />
          )}
        </div>
        
        {/* Priority Breakdown */}
        <div className="space-y-4">
          {chartData?.labels.map((label, index) => {
            const priority = label.split(' ')[0].toLowerCase();
            const count = chartData.datasets[0].data[index];
            const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            return (
              <div key={label} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-xs hover:shadow-sm transition-shadow">
                <div className={`p-2 rounded-lg ${
                  priority === 'high' ? 'bg-red-100 text-red-600' :
                  priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {priority === 'high' ? <FiAlertTriangle /> :
                   priority === 'medium' ? <FiAlertCircle /> : <FiCheckCircle />}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-800">{label}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{count} tasks</span>
                    <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriorityPieChart;