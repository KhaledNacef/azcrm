// routes/userRoutes.js

const express = require('express');
const { registerUser, loginUser } = require('../controler/user');

const router = express.Router();

// User Registration Route
router.post('/register',registerUser);

// User Login Route
router.post('/login', loginUser);

module.exports = router;
