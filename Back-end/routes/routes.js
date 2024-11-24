const express = require("express");
const router = express.Router();
const pool = require('../config/db'); // Adjust the path as needed

 const { fetchPhotographers } = require("../controllers/photographerController");
const { signup } = require("../controllers/signupController");
const { Loginadmin } = require("../controllers/loginController");
const { softDeletePhotographer } = require("../controllers/SoftDeletePho");
const { fetchUsers } = require("../controllers/getUsers");
const { softDeleteUser } = require("../controllers/SoftDeleteUSer");
const { fetchSessions } = require("../controllers/fetchSessions");
const { softDeleteSession } = require("../controllers/softDeleteSesssions");
const { fetchBookedSessions } = require("../controllers/get_booked_table");
const { fetchDeletedPhotographers, acceptPhotographer } = require("../controllers/getDeletedPhotographer");
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require("../controllers/productController");
   
router.get('/photographer', fetchPhotographers);
router.get('/users', fetchUsers);
router.post('/signup', signup);
router.post('/login', Loginadmin);
router.patch('/photographer/:photographerId', softDeletePhotographer);
router.patch('/users/:userId', softDeleteUser);
router.get('/sessions', fetchSessions);

// Route to soft delete a session
router.patch('/sessions/:sessionId', softDeleteSession);
router.get('/booked-sessions', fetchBookedSessions);
 
router.get("/deleted-photographers", fetchDeletedPhotographers);
router.patch("/accept-photographer/:user_id", acceptPhotographer);

// router.post('/Addproducts', addProduct);
// router.get('/products', getAllProducts);


router.post('/Addproducts', addProduct);

// Route to get all products
router.get('/products', getAllProducts);

// Route to update an existing product
router.put('/products/:id', updateProduct);

// Route to delete a product
router.delete('/products/:id', deleteProduct);

router.get("/users/roles", async (req, res) => {
    try {
      const query = `
        SELECT role AS name, COUNT(*) AS value
        FROM users
        WHERE is_deleted = false
        GROUP BY role
      `;
      const result = await pool.query(query);
      const data = result.rows.map((row) => ({
        ...row,
        color: row.name === "admin" ? "#4CFF4C" : row.name === "photographer" ? "#FF4C4C" : "#4C4CFF",
      }));
      res.json(data);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).send("Server Error");
    }
  });
  
  router.get("/users/cities", async (req, res) => {
    try {
      const query = `
        SELECT city AS name, 
               COUNT(*) FILTER (WHERE role = 'user') AS users,
               COUNT(*) FILTER (WHERE role = 'photographer') AS photographers
        FROM users
        WHERE is_deleted = false
        GROUP BY city
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users by city:", error);
      res.status(500).send("Server Error");
    }
  });



  // Sessions Statistics
router.get("/sessions/status", async (req, res) => {
  try {
    const query = `
      SELECT status AS name, COUNT(*) AS value
      FROM available_sessions
      WHERE deleted = false
      GROUP BY status`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sessions by status:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/sessions/monthly", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(session_date, 'Month') AS name,
        COUNT(*) AS total_sessions,
        AVG(price)::numeric(10,2) AS average_price
      FROM available_sessions
      WHERE deleted = false
      GROUP BY TO_CHAR(session_date, 'Month')`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly sessions:", error);
    res.status(500).send("Server Error");
  }
});

// Payments Statistics
router.get("/payments/summary", async (req, res) => {
  try {
    const query = `
      SELECT 
        SUM(total_amount) AS total_payments,
        AVG(total_amount)::numeric(10,2) AS average_payment,
        SUM(platform_profit) AS total_platform_profit,
        SUM(photographer_profit) AS total_photographer_profit
      FROM payments`;
    const result = await pool.query(query);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/payments/monthly", async (req, res) => {
  try {
    const query = `
      SELECT 
        TO_CHAR(payment_date, 'Month') AS name,
        SUM(total_amount)::numeric(10,2) AS total_amount,
        SUM(platform_profit)::numeric(10,2) AS platform_profit,
        SUM(photographer_profit)::numeric(10,2) AS photographer_profit
      FROM payments
      GROUP BY TO_CHAR(payment_date, 'Month')`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly payments:", error);
    res.status(500).send("Server Error");
  }
});

// Products Statistics
router.get("/products/summary", async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) AS total_products,
        SUM(stock) AS total_stock,
        AVG(price)::numeric(10,2) AS average_price,
        COUNT(DISTINCT category) AS category_count
      FROM products`;
    const result = await pool.query(query);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product summary:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/products/categories", async (req, res) => {
  try {
    const query = `
      SELECT 
        category AS name,
        COUNT(*) AS value,
        SUM(stock) AS total_stock,
        AVG(price)::numeric(10,2) AS average_price
      FROM products 
      WHERE category IS NOT NULL  -- Exclude null categories
      GROUP BY category
      ORDER BY value DESC        -- Sort by count for better visualization
      LIMIT 10                   -- Limit to top 10 categories for better readability
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    res.status(500).send("Server Error");
  }
});  

module.exports = router;

