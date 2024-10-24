const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./config/db");  
const app = express();
const routes = require('./routes/routes');

// Remove duplicate middleware
app.use(bodyParser.json());
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Remove duplicate root route
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Add this to your server.js to test the connection
app.get('/api/test', (req, res) => {
  res.json({ message: 'Connection successful' });
});

 
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    pool.end();
    console.log('Server shut down gracefully');
  });
});