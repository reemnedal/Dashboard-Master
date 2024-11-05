// Import the database pool from config
const pool = require("../config/db");

// Function to fetch all photographers who are soft deleted
const fetchDeletedPhotographers = async (req, res) => {
  try {
    const query = `
      SELECT * FROM users 
      WHERE role = 'photographer' AND is_deleted = true
    `;
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No deleted photographers found' });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching photographers' });
  }
};

// Function to accept a photographer (set is_deleted to false)
const acceptPhotographer = async (req, res) => {
  const { user_id } = req.params;
  try {
    const query = `
      UPDATE users 
      SET is_deleted = false 
      WHERE user_id = $1 AND role = 'photographer' AND is_deleted = true
      RETURNING *
    `;
    const { rows } = await pool.query(query, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Photographer not found or already active' });
    }

    res.json({ success: 'Photographer accepted', photographer: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error accepting photographer' });
  }
};

module.exports = { fetchDeletedPhotographers, acceptPhotographer };
