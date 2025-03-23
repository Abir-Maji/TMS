import React, { useEffect, useState } from "react";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    console.log("logo",loggedInUser)
    if (loggedInUser) {
      setUsername(loggedInUser);
      fetchCollaborators(loggedInUser);
    } else {
      setError("No logged-in user found. Please log in.");
    }
  }, []);

  const fetchCollaborators = async () => {
    try {
        const response = await fetch(`http://localhost:5000/employee/collaborators?username=${username}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Collaborators:", data);
    } catch (error) {
        console.error("Error fetching collaborators:", error);
    }
};

  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Real-Time Collaboration</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mt-4">
        <h3 className="font-semibold mb-4">Collaborators:</h3>
        {collaborators.length === 0 ? (
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
              {collaborators.map((collab) => (
                <tr key={collab._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{collab.name}</td>
                  <td className="py-2 px-4 border-b">{collab.username}</td>
                  <td className="py-2 px-4 border-b">{collab.message || "No message"}</td>
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
