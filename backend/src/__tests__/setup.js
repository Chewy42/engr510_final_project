const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 'JWT_SECRET=test_secret\n');
}

// Load environment variables
dotenv.config({ path: envPath });

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// No need for beforeAll and afterAll in setup file
// They should be in the test files themselves
