const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Contractor = require('../models/Contractor');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`🔍 Auth Route: ${req.method} ${req.path}`);
  console.log('📋 Headers:', req.headers);
  console.log('📄 Body:', req.body);
  next();
});

// Test endpoint to verify server is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Login with enhanced debugging
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  try {
    console.log('🔐 LOGIN ATTEMPT STARTED');
    console.log('📧 Email:', req.body.email);
    console.log('🔑 Password length:', req.body.password?.length);
    
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ VALIDATION ERRORS:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    
    // Check if user exists
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ USER NOT FOUND');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ USER FOUND:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });

    // Check password
    console.log('🔐 Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ PASSWORD MISMATCH');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ PASSWORD MATCH');

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET NOT FOUND');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    console.log('✅ JWT_SECRET exists');

    // Create token
    const payload = { id: user._id, role: user.role };
    console.log('🎫 Creating token with payload:', payload);
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ TOKEN CREATED');

    const responseData = {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted !== undefined ? user.profileCompleted : true
      }
    };
    
    console.log('📤 SENDING RESPONSE:', {
      ...responseData,
      token: 'TOKEN_HIDDEN_FOR_SECURITY'
    });

    res.json(responseData);

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    console.error('📚 Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register with enhanced debugging
router.post('/register', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('role', 'Role must be either client or contractor').isIn(['client', 'contractor'])
], async (req, res) => {
  try {
    console.log('📝 REGISTRATION ATTEMPT STARTED');
    console.log('📋 Registration data:', {
      ...req.body,
      password: 'PASSWORD_HIDDEN_FOR_SECURITY'
    });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ VALIDATION ERRORS:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('❌ USER ALREADY EXISTS');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('✅ Email available, creating user...');

    // Create new user
    user = new User({ 
      name, 
      email, 
      password, 
      role, 
      phone, 
      address,
      profileCompleted: false
    });

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully');

    // Create contractor profile if needed
    if (role === 'contractor') {
      console.log('👔 Creating contractor profile...');
      const contractor = new Contractor({
        userId: user._id,
        businessName: name,
        availability: {
          monday: { available: true, hours: '9:00 AM - 5:00 PM' },
          tuesday: { available: true, hours: '9:00 AM - 5:00 PM' },
          wednesday: { available: true, hours: '9:00 AM - 5:00 PM' },
          thursday: { available: true, hours: '9:00 AM - 5:00 PM' },
          friday: { available: true, hours: '9:00 AM - 5:00 PM' },
          saturday: { available: false, hours: '' },
          sunday: { available: false, hours: '' }
        }
      });
      await contractor.save();
      console.log('✅ Contractor profile created');
    }

    // Create JWT token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const responseData = {
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    };

    console.log('📤 REGISTRATION SUCCESSFUL');
    res.status(201).json(responseData);

  } catch (error) {
    console.error('💥 REGISTRATION ERROR:', error);
    console.error('📚 Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('👤 GET USER REQUEST for ID:', req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log('❌ USER NOT FOUND in database');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ USER FOUND:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        profileCompleted: user.profileCompleted !== undefined ? user.profileCompleted : true
      }
    });
  } catch (error) {
    console.error('💥 GET USER ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;