-- Run this in pgAdmin Query Tool to create initial users
-- Password for all users: Admin@123

-- 1. Create System Administrator
INSERT INTO users (name, email, password, address, role) 
VALUES (
    'System Administrator User',
    'admin@example.com',
    '$2b$10$YourHashedPasswordHere',
    '123 Admin Street, City, State, Country - Administrative Office',
    'admin'
);

-- 2. Create a Store first
INSERT INTO stores (name, email, address) 
VALUES (
    'Sample Electronics Store Name',
    'store@example.com',
    '456 Store Avenue, Shopping District, City, State, Country'
) RETURNING id;

-- Note the store ID from above (let's say it's 1)

-- 3. Create Store Owner linked to the store
INSERT INTO users (name, email, password, address, role, "storeId") 
VALUES (
    'Store Owner Full Name Here',
    'owner@example.com',
    '$2b$10$YourHashedPasswordHere',
    '789 Owner Street, Residential Area, City, State, Country',
    'store_owner',
    1  -- Replace with actual store ID from step 2
);

-- To verify the users were created:
SELECT id, name, email, role, "storeId" FROM users;
SELECT id, name, email FROM stores;
