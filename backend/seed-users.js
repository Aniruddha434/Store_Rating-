const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function seedUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'store_rating',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Hash password: Admin@123
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // 1. Create System Administrator
    console.log('\n1. Creating System Administrator...');
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [
        'System Administrator Account',
        'admin@example.com',
        hashedPassword,
        '123 Admin Street, Administrative District, City, State, Country',
        'admin'
      ]
    );
    if (adminResult.rows.length > 0) {
      console.log('✓ Admin created:', adminResult.rows[0].email);
    } else {
      console.log('✓ Admin already exists');
    }

    // 2. Create a Store
    console.log('\n2. Creating Sample Store...');
    const storeResult = await client.query(
      `INSERT INTO stores (name, email, address) 
       VALUES ($1, $2, $3) 
       RETURNING id, name`,
      [
        'Premium Electronics Store and Services',
        'store@example.com',
        '456 Shopping Avenue, Commercial District, City, State, Country'
      ]
    );
    const storeId = storeResult.rows[0].id;
    console.log('✓ Store created:', storeResult.rows[0].name, '(ID:', storeId + ')');

    // 3. Create Store Owner
    console.log('\n3. Creating Store Owner...');
    const ownerResult = await client.query(
      `INSERT INTO users (name, email, password, address, role, "storeId") 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [
        'Store Owner Full Name Account',
        'owner@example.com',
        hashedPassword,
        '789 Owner Street, Residential Area, City, State, Country',
        'store_owner',
        storeId
      ]
    );
    if (ownerResult.rows.length > 0) {
      console.log('✓ Store Owner created:', ownerResult.rows[0].email);
    } else {
      console.log('✓ Store Owner already exists');
    }

    // 4. Create a Normal User for testing
    console.log('\n4. Creating Test Normal User...');
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, address, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [
        'Normal User Test Account Name',
        'user@example.com',
        hashedPassword,
        '321 User Lane, Residential Area, City, State, Country',
        'user'
      ]
    );
    if (userResult.rows.length > 0) {
      console.log('✓ Normal User created:', userResult.rows[0].email);
    } else {
      console.log('✓ Normal User already exists');
    }

    console.log('\n========================================');
    console.log('SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nLogin Credentials (Password for all: Admin@123):\n');
    console.log('1. SYSTEM ADMINISTRATOR:');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin@123');
    console.log('\n2. STORE OWNER:');
    console.log('   Email: owner@example.com');
    console.log('   Password: Admin@123');
    console.log('\n3. NORMAL USER:');
    console.log('   Email: user@example.com');
    console.log('   Password: Admin@123');
    console.log('\n========================================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seedUsers();
