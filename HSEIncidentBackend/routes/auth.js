const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    console.log('SIGNUP hit', req.body);   // add this
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log('LOGIN  hit', req.body);   // add this
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Generate token (optional)
    const token = jwt.sign({ email: user.email, id: user._id }, 'secret123', { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
