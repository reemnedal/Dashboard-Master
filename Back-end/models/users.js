// Import the database pool from config
const pool = require('../config/db');

// Define the function to create the 'users' table
const createUsersTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,         -- Full name of the user
      email VARCHAR(255) NOT NULL UNIQUE,      -- Email for contact and login
      password VARCHAR(255) NOT NULL,          -- Password for login
      role VARCHAR(50) NOT NULL ,               -- User role: 'admin', 'photographer', or 'user'
      phone_number VARCHAR(20),                -- Phone number for direct contact
      city VARCHAR(100),                       -- City or location for users
      profile_pic VARCHAR(255),                -- Profile picture URL
      portfolio_link VARCHAR(255),             -- Portfolio URL (for photographers)
      years_of_experience INT,                 -- Years of experience (for photographers)
      camera_and_equipment TEXT,               -- Camera and equipment details (for photographers)
      description TEXT,                        -- Description of the photographer
      is_deleted BOOLEAN DEFAULT false,        -- Soft delete flag
      created_at TIMESTAMP DEFAULT NOW(),      -- Record creation time
      updated_at TIMESTAMP DEFAULT NOW()       -- Record last update time
    );
  `;

  try {
    // Execute the query to create the table
    await pool.query(query);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

// Initialize the table creation process
const init = async () => {
  await createUsersTable();
  process.exit(); // Exit the process once the table is created
};

// Run the initialization
init();
