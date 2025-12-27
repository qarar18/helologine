require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set. Using in-memory database.');
      return false;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Store active sessions
const sessions = new Map();

// In-memory fallback users (for when MongoDB is not available)
const fallbackUsers = [
  { id: 1, email: 'user@example.com', password: 'hashed_password123' },
  { id: 2, email: 'admin@example.com', password: 'hashed_admin123' }
];

let dbConnected = false;

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

// Register API
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    if (dbConnected) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      // Create new user with hashed password
      const newUser = new User({
        email: email.toLowerCase(),
        password: password
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: { id: newUser._id, email: newUser.email }
      });
    } else {
      // Fallback: In-memory registration
      const existingUser = fallbackUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const newUser = {
        id: fallbackUsers.length + 1,
        email: email,
        password: password
      };

      fallbackUsers.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful (stored in memory)',
        user: { id: newUser.id, email: newUser.email }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  try {
    let user = null;

    if (dbConnected) {
      // Find user in MongoDB
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } else {
      // Fallback: In-memory login
      user = fallbackUsers.find(u => u.email === email);
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId: user._id || user.id,
      email: user.email,
      loginTime: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { id: user._id || user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Logout API
app.post('/api/logout', (req, res) => {
  const { token } = req.body;

  if (sessions.has(token)) {
    sessions.delete(token);
    return res.json({ success: true, message: 'Logout successful' });
  }

  res.status(401).json({ success: false, message: 'Invalid session' });
});

// Verify Token API
app.post('/api/verify', (req, res) => {
  const { token } = req.body;

  if (!sessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const session = sessions.get(token);

  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.json({
    success: true,
    message: 'Token is valid',
    user: { userId: session.userId, email: session.email }
  });
});

// Get user info API
app.get('/api/user/:token', (req, res) => {
  const { token } = req.params;

  if (!sessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const session = sessions.get(token);

  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  res.json({
    success: true,
    user: {
      userId: session.userId,
      email: session.email,
      loginTime: session.loginTime,
      expiresAt: session.expiresAt
    }
  });
});

// Get all registered users (admin only - demo purpose)
app.get('/api/users', async (req, res) => {
  try {
    if (dbConnected) {
      const users = await User.find({}).select('-password');
      res.json({
        success: true,
        count: users.length,
        users: users
      });
    } else {
      res.json({
        success: true,
        count: fallbackUsers.length,
        users: fallbackUsers.map(u => ({ id: u.id, email: u.email }))
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Try to connect to MongoDB
  dbConnected = await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${dbConnected ? 'MongoDB' : 'In-Memory (Fallback)'}`);
    console.log(`\n📝 Test Users:`);
    console.log(`   Email: user@example.com, Password: password123`);
    console.log(`   Email: admin@example.com, Password: admin123\n`);
  });
};

startServer();

module.exports = app;
