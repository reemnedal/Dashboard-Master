import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, Mail, MapPin, Phone, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import useSoftDelete from '../Hooks/softDelte';
 
function TablePho() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [photographersPerPage] = useState(6); // Number of photographers to display per page
 const { softDelete, loading: deleteLoading, error: deleteError } = useSoftDelete();

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/photographer');
        setPhotographers(response.data);
      } catch (error) {
        console.error('Error fetching photographer data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographers();
  }, []);

  const filteredPhotographers = photographers.filter(photographer =>
    photographer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photographer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photographer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current photographers based on pagination
  const indexOfLastPhotographer = currentPage * photographersPerPage;
  const indexOfFirstPhotographer = indexOfLastPhotographer - photographersPerPage;
  const currentPhotographers = filteredPhotographers.slice(indexOfFirstPhotographer, indexOfLastPhotographer);

  const totalPages = Math.ceil(filteredPhotographers.length / photographersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#704e81]" />
      </div>
    );
  }



    // Soft delete handler
    const handleDelete = async (photographerId) => {
        const success = await softDelete('http://localhost3000/api/photographer', photographerId);
                if (success) {
          // Refresh the photographer list or remove the deleted photographer from state
          setPhotographers(prev => prev.filter(p => p.user_id !== photographerId)); // Update based on your unique identifier
        }
      };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header and Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#704e81]">
          Total Photographers ({filteredPhotographers.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search photographers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#704e81] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Responsive Table/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPhotographers.map((photographer, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#704e81]">{photographer.full_name}</h3>
                <div className="flex gap-2">
                  {/* <button className="p-2 text-gray-600 hover:text-[#704e81] rounded-full hover:bg-gray-100">
                    <MessageSquare size={20} />
                  </button> */}
                  <button 
                    className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
                    onClick={() => handleDelete(photographer.user_id)} // Pass the user_id for deletion
                    disabled={deleteLoading} // Disable the button while loading
                  >
                    {deleteLoading ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span className="text-sm">{photographer.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm">{photographer.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span className="text-sm">{photographer.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Camera size={16} className="mr-2" />
                  <span className="text-sm line-clamp-2">{photographer.camera_and_equipment}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
              <span className="text-sm text-gray-600">ID: #{index + 1}</span>
              <button className="text-sm text-[#704e81] hover:text-[#5b3e68] font-medium">
                View Details
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
      {filteredPhotographers.length === 0 && (
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No photographers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default TablePho;
