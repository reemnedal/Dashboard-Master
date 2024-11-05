// Frontend: BookedSessions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Mail, Phone, User, Camera, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

function BookedSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(2);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortCriteria, setSortCriteria] = useState('date_asc');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/booked-sessions');
        setSessions(response.data);
      } catch (error) {
        console.error('Error fetching booked sessions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter(session => {
    const formattedDate = format(new Date(session.booking_created_at), 'MMM d, yyyy');
    const searchMatch = 
      session.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.photographer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formattedDate.toLowerCase().includes(searchTerm.toLowerCase())  ||
      session.session_place.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || session.booking_status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Sorting Logic
  const sortedSessions = filteredSessions.sort((a, b) => {
    switch (sortCriteria) {
      case 'date_asc':
        return new Date(a.booking_created_at) - new Date(b.booking_created_at);
      case 'date_desc':
        return new Date(b.booking_created_at) - new Date(a.booking_created_at);
      case 'client_name_asc':
        return a.client_name.localeCompare(b.client_name);
      case 'client_name_desc':
        return b.client_name.localeCompare(a.client_name);
      default:
        return 0;
    }
  });

  // Pagination Logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#704e81]" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#704e81]">
            Booked Sessions ({filteredSessions.length})
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81]"
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="date_asc">Date Ascending</option>
              <option value="date_desc">Date Descending</option>
              <option value="client_name_asc">Client Name Ascending</option>
              <option value="client_name_desc">Client Name Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentSessions.map((session) => (
          <div key={session.booked_session_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.booking_status)}`}>
                  {session.booking_status.charAt(0).toUpperCase() + session.booking_status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Booked on: {format(new Date(session.booking_created_at), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#704e81] flex items-center gap-2">
                    <User size={20} />
                    Client Details
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">{session.client_name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {session.client_email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      {session.client_phone}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {session.client_city}
                    </p>
                  </div>
                </div>

                {/* Photographer Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#704e81] flex items-center gap-2">
                    <Camera size={20} />
                    Photographer Details
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">{session.photographer_name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {session.photographer_email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      {session.photographer_phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#704e81] mb-3">Session Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {format(new Date(session.session_date), 'MMMM d, yyyy')}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {format(new Date(`2000-01-01T${session.time_from}`), 'h:mm a')} - 
                      {format(new Date(`2000-01-01T${session.time_to}`), 'h:mm a')}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {session.session_place}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={()   => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-[#704e81] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookedSessions;
