import React, { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function AcceptPhotographers() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const photographersPerPage = 6;

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/deleted-photographers');
        const sortedPhotographers = response.data.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        setPhotographers(sortedPhotographers);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographers();
  }, [sortOrder]);

  const handleAccept = async (userId) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/accept-photographer/${userId}`);
      setPhotographers((prev) => prev.filter((p) => p.user_id !== userId));
      swal("Accepted!", response.data.success, "success");
    } catch (error) {
      console.error('Error accepting photographer:', error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Pagination logic
  const indexOfLastPhotographer = currentPage * photographersPerPage;
  const indexOfFirstPhotographer = indexOfLastPhotographer - photographersPerPage;
  const currentPhotographers = photographers.slice(indexOfFirstPhotographer, indexOfLastPhotographer);
  const totalPages = Math.ceil(photographers.length / photographersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8  min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#704e81]">
            
            Accept Photographers
            </h2>
          <button
            onClick={toggleSortOrder}
            className="bg-[#704e81] hover:bg-[#5d4069] text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
          >
            <span>Sort by Date</span>
            <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPhotographers.map((photographer) => (
            <div key={photographer.user_id} className="bg-white rounded-xl shadow-lg p-6 transform transition duration-200 hover:scale-105">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">{photographer.full_name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <span className="font-medium w-32">Email:</span>
                    <span>{photographer.email}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Phone:</span>
                    <span>{photographer.phone_number}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">City:</span>
                    <span>{photographer.city}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Experience:</span>
                    <span>{photographer.years_of_experience} years</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Created At:</span>
                    <span>{new Date(photographer.created_at).toLocaleString()}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Portfolio:</span>
                    <a href={photographer.portfolio_link} className="text-[#704e81] hover:underline" target="_blank" rel="noopener noreferrer">
                      View Portfolio
                    </a>
                  </p>
                </div>
                <button
                  className="w-full mt-4 bg-[#704e81] hover:bg-[#5d4069] text-white py-2 rounded-lg transition duration-200"
                  onClick={() => handleAccept(photographer.user_id)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>

        {photographers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No deleted photographers available for acceptance.</p>
          </div>
        )}

        {photographers.length > photographersPerPage && (
          <div className="flex justify-center space-x-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#704e81] hover:bg-[#5d4069] text-white'
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-[#5d4069] text-white'
                    : 'bg-[#704e81] hover:bg-[#5d4069] text-white'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#704e81] hover:bg-[#5d4069] text-white'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptPhotographers;
