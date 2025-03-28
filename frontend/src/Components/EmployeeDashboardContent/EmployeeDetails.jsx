import React, { useEffect, useState } from "react";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiUsers, 
  FiKey, 
  FiEdit, 
  FiSave, 
  FiEye, 
  FiEyeOff 
} from "react-icons/fi";

const EmployeeProfile = () => {
  const username = localStorage.getItem("username");
  const [employee, setEmployee] = useState(null);
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

  useEffect(() => {
    if (!username) {
      setError("Username is missing!");
      setIsLoading(false);
      return;
    }

    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/employee/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/employee/change-password/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      // Reset form and state
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordError("");
      setIsEditingPassword(false);
      alert("Password updated successfully!");
    } catch (error) {
      setPasswordError(error.message);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiUser className="mr-2 text-blue-500" />
          Employee Profile
        </h2>
        {!isEditingPassword && (
          <button
            onClick={() => setIsEditingPassword(true)}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <FiEdit className="mr-2" />
            Change Password
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-500 text-3xl" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold">{employee?.name}</p>
            <p className="text-gray-600">{employee?.team} Team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiUser className="mr-2 text-blue-500" />
              Full Name
            </label>
            <input
              type="text"
              value={employee?.name || ""}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiMail className="mr-2 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              value={employee?.email || ""}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiPhone className="mr-2 text-blue-500" />
              Phone
            </label>
            <input
              type="text"
              value={employee?.phone || ""}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiUsers className="mr-2 text-blue-500" />
              Team
            </label>
            <input
              type="text"
              value={employee?.team || ""}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiUser className="mr-2 text-blue-500" />
              Username
            </label>
            <input
              type="text"
              value={employee?.username || ""}
              readOnly
              className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiKey className="mr-2 text-blue-500" />
              Password
            </label>
            {isEditingPassword ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="w-full p-3 rounded-lg border bg-white border-blue-300 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="w-full p-3 rounded-lg border bg-white border-blue-300 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm New Password"
                    className="w-full p-3 rounded-lg border bg-white border-blue-300 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={handlePasswordUpdate}
                    className="flex items-center px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    <FiSave className="mr-2" />
                    Save Password
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
                    className="flex items-center px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="password"
                  value="••••••••"
                  readOnly
                  className="w-full p-3 rounded-lg border bg-gray-50 border-gray-200 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 cursor-default"
                  disabled
                >
                  <FiEyeOff />
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Change Password" to update your password
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;