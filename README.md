# Login System

A simple and secure login authentication system with both backend and frontend implementation.

## Features

- 🔐 User Authentication (Login & Registration)
- 📝 Session Management with Token-based Auth
- 🎨 Modern, Responsive Frontend UI
- ⚙️ Express.js Backend Server
- 💾 In-memory Session Storage
- ⏱️ 24-hour Session Expiration
- 📱 Mobile-friendly Design

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** Token-based Sessions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/login-system.git
cd login-system
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

### Run Tests
```bash
npm test
```

## Demo Credentials

Use these credentials to test the application:

- **Email:** user@example.com
- **Password:** password123

OR

- **Email:** admin@example.com
- **Password:** admin123

## Project Structure

```
login-system/
├── index.js           # Core authentication logic
├── server.js          # Express.js server
├── frontend.html      # Frontend UI
├── test.js            # Test file
├── package.json       # Project dependencies
└── README.md          # This file
```

## API Endpoints

### POST /api/login
Login with email and password
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/register
Register new user
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

### POST /api/logout
Logout user
```json
{
  "token": "user_token"
}
```

### POST /api/verify
Verify token validity
```json
{
  "token": "user_token"
}
```

### GET /api/user/:token
Get user information

## Features Breakdown

### Authentication
- Email validation
- Password strength checking (minimum 6 characters)
- Unique email constraint
- Password hashing ready (can be enhanced with bcrypt)

### Session Management
- Token generation
- Session expiration (24 hours)
- Token verification
- Session storage

### Frontend
- Login form
- Registration form
- Dashboard with user info
- Responsive design
- Form validation
- Success/error messages

## Future Enhancements

- [ ] Password hashing with bcrypt
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] JWT implementation
- [ ] Rate limiting
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub, etc.)

## License

MIT License - feel free to use this project for learning and commercial purposes.

## Author

Created as a demo project for authentication systems.

## Support

For issues or questions, please open an issue on GitHub.
