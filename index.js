// Simple Login Functionality

// Mock user database
const users = [
  { id: 1, email: 'user@example.com', password: 'password123' },
  { id: 2, email: 'admin@example.com', password: 'admin123' }
];

// Store active sessions
const sessions = new Map();

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean}
 */
function validatePassword(password) {
  return password && password.length >= 6;
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {object|null}
 */
function findUserByEmail(email) {
  return users.find(user => user.email === email) || null;
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} - Session token and user info
 */
function login(email, password) {
  // Validate inputs
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email format' };
  }

  // Find user
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  // Verify password
  if (user.password !== password) {
    return { success: false, message: 'Invalid password' };
  }

  // Create session token
  const token = generateToken();
  sessions.set(token, {
    userId: user.id,
    email: user.email,
    loginTime: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  return {
    success: true,
    message: 'Login successful',
    token: token,
    user: { id: user.id, email: user.email }
  };
}

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object}
 */
function register(email, password) {
  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email format' };
  }

  if (!validatePassword(password)) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }

  const newUser = {
    id: users.length + 1,
    email: email,
    password: password
  };

  users.push(newUser);
  return { success: true, message: 'Registration successful', user: { id: newUser.id, email: newUser.email } };
}

/**
 * Logout user
 * @param {string} token - Session token
 * @returns {object}
 */
function logout(token) {
  if (sessions.has(token)) {
    sessions.delete(token);
    return { success: true, message: 'Logout successful' };
  }
  return { success: false, message: 'Invalid session' };
}

/**
 * Verify session token
 * @param {string} token - Session token
 * @returns {boolean}
 */
function verifyToken(token) {
  const session = sessions.get(token);
  
  if (!session) {
    return false;
  }

  // Check if session expired
  if (new Date() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  return true;
}

/**
 * Generate random token
 * @returns {string}
 */
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get user info from token
 * @param {string} token - Session token
 * @returns {object|null}
 */
function getUserInfo(token) {
  if (!verifyToken(token)) {
    return null;
  }
  return sessions.get(token);
}

// Export functions
module.exports = {
  login,
  register,
  logout,
  verifyToken,
  getUserInfo,
  validateEmail,
  validatePassword
};
