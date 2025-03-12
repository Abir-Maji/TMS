import React from 'react';

const Collaboration = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Real-Time Collaboration</h2>
      <textarea
        placeholder="Add a comment..."
        className="border rounded px-3 py-2 mb-2 w-full"
      />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Post Comment
      </button>
    </div>
  );
};

export default Collaboration;