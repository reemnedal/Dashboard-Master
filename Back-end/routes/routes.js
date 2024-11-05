const express = require("express");
const router = express.Router();

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


module.exports = router;

