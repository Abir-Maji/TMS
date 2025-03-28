import React, { useEffect, useState } from "react";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/employee/get-all-employees"
      );
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleUpdateClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/update-employee/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedEmployee),
        }
      );

      if (response.ok) {
        alert("Employee updated successfully");
        setIsModalOpen(false);
        fetchEmployees();
      } else {
        alert("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/delete-employee/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Employee deleted successfully");
        fetchEmployees();
      } else {
        alert("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Registered Employees</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Team</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Password</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{employee.name}</td>
              <td className="p-2 border text-center">{employee.email}</td>
              <td className="p-2 border text-center">{employee.phone}</td>
              <td className="p-2 border text-center">{employee.team}</td>
              <td className="p-2 border text-center">{employee.username}</td>
              <td className="p-2 border text-center">{employee.password}</td>

              <td className="p-2 border text-center">
                <button
                  onClick={() => handleUpdateClick(employee)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Employee Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Employee</h2>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={selectedEmployee.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Name"
            />
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={selectedEmployee.email}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Email"
            />
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={selectedEmployee.phone}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Phone"
            />
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Team Number
            </label>
            <input
              type="text"
              name="team"
              value={selectedEmployee.team}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Team"
            />
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={selectedEmployee.username}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
              placeholder="Username"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployees;
