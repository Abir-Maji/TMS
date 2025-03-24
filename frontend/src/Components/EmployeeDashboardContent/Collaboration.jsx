import React, { useEffect, useState } from "react";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch collaborators for the specified username
  const fetchCollaborators = async (username) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/collaborators?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setCollaborators(data); // Set the array of collaborators directly
      setError(null);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch collaborators when the component mounts
  useEffect(() => {
    const username = localStorage.getItem('username');  // Replace with the dynamic username you want to use
    fetchCollaborators(username);
  }, []); // Only run on mount

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Real-Time Collaboration</h2>

      {isLoading && <p>Loading collaborators...</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mt-4">
        <h3 className="font-semibold mb-4">Collaborators:</h3>

        {collaborators.length === 0 && !isLoading ? (
          <p className="text-gray-500">No collaborators found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.map((collaborator) => (
                <tr key={collaborator._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{collaborator.name}</td>
                  <td className="py-2 px-4 border-b">{collaborator.username}</td>
                  <td className="py-2 px-4 border-b">{collaborator.message || "No message"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Collaboration;