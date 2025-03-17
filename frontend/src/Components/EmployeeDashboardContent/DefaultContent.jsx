import React from 'react';

const DefaultContent = () => {
  const username = localStorage.getItem('username');
  const team = localStorage.getItem('team');

  // Debugging logs
  console.log('Username:', username);
  console.log('Team:', team);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard, {username}!</h1>
      {team ? (
        <p className="text-lg mb-4">You are part of the <strong>{team}</strong> team.</p>
      ) : (
        <p className="text-lg mb-4">Your team information is not available.</p>
      )}
      <p>Select a feature from the sidebar to get started.</p>
    </div>
  );
};

export default DefaultContent;