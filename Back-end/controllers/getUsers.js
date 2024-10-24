
//this is to get all photographers from users using LIMIT 
// Import the database pool from config
const pool = require("./../config/db");

// Function to fetch all photographers who are not deleted
const fetchUsers = async (req, res) => {
  try {

      const query = `
      SELECT * FROM users 
      WHERE role = 'user' AND is_deleted = false
      
    `;

    const { rows } = await pool.query(query); 

    // Check if any photographers were found
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    // console.log('Photographers found:', rows);
    res.json(rows);  

  } catch (error) {
    // console.error('Error fetching photographers:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

module.exports = { fetchUsers };