// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

// const AdminDashboard = () => {
//   const [activeContent, setActiveContent] = useState('default'); // State for active content
//   const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // State for sidebar expansion
//   const navigate = useNavigate(); // Hook for programmatic navigation

//   // Logout function
//   const handleLogout = () => {
//     // Clear user session or token (e.g., remove from localStorage)
//     localStorage.removeItem('authToken'); // Example: Remove authentication token

//     // Redirect to the Admin Login Page
//     navigate('/adminlogin'); // Replace '/adminlogin' with your admin login route
//   };

//   // Toggle sidebar expansion
//   const toggleSidebar = () => {
//     setIsSidebarExpanded(!isSidebarExpanded);
//   };

//   const handleRegisterEmployee = async (e) => {
//     e.preventDefault();

//     const employeeData = {
//       name: e.target.elements.name.value,
//       email: e.target.elements.email.value,
//       phone: e.target.elements.phone.value,
//       team: e.target.elements.team.value,
//       username: e.target.elements.username.value,
//       password: e.target.elements.password.value,
//     };

//     try {
//       const response = await fetch('http://localhost:5000/employee/register-employee', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(employeeData),
//       });

//       const responseText = await response.text(); // Log the raw response
//       console.log('Response:', responseText);

//       const result = JSON.parse(responseText); // Parse the response manually
//       if (response.ok) {
//         alert('Employee registered successfully');
//       } else {
//         alert(result.message || 'Registration failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred during registration');
//     }
//   };

//   const renderContent = () => {
//     switch (activeContent) {
//       case 'taskAssignment':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Task Assignment and Prioritization</h2>
//             <form>
//               <input type="text" placeholder="Task Name" className="border rounded px-3 py-2 mb-2 w-full" />
//               <select className="border rounded px-3 py-2 mb-2 w-full">
//                 <option>High Priority</option>
//                 <option>Medium Priority</option>
//                 <option>Low Priority</option>
//               </select>
//               <input type="date" className="border rounded px-3 py-2 mb-2 w-full" />
//               <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Assign Task
//               </button>
              
//             </form>
//           </div>
//         );
//       case 'deadlineTracking':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Deadline Tracking and Notifications</h2>
//             <p>Upcoming Deadlines:</p>
//             <ul className="list-disc pl-5">
//               <li>Task 1 - Due: 2023-10-15</li>
//               <li>Task 2 - Due: 2023-10-20</li>
//             </ul>
//           </div>
//         );
//       case 'progressReporting':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Progress Reporting</h2>
//             <p>Task Completion Rate: 75%</p>
//             <p>Team Performance: Excellent</p>
//           </div>
//         );
//       case 'collaboration':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Real-Time Collaboration</h2>
//             <textarea placeholder="Add a comment..." className="border rounded px-3 py-2 mb-2 w-full"></textarea>
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//               Post Comment
//             </button>
//           </div>
//         );
//       case 'roleManagement':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Role-Based Permissions</h2>
//             <select className="border rounded px-3 py-2 mb-2 w-full">
//               <option>Admin</option>
//               <option>Editor</option>
//               <option>Viewer</option>
//             </select>
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//               Assign Role
//             </button>
//           </div>
//         );
//       case 'registerEmployee':
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Register Employee</h2>
//             <form onSubmit={handleRegisterEmployee}>
//               <input type="text" name="name" placeholder="Employee Name" className="border rounded px-3 py-2 mb-2 w-full" />
//               <input type="email" name="email" placeholder="Employee Email" className="border rounded px-3 py-2 mb-2 w-full" />
//               <input type="tel" name="phone" placeholder="Employee Phone" className="border rounded px-3 py-2 mb-2 w-full" />
//               <input type="text" name="team" placeholder="Employee Team Number" className="border rounded px-3 py-2 mb-2 w-full" />
//               <input type="text" name="username" placeholder="Employee ID" className="border rounded px-3 py-2 mb-2 w-full" />
//               <input type="password" name="password" placeholder="Password" className="border rounded px-3 py-2 mb-2 w-full" />


//               <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Register Employee
//               </button>
//             </form>
//           </div>
//         );
//       default:
//         return (
//           <div className="p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
//             <p>Select a feature from the sidebar to get started.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div
//         className={`flex h-screen flex-col justify-between border-e border-gray-100 bg-white transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'
//           }`}
//       >
//         <div>
//           <div className="inline-flex size-16 items-center justify-center">
//             <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">L</span>
//           </div>

//           <div className="border-t border-gray-100">
//             <div className="px-2">
//               <div className="py-4">
//                 <a
//                   href="#"
//                   onClick={() => setActiveContent('default')}
//                   className="group relative flex items-center rounded-sm bg-blue-50 px-2 py-1.5 text-blue-700"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="size-5 opacity-75"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                   {isSidebarExpanded && (
//                     <span className="ml-2 text-sm font-medium">General</span>
//                   )}
//                 </a>
//               </div>

