import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewProfile = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    team: '',
    username: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { id, username } = useParams(); // Get the employee ID or username from the URL

  // Fetch employee details after component mounts
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage

        // Determine the endpoint based on whether ID or username is provided
        const endpoint = id
          ? `http://localhost:5000/api/employee/${id}`
          : `http://localhost:5000/api/employee/username/${username}`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });

        if (!response.ok) throw new Error('Failed to fetch employee details');

        const data = await response.json();
        setEmployee(data); // Set the fetched employee details
      } catch (error) {
        console.error('Error fetching employee details:', error);
        alert('Failed to fetch employee details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id, username]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      {isLoading ? (
        <p>Loading employee details...</p>
      ) : (
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={employee.name}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={employee.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="text"
              value={employee.phone}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Team</label>
            <input
              type="text"
              value={employee.team}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={employee.username}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default ViewProfile;