const Database = require('better-sqlite3');
const path = require('path');

// Use an absolute path in the project root for the database
const dbPath = path.join(__dirname, '..', '..', 'data', 'projectflow.db');

// Ensure the data directory exists
const fs = require('fs');
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: console.log });

// Create users table
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create projects table
const createProjectsTable = `
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
`;

// Initialize database tables
console.log('Creating database tables...');
db.exec(createUsersTable);
db.exec(createProjectsTable);
console.log('Database tables created successfully');

module.exports = db;
