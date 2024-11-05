

// Backend: bookedSessions.js
const pool = require("../config/db");

const fetchBookedSessions = async (req, res) => {
  try {
    const query = `
      SELECT 
        bs.booked_session_id,
        bs.status as booking_status,
        bs.status_updated_at as booking_status_updated_at,
        bs.created_at as booking_created_at,
        
        -- User details
        u.full_name as client_name,
        u.email as client_email,
        u.phone_number as client_phone,
        u.city as client_city,
        
        -- Photographer details
        p.full_name as photographer_name,
        p.email as photographer_email,
        p.phone_number as photographer_phone,
        p.portfolio_link,
        p.years_of_experience,
        
        -- Session details
        s.time_from,
        s.time_to,
        s.session_date,
        s.session_place,
        s.price,
        s.notes as session_notes
      FROM booked_sessions bs
      JOIN users u ON bs.user_id = u.user_id
      JOIN users p ON bs.photographer_id = p.user_id
      JOIN available_sessions s ON bs.session_id = s.session_id
      WHERE bs.deleted = false
      ORDER BY bs.created_at DESC
    `;

    const { rows } = await pool.query(query);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No booked sessions found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching booked sessions:', error);
    res.status(500).json({ error: 'Error fetching booked sessions' });
  }
};

module.exports = { fetchBookedSessions };