//               <ul className="space-y-1 border-t border-gray-100 pt-4">
//                 <li>
//                   <a
//                     href="#"
//                     onClick={() => setActiveContent('taskAssignment')}
//                     className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="size-5 opacity-75"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                       />
//                     </svg>
//                     {isSidebarExpanded && (
//                       <span className="ml-2 text-sm font-medium">Tasks</span>
//                     )}
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="#"
//                     onClick={() => setActiveContent('deadlineTracking')}
//                     className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="size-5 opacity-75"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
//                       />
//                     </svg>
//                     {isSidebarExpanded && (
//                       <span className="ml-2 text-sm font-medium">Deadlines</span>
//                     )}
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="#"
//                     onClick={() => setActiveContent('progressReporting')}
//                     className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="size-5 opacity-75"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                       />
//                     </svg>
//                     {isSidebarExpanded && (
//                       <span className="ml-2 text-sm font-medium">Progress</span>
//                     )}
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="#"
//                     onClick={() => setActiveContent('collaboration')}
//                     className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="size-5 opacity-75"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     {isSidebarExpanded && (
//                       <span className="ml-2 text-sm font-medium">Collaboration</span>
//                     )}
//                   </a>
//                 </li>

//                 <li>
//                   <a
//                     href="#"
//                     onClick={() => setActiveContent('registerEmployee')}
//                     className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="size-5 opacity-75"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                       />
//                     </svg>
//                     {isSidebarExpanded && (
//                       <span className="ml-2 text-sm font-medium">Register Employee</span>
//                     )}
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Logout Button */}
//         <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
//           <button
//             onClick={handleLogout}
//             className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-5 opacity-75"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             {isSidebarExpanded && (
//               <span className="ml-2 text-sm font-medium">Logout</span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskAssignment from '../Components/AdminDashboardContent/TaskAssignment';
import DeadlineTracking from '../Components/AdminDashboardContent/DeadlineTracking';
import ProgressReporting from '../Components/AdminDashboardContent/ProgressReporting';
import Collaboration from '../Components/AdminDashboardContent/Collaboration';
import RoleManagement from '../Components/AdminDashboardContent/RoleManagement';
import RegisterEmployee from '../Components/AdminDashboardContent/RegisterEmployee';
import DefaultContent from '../Components/AdminDashboardContent/DefaultContent';

const AdminDashboard = () => {
  const [activeContent, setActiveContent] = useState('default');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/adminlogin');
  };

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Render content based on activeContent state
  const renderContent = () => {
    switch (activeContent) {
      case 'taskAssignment':
        return <TaskAssignment />;
      case 'deadlineTracking':
        return <DeadlineTracking />;
      case 'progressReporting':
        return <ProgressReporting />;
      case 'collaboration':
        return <Collaboration />;
      case 'roleManagement':
        return <RoleManagement />;
      case 'registerEmployee':
        return <RegisterEmployee />;
      default:
        return <DefaultContent />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`flex h-screen flex-col justify-between border-e border-gray-100 bg-white transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div>
          <div className="inline-flex size-16 items-center justify-center">
            <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">L</span>
          </div>

          <div className="border-t border-gray-100">
            <div className="px-2">
              <div className="py-4">
                <a
                  href="#"
                  onClick={() => setActiveContent('default')}
                  className="group relative flex items-center rounded-sm bg-blue-50 px-2 py-1.5 text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 opacity-75"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {isSidebarExpanded && (
                    <span className="ml-2 text-sm font-medium">General</span>
                  )}
                </a>
              </div>

              <ul className="space-y-1 border-t border-gray-100 pt-4">
                <li>
                  <a
                    href="#"
                    onClick={() => setActiveContent('taskAssignment')}
                    className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {isSidebarExpanded && (
                      <span className="ml-2 text-sm font-medium">Tasks</span>
                    )}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() => setActiveContent('deadlineTracking')}
                    className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    {isSidebarExpanded && (
                      <span className="ml-2 text-sm font-medium">Deadlines</span>
                    )}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() => setActiveContent('progressReporting')}
                    className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    {isSidebarExpanded && (
                      <span className="ml-2 text-sm font-medium">Progress</span>
                    )}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() => setActiveContent('collaboration')}
                    className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {isSidebarExpanded && (
                      <span className="ml-2 text-sm font-medium">Collaboration</span>
                    )}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() => setActiveContent('registerEmployee')}
                    className="group relative flex items-center rounded-sm px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {isSidebarExpanded && (
                      <span className="ml-2 text-sm font-medium">Register Employee</span>
                    )}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <button
            onClick={handleLogout}
            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isSidebarExpanded && (
              <span className="ml-2 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;