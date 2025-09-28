const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Public routes for authentication
router.post('/register', registerUser); // For initial Supervisor setup
router.post('/login', loginUser);

module.exports = router;