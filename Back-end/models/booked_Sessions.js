 

// Import the database pool from config
const pool = require('../config/db');

// Define the function to create the 'booked_sessions' table
const createBookedSessionsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS booked_sessions (
      booked_session_id SERIAL PRIMARY KEY,      -- Unique ID for the booked session
      user_id INT NOT NULL,                      -- User ID (foreign key from 'users' table, must have role 'user')
      photographer_id INT NOT NULL,              -- Photographer ID (foreign key from 'users' table, must have role 'photographer')
      session_id INT NOT NULL,                   -- Session ID (foreign key from 'available_sessions' table)
      deleted BOOLEAN DEFAULT false,             -- Soft delete flag
      status VARCHAR(50) DEFAULT 'pending',      -- Status of the session, default is 'pending'
      status_updated_at TIMESTAMP DEFAULT NOW(), -- Time when the status was last updated
      created_at TIMESTAMP DEFAULT NOW(),        -- Record creation time
      updated_at TIMESTAMP DEFAULT NOW(),        -- Record last update time
      FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,     -- Foreign key constraint for user_id
      FOREIGN KEY (photographer_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,     -- Foreign key constraint for photographer_id
      FOREIGN KEY (session_id) REFERENCES available_sessions(session_id)
        ON DELETE CASCADE ON UPDATE CASCADE      -- Foreign key constraint for session_id
    );

    -- Create a trigger to check the role of the user
    CREATE OR REPLACE FUNCTION check_user_role()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Ensure the user has the 'user' role
      IF (SELECT role FROM users WHERE user_id = NEW.user_id) != 'user' THEN
        RAISE EXCEPTION 'User must have the role of "user"';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create a trigger to check the role of the photographer
    CREATE OR REPLACE FUNCTION check_photographer_role()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Ensure the photographer has the 'photographer' role
      IF (SELECT role FROM users WHERE user_id = NEW.photographer_id) != 'photographer' THEN
        RAISE EXCEPTION 'Photographer must have the role of "photographer"';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create the trigger to run before inserting or updating a booked session for the user role
    CREATE TRIGGER validate_user_role
    BEFORE INSERT OR UPDATE ON booked_sessions
    FOR EACH ROW
    EXECUTE FUNCTION check_user_role();

    -- Create the trigger to run before inserting or updating a booked session for the photographer role
    CREATE TRIGGER validate_photographer_role
    BEFORE INSERT OR UPDATE ON booked_sessions
    FOR EACH ROW
    EXECUTE FUNCTION check_photographer_role();

    -- Create a trigger to update the status_updated_at only when the status changes
    CREATE OR REPLACE FUNCTION update_status_timestamp_booked_sessions()
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

    -- Create the trigger for status change in booked_sessions
    CREATE TRIGGER set_status_updated_at_booked_sessions
    BEFORE UPDATE ON booked_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_status_timestamp_booked_sessions();
  `;

  try {
    // Execute the query to create the table and triggers
    await pool.query(query);
    console.log('Booked sessions table and triggers created or already exist');
  } catch (error) {
    console.error('Error creating booked sessions table or triggers:', error);
  }
};

// Initialize the table creation process
const init = async () => {
  await createBookedSessionsTable();
  process.exit(); // Exit the process once the table is created
};

// Run the initialization
init();



