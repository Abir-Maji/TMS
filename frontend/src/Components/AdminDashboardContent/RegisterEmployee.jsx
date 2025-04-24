import React, { useState } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiUsers, 
  FiKey,
  FiEye, 
  FiEyeOff,
  FiPlusCircle,
  FiBriefcase,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';

const RegisterEmployee = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    team: '',
    designation: '',
    username: '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Designation options as separate cards
  const designationCards = [
    {
      title: 'Software Engineer',
      icon: <FiBriefcase className="text-blue-500" size={24} />,
      color: 'bg-blue-50 border-blue-100 hover:bg-blue-100'
    },
    {
      title: 'Senior Software Engineer',
      icon: <FiBriefcase className="text-green-500" size={24} />,
      color: 'bg-green-50 border-green-100 hover:bg-green-100'
    },
    {
      title: 'Team Lead',
      icon: <FiBriefcase className="text-purple-500" size={24} />,
      color: 'bg-purple-50 border-purple-100 hover:bg-purple-100'
    },
    {
      title: 'Project Manager',
      icon: <FiBriefcase className="text-yellow-500" size={24} />,
      color: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100'
    },
    {
      title: 'UI/UX Designer',
      icon: <FiBriefcase className="text-pink-500" size={24} />,
      color: 'bg-pink-50 border-pink-100 hover:bg-pink-100'
    },
    {
      title: 'QA Engineer',
      icon: <FiBriefcase className="text-red-500" size={24} />,
      color: 'bg-red-50 border-red-100 hover:bg-red-100'
    },
    {
      title: 'DevOps Engineer',
      icon: <FiBriefcase className="text-indigo-500" size={24} />,
      color: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100'
    },
    {
      title: 'Product Manager',
      icon: <FiBriefcase className="text-teal-500" size={24} />,
      color: 'bg-teal-50 border-teal-100 hover:bg-teal-100'
    },
    {
      title: 'HR Manager',
      icon: <FiBriefcase className="text-orange-500" size={24} />,
      color: 'bg-orange-50 border-orange-100 hover:bg-orange-100'
    },
    {
      title: 'Marketing Specialist',
      icon: <FiBriefcase className="text-cyan-500" size={24} />,
      color: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100'
    }
  ];
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team' ? value.toUpperCase() : value
    }));
  };

  const handleDesignationSelect = (designation) => {
    setFormData(prev => ({
      ...prev,
      designation
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/register-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Employee registered successfully!');
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          team: '',
          designation: '',
          username: '',
          password: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setSuccessMessage(result.message || 'Registration failed');
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('An error occurred during registration');
      setShowSuccess(true);
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccess(false);
  };

  return (
    <div className="">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-start justify-between">
            <div className="flex items-start">
              <FiCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
            <button 
              onClick={closeSuccessMessage}
              className="ml-4 text-green-700 hover:text-green-900"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="w-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-6 px-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">New Employee Registration</h1>
              <p className="text-blue-100">Fill in the details below</p>
            </div>
            <FiPlusCircle className="text-3xl" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Abc Def"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@company.com"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 xxxxx xxxxx"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Team Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Team</label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="A"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="abcd"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password Field - Visible Text */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FiKey className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Designation Cards */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {designationCards.map((card, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex flex-col items-center ${card.color} ${
                    formData.designation === card.title ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleDesignationSelect(card.title)}
                >
                  <div className="mb-2">{card.icon}</div>
                  <span className="text-sm text-center font-medium">{card.title}</span>
                </div>
              ))}
            </div>
            {formData.designation && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: <span className="font-medium text-blue-600">{formData.designation}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md"
            >
              <FiPlusCircle className="mr-2" />
              Register Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmployee;