// controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

// JWT Secret - Hardcoded (instead of process.env)
const JWT_SECRET = 'your_secret_key'; // Change this to a secure key

// Register User
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token that expires in 3 hours
      const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '3h' });
  
      // Store token in HttpOnly cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 3 * 60 * 60 * 1000, // Token expires after 3 hours (in milliseconds)
      });
  
      res.json({ message: 'Logged in successfully' });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

module.exports = {
  registerUser,
  loginUser,
};
