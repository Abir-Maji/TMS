import React, { useEffect, useState } from "react";
import { 
  FiEdit, FiTrash2, FiUser, FiMail, FiPhone, 
  FiUsers, FiX, FiCheck, FiSearch, FiBriefcase,
  FiChevronLeft, FiChevronRight, FiAlertCircle, FiKey, } from "react-icons/fi";

const ViewEmployees = ({ authToken }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    team: "",
    designation: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, pagination.limit, filters]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.team && { team: filters.team }),
        ...(filters.designation && { designation: filters.designation }),
        ...(searchTerm && { search: searchTerm })
      }).toString();

      const response = await fetch(
        `http://localhost:5000/api/control/employees?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch employees');
      }

      setEmployees(data.docs || data);
      setPagination(prev => ({
        ...prev,
        total: data.totalDocs || data.total || 0,
        pages: data.totalPages || Math.ceil((data.totalDocs || data.total || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/control/employees/${selectedEmployee._id}`,
        {
          method: "PUT",
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(selectedEmployee),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }

      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      setError(error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/control/employees/${id}`,
          { 
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete employee');
        }

        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError(error.message);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-auto">
          <select
            name="team"
            value={filters.team}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Teams</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>

           
          </select>
        </div>
        <div className="w-full md:w-auto">
          <select
            name="designation"
            value={filters.designation}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Designations</option>
            <option value="">Select Designation</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Employee Cards */}
          {employees.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
              No employees found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div key={employee._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FiUser className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                        <p className="text-sm text-gray-500">@{employee.username}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.email}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.team}</span>
                      </div>
                      <div className="flex items-center">
                        <FiBriefcase className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.designation}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.username}</span>
                      </div>
                      <div className="flex items-center">
                        <FiKey className="text-gray-400 mr-3" />
                        <span className="text-gray-600">{employee.password}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <button
                        onClick={() => handleUpdateClick(employee)}
                        className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`flex items-center px-4 py-2 rounded-lg ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiChevronLeft className="mr-1" /> Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-full ${pagination.page === pageNum ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                  <span className="px-2">...</span>
                )}
                {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                  <button
                    onClick={() => handlePageChange(pagination.pages)}
                    className={`w-10 h-10 rounded-full ${pagination.page === pagination.pages ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {pagination.pages}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`flex items-center px-4 py-2 rounded-lg ${pagination.page === pagination.pages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Update Employee Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Update Employee</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedEmployee.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  name="team"
                  value={selectedEmployee.team || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Team</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select
                  name="designation"
                  value={selectedEmployee.designation || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Designation</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Marketing Specialist">Marketing Specialist</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <FiCheck className="mr-1" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployees;