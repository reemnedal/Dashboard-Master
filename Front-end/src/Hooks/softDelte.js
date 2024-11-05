// hooks/useSoftDelete.js
import { useState } from 'react';
import axios from 'axios';

const useSoftDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const softDelete = async (url, id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.patch(`${url}/${id}`, {
        is_deleted: true // Set the soft delete flag to true
      });
      return true; // Indicate success
    } catch (err) {
      setError(err);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { softDelete, loading, error };
};

export default useSoftDelete;
