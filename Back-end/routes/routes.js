const express = require("express");
const router = express.Router();

 const { fetchPhotographers } = require("../controllers/photographerController");
const { signup } = require("../controllers/signupController");
const { Loginadmin } = require("../controllers/loginController");
const { softDeletePhotographer } = require("../controllers/SoftDeletePho");
const { fetchUsers } = require("../controllers/getUsers");
  
router.get('/photographer', fetchPhotographers);
router.get('/users', fetchUsers);
router.post('/signup', signup);
router.post('/login', Loginadmin);
router.patch('/photographer/:photographerId', softDeletePhotographer);
 
  

module.exports = router;

