// scripts/createDatabase.js
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

client
  .connect()
  .then(() => client.query("CREATE DATABASE sessionat"))
  .then(() => console.log("Database created successfully"))
  .catch((err) => console.error("Error creating database", err))
  .finally(() => client.end());

//this is to run all path
//node .\config\createDb.js
