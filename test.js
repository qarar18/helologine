// Test and demonstrate login functionality
const { login, register, logout, verifyToken, getUserInfo } = require('./index.js');

console.log('=== LOGIN FUNCTIONALITY DEMO ===\n');

// Test 1: Login with existing user
console.log('Test 1: Login with existing user');
const loginResult = login('user@example.com', 'password123');
console.log('Result:', loginResult);
console.log('');

// Test 2: Login with wrong password
console.log('Test 2: Login with wrong password');
const wrongPasswordResult = login('user@example.com', 'wrongpassword');
console.log('Result:', wrongPasswordResult);
console.log('');

// Test 3: Register new user
console.log('Test 3: Register new user');
const registerResult = register('newuser@example.com', 'newpass123');
console.log('Result:', registerResult);
console.log('');

// Test 4: Verify token
console.log('Test 4: Verify token');
if (loginResult.success) {
  const token = loginResult.token;
  const isValid = verifyToken(token);
  console.log('Token is valid:', isValid);
  
  // Get user info
  const userInfo = getUserInfo(token);
  console.log('User Info:', userInfo);
  console.log('');
  
  // Test 5: Logout
  console.log('Test 5: Logout');
  const logoutResult = logout(token);
  console.log('Result:', logoutResult);
  
  // Verify token after logout
  const isValidAfterLogout = verifyToken(token);
  console.log('Token is valid after logout:', isValidAfterLogout);
}

console.log('\n=== DEMO COMPLETE ===');
