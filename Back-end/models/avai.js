


// 


// Import the database pool from config
const pool = require('../config/db');

// Define the function to create the 'available_sessions' table
const createAvailableSessionsTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS available_sessions (
      session_id SERIAL PRIMARY KEY,           -- Unique session identifier
      photographer_id INT NOT NULL,            -- ID of the photographer, linked to 'users' table
      time_from TIME NOT NULL,                 -- Start time of the session
      time_to TIME NOT NULL,                   -- End time of the session
      session_date DATE NOT NULL,              -- Date of the session
      session_place VARCHAR(255),              -- Place of the session
      status VARCHAR(50) DEFAULT 'active',     -- Status of the session (e.g., 'pending', 'confirmed', 'completed')
      price DECIMAL(10, 2) NOT NULL,           -- Price for the session
      deleted BOOLEAN DEFAULT false,           -- Soft delete flag
      notes TEXT,                              -- Additional notes for the session
      created_at TIMESTAMP DEFAULT NOW(),      -- Record creation time
      updated_at TIMESTAMP DEFAULT NOW(),      -- Record last update time
      status_updated_at TIMESTAMP DEFAULT NOW(), -- Time when the status was last updated
      CONSTRAINT fk_photographer
        FOREIGN KEY (photographer_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
    );

    -- Create a trigger to ensure that the photographer has the role of 'photographer'
    CREATE OR REPLACE FUNCTION check_photographer_role()
    RETURNS TRIGGER AS $$ 
    BEGIN
        -- Check if the role of the photographer is 'photographer'
        IF (SELECT role FROM users WHERE user_id = NEW.photographer_id) != 'photographer' THEN 
            RAISE EXCEPTION 'Only users with the role "photographer" can be assigned to a session.'; 
        END IF; 
        RETURN NEW; 
    END; 
    $$ LANGUAGE plpgsql;

    -- Create the trigger to run before inserting or updating a session
    CREATE TRIGGER validate_photographer_role
    BEFORE INSERT OR UPDATE ON available_sessions
    FOR EACH ROW
    EXECUTE FUNCTION check_photographer_role();
    
    -- Create a trigger to update the status_updated_at only when the status changes
    CREATE OR REPLACE FUNCTION update_status_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.status <> OLD.status THEN
            NEW.status_updated_at = NOW(); -- Update timestamp only if the status changes
        ELSE
            NEW.status_updated_at = OLD.status_updated_at; -- Retain the previous timestamp
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER set_status_updated_at
    BEFORE UPDATE ON available_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_status_timestamp();
  `;

  try {
    // Execute the query to create the table and the trigger
    await pool.query(query);
    console.log('Available sessions table and triggers created or already exist');
  } catch (error) {
    console.error('Error creating available sessions table or triggers:', error);
  }
};

// Initialize the table creation process
const init = async () => {
  await createAvailableSessionsTable();
  process.exit(); // Exit the process once the table is created
};

// Run the initialization
init();
