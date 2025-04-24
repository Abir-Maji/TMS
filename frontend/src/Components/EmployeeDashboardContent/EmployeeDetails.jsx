import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUsers,
  FiKey,
  FiEdit,
  FiSave,
  FiEye,
  FiEyeOff,
  FiBriefcase
} from "react-icons/fi";
import { toast } from "react-toastify";

const EmployeeProfile = () => {
  const username = localStorage.getItem("username");
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    team: "",
    username: "",
    designation: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/employee/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError(error.response?.data?.message || "Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchEmployeeData();
    } else {
      setError("No user logged in");
      setIsLoading(false);
    }
  }, [username]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Current and new passwords are required!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long!");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/control/update-password`,
        {
          username: username,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setPasswordError("");
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordError(
        error.response?.data?.message || 
        error.message || 
        "Failed to update password. Please try again."
      );
    }
  };
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-700 bg-opacity-30 rounded-full">
                <FiUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{employee.name}</h1>
                <p className="text-blue-100">{employee.designation} • {employee.team} Team</p>
              </div>
            </div>
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-700 rounded-lg transition-all backdrop-blur-sm border border-white border-opacity-30"
              >
                <FiEdit className="mr-2" />
                Change Password
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Picture Column */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center mb-4 border-4 border-white shadow-lg">
              <FiUser className="text-blue-500 text-5xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{employee.name}</h3>
            <p className="text-blue-600">{employee.designation}</p>
          </div>

          {/* Information Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField icon={<FiUser />} label="Full Name" value={employee.name} />
                <InfoField icon={<FiPhone />} label="Phone" value={employee.phone} />
                <InfoField icon={<FiBriefcase />} label="Designation" value={employee.designation} />
                <InfoField icon={<FiMail />} label="Email" value={employee.email} />
                <InfoField icon={<FiUsers />} label="Team" value={employee.team} />
                <InfoField icon={<FiUser />} label="Username" value={employee.username} />
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                <FiKey className="mr-2 text-blue-500" />
                Password Management
              </h2>
              {isEditingPassword ? (
                <div className="space-y-4">
                  <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    showPassword={showCurrentPassword}
                    toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    showPassword={showNewPassword}
                    toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
                  />
                  <PasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    showPassword={showConfirmPassword}
                    toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  />

                  {passwordError && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{passwordError}</div>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handlePasswordUpdate}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FiSave className="mr-2" />
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordError("");
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        });
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Password</p>
                      <p className="text-sm text-gray-500">Last updated 3 days ago</p>
                    </div>
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoField Component
const InfoField = ({ icon, label, value }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
      {React.cloneElement(icon, { className: "mr-2 text-blue-500" })}
      {label}
    </label>
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      {value || "-"}
    </div>
  </div>
);

// Reusable PasswordInput Component
const PasswordInput = ({ label, name, value, onChange, showPassword, toggleShowPassword }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>
);

export default EmployeeProfile;