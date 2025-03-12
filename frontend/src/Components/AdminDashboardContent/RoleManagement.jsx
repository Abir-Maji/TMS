import React from 'react';

const RoleManagement = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Role-Based Permissions</h2>
      <select className="border rounded px-3 py-2 mb-2 w-full">
        <option>Admin</option>
        <option>Editor</option>
        <option>Viewer</option>
      </select>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Assign Role
      </button>
    </div>
  );
};

export default RoleManagement;