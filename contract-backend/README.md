# ConTract Backend Setup

## Quick Start

1. Navigate to backend directory:
   ```
   cd contract-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5001

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Users
- GET /api/users - Get all users (admin only)

### Contractors
- GET /api/contractors - Get all contractors

### Bookings
- GET /api/bookings/my - Get user bookings

### Reviews
- GET /api/reviews - Get all reviews

## Environment Variables
Check .env file for MongoDB connection and JWT secret.
