// Import the database pool from config
const pool = require("./../config/db");

// Function to soft delete a photographer
const softDeletePhotographer = async (req, res) => {
  const { photographerId } = req.params; // Get the photographer ID from the request parameters

  try {
    const query = `
      UPDATE users 
      SET is_deleted = true, updated_at = NOW() 
      WHERE user_id = $1
    `;
    await pool.query(query, [photographerId]);
    res.status(200).json({ message: 'Photographer soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting photographer:', error);
    res.status(500).json({ error: 'Error soft deleting photographer' });
  }
};

module.exports = { softDeletePhotographer };
