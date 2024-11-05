// productController.js
const pool = require('../config/db');

// Function to get all products
const getAllProducts = async (req, res) => {
    const query = 'SELECT * FROM products;';
    
    try {
      const { rows } = await pool.query(query);
      res.status(200).json(rows); // Respond with the products array
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  };
  
  module.exports = { getAllProducts };
  