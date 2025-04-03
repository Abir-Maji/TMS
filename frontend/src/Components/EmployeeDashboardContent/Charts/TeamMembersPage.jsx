import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiUser, 
  FiLoader, 
  FiAlertCircle, 
  FiPhone, 
  FiMail, 
  FiAtSign,
  FiSearch,
  FiArrowRight,
  FiX
} from 'react-icons/fi';

const TeamMembersPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const team = localStorage.getItem('team');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        if (!team) {
          throw new Error('No team information found in local storage');
        }

        const response = await fetch(`http://localhost:5000/api/teams/${team}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch team members');
        }

        const { data } = await response.json();
        setTeamMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [team]);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-700">Loading your team...</h2>
        <p className="text-gray-500 mt-2">Gathering all team members</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <FiAlertCircle className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6 max-w-md text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FiLoader className="mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Modal Overlay */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0    bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}'s Profile</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-500 text-2xl" />
                </div>
                <div>
                  <p className="text-lg font-semibold">@{selectedMember.username}</p>
                  <p className="text-blue-600 font-medium">Team {selectedMember.team}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        {selectedMember.phone || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>

                
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiUsers className="text-blue-500 mr-3" />
            Team <span className="text-blue-600 ml-2">{team}</span>
          </h1>
          <p className="text-gray-500 mt-2">
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'} in your team
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search team members..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div 
              key={member._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-500 text-xl" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                    <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                  </div>
                </div>

                {/* <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="flex-shrink-0 mr-2 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiPhone className="flex-shrink-0 mr-2 text-gray-400" />
                    <span>{member.phone || 'Not provided'}</span>
                  </div>
                </div> */}
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Team {member.team}</span>
                  <button 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                    onClick={() => handleViewProfile(member)}
                  >
                    View Profile <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {searchTerm ? 'No matching members found' : 'No members in this team'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search query' 
              : 'This team currently has no members assigned'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeamMembersPage;