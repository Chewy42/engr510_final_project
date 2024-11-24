import { db } from '../db';

// Set up test database
beforeAll(async () => {
  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

// Clean up after all tests
afterAll(async () => {
  // Close database connection
  await db.close();
});
