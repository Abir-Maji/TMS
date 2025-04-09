import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.svg';

const EmployeeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="min-h-max rounded-3xl flex items-center justify-center bg-white shadow-lg">
                <div className="bg-white p-8">
                    <img src={login} alt="Employee Login" className="w-full max-w-xs h-auto" />
                </div>
                <div className="bg-white p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Employee Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                                aria-describedby="username-help"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                aria-describedby="password-help"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;
