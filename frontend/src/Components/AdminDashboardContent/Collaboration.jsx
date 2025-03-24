import React, { useEffect, useState } from "react";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which collaborator is being edited
  const [updatedMessage, setUpdatedMessage] = useState(""); // Store the updated message
  const [error, setError] = useState(null); // Store error messages

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/collaborators");
      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      setError("Failed to fetch collaborators. Please try again later.");
    }
  };

  const handleEditClick = (id, currentMessage) => {
    setEditingId(id); // Set the collaborator ID being edited
    setUpdatedMessage(currentMessage); // Pre-fill the input with the current message
  };

  const handleUpdateMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/collaborators/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: updatedMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Failed to update message");
      }

      const updatedCollaborator = await response.json();
      console.log("Updated collaborator:", updatedCollaborator);

      fetchCollaborators(); // Refresh list after update
      setEditingId(null);
    } catch (error) {
      console.error("Error updating message:", error);
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
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.map((collab) => (
                <tr key={collab._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{collab.name}</td>
                  <td className="py-2 px-4 border-b">{collab.username}</td>
                  <td className="py-2 px-4 border-b">
                    {editingId === collab._id ? (
                      <input
                        type="text"
                        value={updatedMessage}
                        onChange={(e) => setUpdatedMessage(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      collab.message || "No message"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editingId === collab._id ? (
                      <button
                        onClick={() => handleUpdateMessage(collab._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(collab._id, collab.message)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                  </td>
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