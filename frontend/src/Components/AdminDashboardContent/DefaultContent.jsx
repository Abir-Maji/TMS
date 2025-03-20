import React from 'react';

const DefaultContent = () => {
  const username = localStorage.getItem('username');
  console.log('Username:', username);


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard, {username}!</h1>
      <p>Select a feature from the sidebar to get started.</p>
    </div>
  );
};

export default DefaultContent;