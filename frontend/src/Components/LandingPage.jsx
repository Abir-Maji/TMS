// src/components/LandingPage.jsx
import React from 'react';
import { Link } from "react-router-dom";



function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20"></div>
                <div className="relative py-36 text-center text-gray-800">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Focus. Organize. Conquer.</h1>
                        <p className="text-xl mb-10 leading-relaxed">Your tasks, simplified. Achieve more with a platform designed for clarity and efficiency.</p>
                        <a href="/signup" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition duration-300">Start Your Free Trial</a>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600">Discover the benefits of streamlined task management.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-full inline-flex mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Intuitive Interface</h3>
                            <p className="text-gray-600">Simple and user-friendly, making task management effortless.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full inline-flex mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Time Optimization</h3>
                            <p className="text-gray-600">Prioritize and manage tasks efficiently to save valuable time.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-red-400 to-pink-400 p-3 rounded-full inline-flex mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Enhanced Productivity</h3>
                            <p className="text-gray-600">Stay focused and achieve your goals with organized task lists.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-100">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-6">Login</h2>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/EmployeeLogin"
                            className="bg-indigo-600 !text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:bg-indigo-700 transition duration-300 text-xl font-medium">
                            Employee Login
                        </Link>

                        <Link to="/AdminLogin" className="bg-indigo-600 !text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 text-xl font-medium">Admin Login</Link>
                        {/* <Link to="/ManagerLogin" className="bg-indigo-600 !text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 text-xl font-medium">Manager Login</Link> */}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
                        <p className="text-gray-600">Assign tasks to team members with clear deadlines and priority levels.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Task Assignment and Prioritization</h3>
                            <p className="text-gray-600">Assign tasks to team members with clear deadlines and priority levels.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Deadline Tracking and Notifications</h3>
                            <p className="text-gray-600">Set task deadlines and receive automated reminders to stay on schedule.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Progress Reporting</h3>
                            <p className="text-gray-600">Generate reports on task completion and team performance with analytics for better decision making.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Real-Time Collaborating</h3>
                            <p className="text-gray-600">Add comments, share files, and discuss tasks within the platform for seamless teamwork.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Role-Based Permission</h3>
                            <p className="text-gray-600">Control access levels by assigning roles like Admin, Editor, or Viewer to team members.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-3">Secure Authentication and Authorization</h3>
                            <p className="text-gray-600">Ensure only verified users can access the platform using secure login (authentication).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 text-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-8">Ready to Elevate Your Productivity?</h2>
                    <p className="text-lg mb-10">Sign up today and start managing your tasks with ease.</p>
                    <a href="/signup" className="bg-white text-indigo-600 py-3 px-8 rounded-full font-semibold hover:bg-indigo-100 transition duration-300">Get Started Free</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Task Management Pro. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;