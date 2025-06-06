import React, { useState, useEffect } from 'react';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/tasks/admin/notifications`);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/admin/notifications/mark-read`);
      setNotifications(prev => prev.map(n => ({ ...n, isNewNotification: false })));
      toast.success('Notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.isNewNotification).length;

  return (
    <div className="relative mr-4">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-800">Completed Tasks</h3>
            {notifications.some(n => n.isNewNotification) && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <CheckIcon className="h-3 w-3 mr-1" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                No completed tasks
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  className={`px-4 py-3 ${notification.isNewNotification ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'} hover:bg-gray-50 cursor-pointer border-b border-gray-100`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    {notification.isNewNotification && (
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500 ml-2"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Completed by: {notification.completedBy}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.completedAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;