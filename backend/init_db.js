require('dotenv').config();
const db = require('./db');

const initDB = async () => {
  try {
    console.log('Connecting to PostgreSQL and running init script...');
    
    // Create Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        mfa_enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Property Intakes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS property_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        property_type VARCHAR(50),
        location VARCHAR(50),
        budget VARCHAR(50),
        objective VARCHAR(50),
        calculated_score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert mock data if recommendations don't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS master_upgrades (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        category VARCHAR(100),
        cost_category VARCHAR(50),
        impact VARCHAR(50),
        time_est VARCHAR(50),
        cost_est VARCHAR(50),
        type_badge VARCHAR(50),
        is_diy BOOLEAN
      )
    `);

    // Check if master_upgrades works
    const countRes = await db.query('SELECT COUNT(*) FROM master_upgrades');
    if (parseInt(countRes.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO master_upgrades (title, category, cost_category, impact, time_est, cost_est, type_badge, is_diy) VALUES
        ('Smart LED Lighting Panel', 'Lighting', 'Low', 'Medium', '1 Day', '₹5,000', 'badge-low', false),
        ('Fix Wall Dampness (Seepage)', 'Structural', 'Medium', 'High', '5 Days', '₹25,000', 'badge-med', false),
        ('Declutter & Deep Clean', 'Maintenance', 'Low', 'High', '1-2 Days', '₹3,000', 'badge-low', true),
        ('Multi-functional Folding Dining', 'Space Optimization', 'Medium', 'Medium', 'Ready', '₹15,000', 'badge-med', true)
      `);
      console.log('Inserted default upgrades.');
    }

    console.log('Database initialization successful!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
};

initDB();
