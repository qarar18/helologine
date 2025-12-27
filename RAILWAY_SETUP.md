# Railway Deployment Guide

## Quick Deployment Steps

### 1. Create MongoDB Atlas Database (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account and sign in
4. Create a new project named "helologine"
5. Build a Cluster (select the free tier)
6. Once cluster is created:
   - Click "Connect"
   - Create a Database User (save username/password)
   - Add IP Address (click "Add Current IP Address" or "Allow Access from Anywhere" for testing)
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<database>` in the URI

Example connection string:
```
mongodb+srv://user:password@cluster.mongodb.net/helologine?retryWrites=true&w=majority
```

### 2. Deploy to Railway

1. Go to https://railway.app
2. Sign in with GitHub (authorize Railway)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Search for and select `helologine` repository
6. Click "Deploy"

### 3. Add Environment Variables in Railway

1. After deployment starts, go to your project
2. Click on the service (it should show "server.js" or your service name)
3. Click the "Variables" tab (on the right side)
4. Add these variables:

```
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/helologine?retryWrites=true&w=majority
NODE_ENV=production
```

### 4. Get Your Live URL

1. In Railway, click on your service
2. Go to the "Settings" tab
3. Look for "Domains" section
4. You'll see your deployed URL (something like: `https://helologine-production.up.railway.app`)
5. Your app is now live!

## Testing Your Deployed App

Visit your Railway URL and you should see the login page.

Test with credentials:
- Email: `user@example.com`
- Password: `password123`

New registrations will now be saved to your MongoDB database!

## Important Notes

- Keep your `.env` file OUT of git (use `.gitignore`)
- Never commit real database credentials to GitHub
- Always use environment variables for sensitive data
- Your deployed app will have a unique Railway-provided domain
- MongoDB Atlas free tier has limitations:
  - 512MB storage
  - Max 100 connections
  - Suitable for development/testing

## After Deployment

Your user registration data will be automatically saved to MongoDB! All registered users are now persistent.

### View Registered Users

You can see all registered users by visiting:
```
https://your-railway-url/api/users
```

This will return a JSON response with all registered users (without passwords).

## Need Help?

- Railway docs: https://docs.railway.app
- MongoDB Atlas docs: https://docs.atlas.mongodb.com
- Express.js docs: https://expressjs.com
