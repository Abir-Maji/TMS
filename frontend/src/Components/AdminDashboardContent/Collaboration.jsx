import React, { useEffect, useState } from "react";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/collaborators");
      if (!response.ok) throw new Error("Failed to fetch collaborators");
      const data = await response.json();
      setCollaborators(data);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      setError(error.message || "Failed to fetch collaborators. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedCollaborator || !messageInput.trim()) {
      setError("Please select a collaborator and enter a message");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/collaborators/${selectedCollaborator._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageInput }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      setSuccessMessage(`Message sent to ${selectedCollaborator.name}`);
      setMessageInput("");
      fetchCollaborators();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Messaging</h2>
        <button
          onClick={fetchCollaborators}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
        >
          Refresh List
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Collaborator List */}
        <div className="md:col-span-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Collaborators</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No collaborators found.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {collaborators.map((collab) => (
                <div
                  key={collab._id}
                  onClick={() => setSelectedCollaborator(collab)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedCollaborator?._id === collab._id
                      ? "bg-indigo-100 border-indigo-300 border"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium text-gray-900">{collab.name}</div>
                  <div className="text-sm text-gray-500">@{collab.username}</div>
                  {collab.message && (
                    <div className="text-xs mt-1 text-gray-600 truncate">
                      Last message: "{collab.message}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messaging Area */}
        <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          {selectedCollaborator ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Message to {selectedCollaborator.name}
                </h3>
                <p className="text-sm text-gray-500">
                  @{selectedCollaborator.username}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={`px-4 py-2 rounded-md text-white ${
                    messageInput.trim()
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  Send Message
                </button>
              </div>

              {selectedCollaborator.message && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Previous Message
                  </h4>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    {selectedCollaborator.message}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {collaborators.length > 0
                  ? "Select a collaborator to send a message"
                  : "No collaborators available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collaboration;