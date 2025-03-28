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
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                setError(responseData.message || 
                       (response.status === 401 ? 'Invalid credentials' : 
                        'Login failed. Please try again.'));
                return;
            }

            // Handle successful login
            const { token, user, employee } = responseData;
            const userData = user || employee; // Handle both response structures
            
            if (!token || !userData) {
                throw new Error('Invalid response from server');
            }

            // Store authentication data
            localStorage.setItem('token', token);
            localStorage.setItem('username', userData.username);
            localStorage.setItem('team', userData.team);
            localStorage.setItem('name', userData.name || '');

            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            setError(err.message === 'Failed to fetch' 
                ? 'Network error. Please check your connection.'
                : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="min-h-max rounded-3xl flex items-center justify-center bg-white">
                <div className="bg-white p-8">
                    <img src={login} alt="Employee Login" className="w-135 h-auto" />
                </div>
                <div className="bg-white p-8 w-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">Employee Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
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
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
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
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;