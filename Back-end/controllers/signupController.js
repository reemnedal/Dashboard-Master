// Import the database pool from config
const pool = require('../config/db');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Function to handle user signup
const signup = async (req, res) => {
  const { full_name, email, password, city, phone_number } = req.body; // Destructure the data from the request body

  // Validate the input
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 salt rounds

    // Insert the new user into the database
    const query = `
      INSERT INTO users (full_name, email, password, city, phone_number, role)
      VALUES ($1, $2, $3, $4, $5, 'user') RETURNING *; 
    `;

    const values = [full_name, email, hashedPassword, city, phone_number];
    const { rows } = await pool.query(query, values); // Execute the query

    // Respond with the created user (omit password for security)
    const newUser = {
      user_id: rows[0].user_id,
      full_name: rows[0].full_name,
      email: rows[0].email,
      city: rows[0].city,
      phone_number: rows[0].phone_number,
      created_at: rows[0].created_at,
    };

    res.status(201).json(newUser); // Respond with a success message
  } catch (error) {
    console.error('Error signing up user:', error);
    if (error.code === '23505') {
      // Duplicate email error
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Error signing up user.' });
  }
};

module.exports = { signup };
