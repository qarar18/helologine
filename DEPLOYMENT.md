# Helologine - Login System with MongoDB

A modern login and registration system with Node.js/Express backend and MongoDB database integration.

## Features

- ✅ User Registration with email validation
- ✅ Secure Password Hashing (bcryptjs)
- ✅ User Login with JWT-like token sessions
- ✅ Session Management (24-hour expiry)
- ✅ MongoDB Integration for persistent storage
- ✅ Fallback in-memory database if MongoDB is unavailable
- ✅ User data persistence

## Local Development Setup

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/qarar18/helologine.git
cd helologine
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```bash
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helologine?retryWrites=true&w=majority
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
# or
npm start
```

5. Open http://localhost:3000 in your browser

## MongoDB Setup

### Create a Free MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project and cluster
4. Get your connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `username`, `password`, and `database` in the connection string
5. Add your IP address to the IP Whitelist

### Update your `.env` file with the MongoDB URI

```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/helologine?retryWrites=true&w=majority
```

## Deployment on Railway.com

### Prerequisites

- Railway.com account (free tier available)
- GitHub repository with your code

### Deployment Steps

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Add MongoDB integration and Railway config"
git push origin master
```

2. **Deploy on Railway**
   - Go to [Railway.com](https://railway.app)
   - Sign up with GitHub account
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `helologine` repository
   - Click "Deploy"

3. **Configure Environment Variables in Railway**
   - In your Railway project, go to the service
   - Click on the "Variables" tab
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helologine?retryWrites=true&w=majority
     NODE_ENV=production
     ```

4. **Get your deployed URL**
   - Once deployed, Railway will provide you with a public URL
   - Your app will be accessible at that URL

## API Endpoints

### Register User
```
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "token_string",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

### Verify Token
```
POST /api/verify
Content-Type: application/json

{
  "token": "token_string"
}
```

### Get User Info
```
GET /api/user/:token
```

### Logout
```
POST /api/logout
Content-Type: application/json

{
  "token": "token_string"
}
```

### Get All Users (Demo)
```
GET /api/users
```

## Project Structure

```
helologine/
├── frontend.html       # Frontend UI
├── server.js          # Express server with API routes
├── index.js           # (optional) Main entry point
├── package.json       # Dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Example env file
├── .gitignore         # Git ignore rules
├── railway.json       # Railway deployment config
├── models/
│   └── User.js        # MongoDB User schema
└── README.md          # This file
```

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcryptjs for password hashing
- **Deployment**: Railway.com

## Test Credentials (Demo Users)

For local testing, you can use:
- Email: `user@example.com`
- Password: `password123`

Or:
- Email: `admin@example.com`
- Password: `admin123`

## Features in Detail

### Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Passwords are never stored in plain text
- Password comparison is done securely

### Session Management
- Tokens are generated as random strings
- Sessions expire after 24 hours
- Expired tokens are automatically removed

### Database Fallback
- If MongoDB is unavailable, the app uses in-memory storage
- This allows local development without database setup
- In production, MongoDB should always be available

## Troubleshooting

### MongoDB Connection Error
- Check your `.env` file has the correct `MONGODB_URI`
- Verify your IP is whitelisted in MongoDB Atlas
- Ensure your database credentials are correct

### Port Already in Use
- Change the `PORT` in `.env` to a different port
- Or kill the process using the current port

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

ISC

## Support

For issues and questions, please create a GitHub issue in the repository.
