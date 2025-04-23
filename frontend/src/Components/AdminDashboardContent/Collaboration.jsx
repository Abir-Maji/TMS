import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiSend, FiMessageSquare, FiUser } from "react-icons/fi";

const Collaboration = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [filteredCollaborators, setFilteredCollaborators] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    fetchCollaborators();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = collaborators.filter(
        (collab) =>
          collab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collab.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCollaborators(filtered);
    } else {
      setFilteredCollaborators(collaborators);
    }
  }, [searchTerm, collaborators]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/collaborators`);
      if (!response.ok) throw new Error("Failed to fetch collaborators");
      const data = await response.json();
      setCollaborators(data);
      setFilteredCollaborators(data);
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
        `${API_BASE_URL}/api/admin/collaborators/${selectedCollaborator._id}`,
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-full mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <FiMessageSquare className="text-2xl" />
                <h1 className="text-2xl font-bold">Collaboration Hub</h1>
              </div>
              <button
                onClick={fetchCollaborators}
                className="flex items-center px-4 py-2 bg-white text-blue-600 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all backdrop-blur-sm"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Collaborator List */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
                    <div className="relative mt-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search collaborators..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : filteredCollaborators.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-gray-500">
                          {searchTerm ? "No matching collaborators" : "No collaborators found"}
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {filteredCollaborators.map((collab) => (
                          <li
                            key={collab._id}
                            onClick={() => setSelectedCollaborator(collab)}
                            className={`p-4 cursor-pointer transition-colors ${
                              selectedCollaborator?._id === collab._id
                                ? "bg-blue-50"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                                <FiUser className="text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {collab.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  @{collab.username}
                                </p>
                              </div>
                            </div>
                            {collab.message && (
                              <div className="mt-2 text-xs text-gray-500 truncate">
                                <span className="font-medium">Last:</span> {collab.message}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Messaging Area */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col">
                  {selectedCollaborator ? (
                    <>
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                            <FiUser className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {selectedCollaborator.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              @{selectedCollaborator.username}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
                        {selectedCollaborator.message ? (
                          <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4 max-w-3xl">
                              <div className="text-sm text-gray-700">
                                {selectedCollaborator.message}
                              </div>
                              <div className="mt-2 text-xs text-gray-500 text-right">
                                Last message
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">
                              No previous messages with {selectedCollaborator.name}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="space-y-3">
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                            placeholder={`Message ${selectedCollaborator.name}...`}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleSendMessage}
                              disabled={!messageInput.trim()}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                messageInput.trim()
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-gray-400 cursor-not-allowed"
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                              <FiSend className="mr-2" />
                              Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8">
                      <FiMessageSquare className="text-4xl text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">
                        {collaborators.length > 0
                          ? "Select a collaborator to start messaging"
                          : "No collaborators available"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Choose from the list to view conversation history
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;