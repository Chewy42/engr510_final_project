// Setup file for integration tests

// Import environment variables
require('dotenv').config();

// Any other setup needed for integration tests
module.exports = async () => {
  // Add any async setup here
  process.env.NODE_ENV = 'test';
};
