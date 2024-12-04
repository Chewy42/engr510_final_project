module.exports = {
  // Extend the default Jest config
  ...require('./jest.config.js'),
  
  // Specify test pattern for integration tests
  testMatch: ['**/*.integration.test.js'],
  
  // Setup files to run before tests
  setupFiles: ['<rootDir>/tests/setup/integration.setup.js'],
  
  // Configure test environment
  testEnvironment: 'node',
  
  // Configure coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['text', 'lcov'],
  
  // Configure timeouts for integration tests
  testTimeout: 10000,
  
  // Global setup/teardown
  globalSetup: '<rootDir>/tests/setup/global.setup.js',
  globalTeardown: '<rootDir>/tests/setup/global.teardown.js'
};
