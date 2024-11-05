import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Loader2 } from 'lucide-react';
import useSoftDelete from '../Hooks/softDelte';

function CardSession() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { softDelete, loading: deleteLoading } = useSoftDelete();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6); // Number of users to display per page

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/sessions'); // Adjust API route as needed
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Filter sessions based on search term and status filter
  const filteredSessions = sessions.filter(session => {
    const matchesSearchTerm =
      session.session_place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.session_date.includes(searchTerm);
    
    const matchesStatusFilter = statusFilter ? session.status === statusFilter : true;

    return matchesSearchTerm && matchesStatusFilter;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredSessions.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredSessions.length / usersPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Soft delete handler
  const handleDelete = async (sessionId) => {
    const success = await softDelete('http://localhost:3000/api/sessions', sessionId);
    if (success) {
      setSessions(prev => prev.filter(session => session.session_id !== sessionId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#704e81]" />
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header and Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#704e81]">
            Total Sessions ({filteredSessions.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full sm:w-64">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81] focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option> 
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentUsers.map((session, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#704e81]">{session.session_place}</h3>
              <h3 className="text-sm text-[#704e81]">Status: {session.status}</h3>
              <p className="text-sm text-gray-600">Photographer: {session.photographer_name || 'N/A'}</p>
              <p className="text-sm text-gray-600">Date: {formatDate(session.session_date)}</p>
              <p className="text-sm text-gray-600">Time: {session.time_from} - {session.time_to}</p>
              <p className="text-sm text-gray-600">Price: {session.price} JD</p>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <button
                className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
                onClick={() => handleDelete(session.session_id)} // Pass the session_id for deletion
                disabled={deleteLoading} // Disable the button while loading
              >
                {deleteLoading ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#704e81] text-white rounded-lg mx-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="self-center text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#704e81] text-white rounded-lg mx-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No sessions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default CardSession;
