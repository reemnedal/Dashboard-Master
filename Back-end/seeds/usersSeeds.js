const pool = require('../config/db');

const insertFakeData = async () => {
    const query = `
      INSERT INTO users 
      (full_name, email, password, role, phone_number, city, profile_pic, portfolio_link, years_of_experience, camera_and_equipment, description)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const fakeData = [
        // Example data with description
        ['John Doe', 'john@example.com', 'password123', 'admin', '1234567890', 'New York', 'profile_pic.jpg', null, null, null, null],
        ['Jane Photographer', 'jane@example.com', 'password456', 'photographer', '0987654321', 'Los Angeles', 'https://t4.ftcdn.net/jpg/00/80/27/49/360_F_80274936_PuxHgNwtZ5r9AyfdlyDZD39W2HnJi4Kx.jpg', 'portfolio_link.com', 5, 'Canon 5D, Tripod', 'A passionate photographer focusing on outdoor and nature photography.'],
        ['Sam User', 'sam@example.com', 'password789', 'user', '1122334455', 'Chicago', 'profile_pic3.jpg', null, null, null, null],
        ['Alice Photo', 'alice@example.com', 'alicePass', 'photographer', '1231231234', 'Miami', 'https://i.pinimg.com/564x/fb/34/ed/fb34ed0eb989a59138d6f6da81cab8f7.jpg', 'aliceportfolio.com', 3, 'Nikon D850, Flash', 'Specializing in portraits and lifestyle photography.'],
        ['Bob Snap', 'bob@example.com', 'bobPassword', 'photographer', '5675675678', 'San Francisco', 'https://i.pinimg.com/564x/c2/11/b9/c211b9c2c8322ccd4da025281f6c7617.jpg', 'bobsnaps.com', 10, 'Sony A7III, Drone', 'Expert in aerial photography and videography.'],
        ['Clara Clicks', 'clara@clicks.com', 'claraPass', 'photographer', '7897897890', 'Dallas', 'https://i.pinimg.com/564x/3f/52/0c/3f520c139a3aa44f659679c5cd188f86.jpg', 'claraclicks.com', 8, 'Fujifilm X-T4, Lights', 'Capturing the beauty of everyday moments with creativity.']
    ];

    try {
        for (const data of fakeData) {
            const res = await pool.query(query, data);
            console.log('Inserted:', res.rows[0]);
        }
    } catch (error) {
        console.error('Error inserting fake data:', error);
    }
};

// Run the function to insert fake data
insertFakeData();
