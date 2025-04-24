import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.svg';

const EmployeeLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Define API base URL using import.meta.env
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // SESSION-BASED login handling
            if (data.success && data.user) {
                const userData = data.user;
                localStorage.setItem('username', userData.username);
                localStorage.setItem('team', userData.team || '');
                localStorage.setItem('name', userData.name || '');
                localStorage.setItem('userId', userData._id || '');

                onLoginSuccess(data.user.role || 'employee');
                navigate('/dashboard', { replace: true });
                return;
            }

            // TOKEN-BASED login handling
            if (data.token && (data.user || data.employee)) {
                const userData = data.user || data.employee;
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', userData.username);
                localStorage.setItem('team', userData.team || '');
                localStorage.setItem('name', userData.name || '');
                onLoginSuccess(userData.role || 'employee');
                navigate('/dashboard', { replace: true });
                return;
            }

            throw new Error('Invalid response format from server');
        } catch (err) {
            console.error('Login Error:', err);
            setError(
                err.message === 'Failed to fetch' 
                    ? 'Network error. Please check your connection.'
                    : err.message || 'An unexpected error occurred.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left Side - Illustration */}
                <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-center items-center text-white">
                    <img 
                        src={login} 
                        alt="Employee Login" 
                        className="w-3/4 max-w-xs h-auto mb-8" 
                    />
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-blue-100 text-center">
                        Log in to access your dashboard and view your tasks efficiently.
                    </p>
                </div>
                
                {/* Right Side - Form */}
                <div className="md:w-1/2 p-10 flex flex-col justify-center relative">
                    {/* Back Button */}
                    <button 
                        onClick={handleBack}
                        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Employee Login</h2>
                        <p className="text-gray-600">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoComplete="username"
                                    aria-describedby="username-help"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    aria-describedby="password-help"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
                                disabled={isLoading}
                                aria-busy={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;