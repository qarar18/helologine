const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Mock user database
const users = [
  { id: 1, email: 'user@example.com', password: 'password123' },
  { id: 2, email: 'admin@example.com', password: 'admin123' }
];

// Store active sessions
const sessions = new Map();

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function findUserByEmail(email) {
  return users.find(user => user.email === email) || null;
}

function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend.html'));
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid password' });
  }

  const token = generateToken();
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    loginTime: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  res.json({
    success: true,
    message: 'Login successful',
    token: token,
    user: { id: user.id, email: user.email }
  });
});

// Register API
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    id: users.length + 1,
    email: email,
    password: password
  };

  users.push(newUser);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: { id: newUser.id, email: newUser.email }
  });
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`\n📝 Demo Users:`);
  console.log(`   Email: user@example.com, Password: password123`);
  console.log(`   Email: admin@example.com, Password: admin123\n`);
});
