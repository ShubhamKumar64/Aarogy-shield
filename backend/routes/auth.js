const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register Routes
router.get('/register', authController.getRegister);   // <-- yaha pe GET register
router.post('/register', authController.postRegister); // <-- yaha pe POST register

// Dashboard
router.get('/dashboard', authController.getDashboard);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
