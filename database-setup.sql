-- Create database
CREATE DATABASE store_rating;

-- Connect to database
\c store_rating;

-- Tables will be auto-created by TypeORM synchronize
-- But here's the schema for reference:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    "storeId" INTEGER,
    CHECK (role IN ('admin', 'user', 'store_owner'))
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "storeId" INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    UNIQUE("userId", "storeId")
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_ratings_user ON ratings("userId");
CREATE INDEX idx_ratings_store ON ratings("storeId");

-- Insert sample admin user (password: Admin@123)
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'System Administrator Account',
    'admin@example.com',
    '$2b$10$rKZLvXJzqXqX5qXqX5qXqOqXqX5qXqX5qXqX5qXqX5qXqX5qXqX5q',
    '123 Admin Street, City, Country',
    'admin'
);
