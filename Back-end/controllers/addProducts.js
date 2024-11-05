// productController.js

// Import the database pool from config
const pool = require('../config/db');

// Function to add a new product
const addProduct = async (req, res) => {
  const { product_name, price, stock, category, description, image_url } = req.body;
  
  // SQL query to insert a new product
  const query = `
    INSERT INTO products (product_name, price, stock, category, description, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  
  try {
    const { rows } = await pool.query(query, [product_name, price, stock, category, description, image_url]);
    res.status(201).json({ message: 'Product added successfully', product: rows[0] });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

module.exports = { addProduct };
