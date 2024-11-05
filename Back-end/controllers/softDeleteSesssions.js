// Import the database pool from config
const pool = require("./../config/db");

// Function to soft delete a session
const softDeleteSession = async (req, res) => {
  const { sessionId } = req.params; // Get the session ID from the request parameters

  try {
    const query = `
      UPDATE available_sessions 
      SET deleted = true, updated_at = NOW() 
      WHERE session_id = $1
    `;
    await pool.query(query, [sessionId]);
    res.status(200).json({ message: 'Session soft deleted successfully' });
  } catch (error) {
    console.error('Error soft deleting session:', error);
    res.status(500).json({ error: 'Error soft deleting session' });
  }
};

module.exports = { softDeleteSession };
