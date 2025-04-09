import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const LandingPage = () => {
    const colorMap = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        purple: 'bg-purple-600',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10" />
                    </Link>
                    <div className="flex space-x-6">
                        <Link to="/EmployeeLogin" className="text-gray-800 hover:text-blue-600 transition duration-300">
                            Employee Login
                        </Link>
                        <Link to="/AdminLogin" className="text-gray-800 hover:text-blue-600 transition duration-300">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-32 text-white mt-16">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                        Focus. Organize. Conquer.
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in">
                        Your tasks, simplified. Achieve more with a platform designed for clarity and efficiency.
                    </p>
                    <div className="space-x-4 animate-fade-in">
                        <Link
                            to="/EmployeeLogin"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
                        >
                            Employee Login
                        </Link>
                        <Link
                            to="/AdminLogin"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 inline-block"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                    <p className="text-gray-600 mb-16">Discover the benefits of streamlined task management.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: 'M5 13l4 4L19 7',
                                title: 'Intuitive Interface',
                                description: 'Simple and user-friendly, making task management effortless.',
                                color: 'blue',
                            },
                            {
                                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                                title: 'Time Optimization',
                                description: 'Prioritize and manage tasks efficiently to save valuable time.',
                                color: 'green',
                            },
                            {
                                icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
                                title: 'Enhanced Productivity',
                                description: 'Stay focused and achieve your goals with organized task lists.',
                                color: 'purple',
                            },
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up"
                            >
                                <div
                                    className={`${colorMap[benefit.color]} p-4 rounded-full inline-flex mb-6`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={benefit.icon}
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Key Features</h2>
                    <p className="text-gray-600 mb-16">Assign tasks to team members with clear deadlines and priority levels.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Task Assignment and Prioritization',
                                description: 'Assign tasks to team members with clear deadlines and priority levels.',
                            },
                            {
                                title: 'Deadline Tracking and Notifications',
                                description: 'Set task deadlines and receive automated reminders to stay on schedule.',
                            },
                            {
                                title: 'Progress Reporting',
                                description: 'Generate reports on task completion and team performance with analytics for better decision making.',
                            },
                            {
                                title: 'Real-Time Collaboration',
                                description: 'Add comments, share files, and discuss tasks within the platform for seamless teamwork.',
                            },
                            {
                                title: 'Role-Based Permissions',
                                description: 'Control access levels by assigning roles like Admin, Editor, or Viewer to team members.',
                            },
                            {
                                title: 'Secure Authentication and Authorization',
                                description: 'Ensure only verified users can access the platform using secure login (authentication).',
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up"
                            >
                                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;