const bcrypt = require('bcrypt');
const db = require('../db/database');
const fs = require('fs');
const path = require('path');

async function resetDatabase() {
  try {
    // Ensure .env file exists with JWT_SECRET
    const envPath = path.join(__dirname, '..', '..', '.env');
    if (!fs.existsSync(envPath)) {
      console.log('Creating .env file with JWT_SECRET...');
      fs.writeFileSync(envPath, 'JWT_SECRET=your_jwt_secret_key_here\nPORT=5000\n');
    }

    console.log('Dropping existing tables...');
    db.exec('DROP TABLE IF EXISTS projects');
    db.exec('DROP TABLE IF EXISTS users');
    console.log('Tables dropped successfully');

    console.log('Creating tables...');
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        uid INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        uid INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uid) REFERENCES users(uid)
      )
    `);
    console.log('Tables created successfully');

    // Create dummy account
    const email = 'mfavela@chapman.edu';
    const password = 'password';
    console.log('Creating dummy account:', { email });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
    console.log('Dummy account created:', result);

    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
