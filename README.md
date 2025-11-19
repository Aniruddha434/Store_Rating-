# Store Rating Platform

A full-stack web application for rating stores with role-based access control.

## Tech Stack

- **Backend**: NestJS
- **Database**: PostgreSQL
- **Frontend**: React + Vite

## Features

### System Administrator
- Add stores, users, and admin users
- View dashboard with statistics
- Manage users and stores with filtering and sorting
- View all user details and ratings

### Normal User
- Sign up and login
- Update password
- View and search stores
- Submit and modify ratings (1-5 stars)

### Store Owner
- Login and update password
- View ratings from users
- See average store rating

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE store_rating;
```

2. Update database credentials in `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=store_rating
JWT_SECRET=your-secret-key
PORT=3001
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run start:dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Default Admin Account

To create an admin account, you can use the API directly or create via database:

```sql
INSERT INTO users (name, email, password, address, role) 
VALUES (
  'System Administrator Account',
  'admin@example.com',
  '$2b$10$YourHashedPasswordHere',
  '123 Admin Street, City, Country',
  'admin'
);
```

Or use this API endpoint after starting the backend:
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator Account",
    "email": "admin@example.com",
    "password": "Admin@123",
    "address": "123 Admin Street, City, Country"
  }'
```

Then manually update the role in database to 'admin'.

## Form Validations

- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Email**: Standard email validation

## API Endpoints

### Auth
- POST `/auth/signup` - User registration
- POST `/auth/login` - User login

### Users (Admin only)
- GET `/users` - List all users with filters
- POST `/users` - Create new user
- GET `/users/stats` - Get user statistics
- PATCH `/users/password` - Update password

### Stores
- GET `/stores` - List all stores with filters
- POST `/stores` - Create store (Admin only)
- GET `/stores/stats` - Get store statistics (Admin only)

### Ratings
- POST `/ratings` - Submit/update rating
- GET `/ratings/my-ratings` - Get user's ratings
- GET `/ratings/store?storeId=X` - Get store ratings
- GET `/ratings/average?storeId=X` - Get average rating
- GET `/ratings/stats` - Get rating statistics (Admin only)

## Database Schema

### Users Table
- id (PK)
- name (varchar 60)
- email (unique)
- password (hashed)
- address (varchar 400)
- role (enum: admin, user, store_owner)
- storeId (FK, nullable)

### Stores Table
- id (PK)
- name (varchar 60)
- email
- address (varchar 400)

### Ratings Table
- id (PK)
- userId (FK)
- storeId (FK)
- rating (int 1-5)
- Unique constraint on (userId, storeId)

## Best Practices Implemented

- JWT authentication
- Password hashing with bcrypt
- Input validation with class-validator
- Role-based access control
- RESTful API design
- TypeORM for database management
- Responsive UI design
- Error handling
- CORS enabled
- Environment variables for configuration
