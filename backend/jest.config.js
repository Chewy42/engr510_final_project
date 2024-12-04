module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.test.ts"
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    "/node_modules/",
    "/*.integration.test.js"
  ],

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests"
  ],

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/setup/"
  ],

  // Setup files
  setupFiles: ["<rootDir>/tests/setup/integration.setup.js"]
};
