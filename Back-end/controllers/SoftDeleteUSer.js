// Import the database pool from config
const pool = require("./../config/db");

// Function to soft delete a photographer
const softDeleteUser = async (req, res) => {
  const { userId } = req.params; // Get the photographer ID from the request parameters

  try {
    const query = `
      UPDATE users 
      SET is_deleted = true, updated_at = NOW() 
      WHERE user_id = $1
    `;
    await pool.query(query, [userId]);
    res.status(200).json({ message: 'USer soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting USer:', error);
    res.status(500).json({ error: 'Error soft deleting USer' });
  }
};

module.exports = { softDeleteUser };
