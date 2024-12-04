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
    name TEXT NOT NULL,
    description TEXT,
    methodology TEXT CHECK(methodology IN ('agile', 'waterfall', 'hybrid')),
    status TEXT,
    target_completion_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
  )
`;

// Create project artifacts table
const createProjectArtifactsTable = `
  CREATE TABLE IF NOT EXISTS project_artifacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    version INTEGER DEFAULT 1,
    status TEXT,
    approved_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (approved_by) REFERENCES users(uid)
  )
`;

// Create analysis results table
const createAnalysisResultsTable = `
  CREATE TABLE IF NOT EXISTS analysis_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    analyzer_type TEXT NOT NULL,
    analysis_data TEXT,
    recommendations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
  )
`;

// Initialize database tables
console.log('Creating database tables...');
db.exec(createUsersTable);
db.exec(createProjectsTable);
db.exec(createProjectArtifactsTable);
db.exec(createAnalysisResultsTable);
console.log('Database tables created successfully');

module.exports = db;
