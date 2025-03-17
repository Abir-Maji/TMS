import React, { useEffect, useState } from "react";

const EmployeeProfile = () => {
  const username = localStorage.getItem("username"); // Get username from localStorage
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      setError("Username is missing!");
      setIsLoading(false);
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token
        const response = await fetch(`http://localhost:5000/api/employee/${username}`, {
          headers: { Authorization: `Bearer ${token}` }, // Attach auth token
        });

        if (!response.ok) throw new Error("Failed to fetch employee details");

        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [username]);

  if (isLoading) return <p>Loading employee details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input type="text" value={employee?.name || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input type="email" value={employee?.email || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input type="text" value={employee?.phone || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Team</label>
        <input type="text" value={employee?.team || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Username</label>
        <input type="text" value={employee?.username || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Password</label>
        <input type="text" value={employee?.password || ""} readOnly className="w-full p-2 border rounded bg-gray-100" />
      </div>
    </div>
  );
};

export default EmployeeProfile;