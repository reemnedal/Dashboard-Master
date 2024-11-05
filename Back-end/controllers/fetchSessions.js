// Import the database pool from config
const pool = require("./../config/db");

// Function to fetch all sessions that are not deleted
const fetchSessions = async (req, res) => {
  try {
    const query = `
      SELECT 
        available_sessions.*, 
        users.full_name AS photographer_name 
      FROM available_sessions 
      LEFT JOIN users ON available_sessions.photographer_id = users.user_id 
      WHERE available_sessions.deleted = false
    `;

    const { rows } = await pool.query(query);

    // Check if any sessions were found
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No sessions found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error fetching sessions' });
  }
};

module.exports = { fetchSessions };
