import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.svg';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send login request to the admin login endpoint
            const response = await fetch('http://127.0.0.1:5000/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('Invalid username or password.');
                } else if (response.status === 404) {
                    setError('Endpoint not found.');
                } else if (response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    try {
                        const errorData = await response.json();
                        setError(errorData.message || 'Login failed.');
                    } catch (jsonError) {
                        setError('Login failed.');
                        console.error('Error parsing error response:', jsonError);
                        try {
                            const rawText = await response.text();
                            console.error("Raw response text:", rawText);
                        } catch (textError) {
                            console.error("Failed to get raw text:", textError);
                        }
                    }
                }
                return;
            }

            // Parse the response data
            const data = await response.json();

            // Store the token and username in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', 'admin'); // Store the role as 'admin'

            // Redirect to the admin dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="min-h-max rounded-3xl flex items-center justify-center bg-white">
                <div className="bg-white p-8">
                    <img src={login} alt="Employee Login" className="w-135 h-auto" />
                </div>
                <div className="bg-white p-8 w-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

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
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;