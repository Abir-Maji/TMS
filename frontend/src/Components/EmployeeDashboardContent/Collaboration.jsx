import React, { useEffect, useState } from "react";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCollaborators = async (username) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/collaborators/collaborators?username=${encodeURIComponent(username)}`
      );
      console.log(response);
      
      if (response.status === 404) {
        // Treat 404 as empty result, not an error
        setCollaborators([]);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch collaborators');
      }

      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      setError(error.message);
      setCollaborators([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      fetchCollaborators(username);
    } else {
      setError('No username found in local storage');
    }
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Real-Time Collaboration</h2>

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-4">Collaborators:</h3>

        {collaborators.length === 0 && !isLoading ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">No collaborators found for this user.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Collaboration;