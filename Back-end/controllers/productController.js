// productController.js

const pool = require("./../config/db");
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

// Function to get all products
const getAllProducts = async (req, res) => {
  const query = 'SELECT * FROM products;';
  
  try {
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Function to update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, price, stock, category, description, image_url } = req.body;

  const query = `
    UPDATE products
    SET product_name = $1, price = $2, stock = $3, category = $4, description = $5, image_url = $6
    WHERE product_id = $7
    RETURNING *;
  `;
  
  try {
    const { rows } = await pool.query(query, [product_name, price, stock, category, description, image_url, id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE product_id = $1 RETURNING *;';

  try {
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = { addProduct, getAllProducts, updateProduct, deleteProduct };
