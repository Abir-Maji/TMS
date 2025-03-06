import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import login from '../assets/login.svg';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            // Handle non-OK responses (e.g., 401, 500)
            const errorData = await response.text(); // or response.json() if your server always sends json
            setError(errorData || 'Login failed.');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
    } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred.');
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <div className="min-h-max rounded-3xl flex items-center justify-center bg-white">
                <div className="bg-white p-8  ">
                    <img src={login} alt="Expense Management" className="w-135 h-auto" />
                </div>
                <div className="bg-white p-8 w-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">Employee Login</h2>

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

export default EmployeeLogin;