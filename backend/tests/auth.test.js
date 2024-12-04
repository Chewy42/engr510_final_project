const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../src/db');
const { registerUser, loginUser } = require('../src/auth');

// Mock database and bcrypt
jest.mock('../src/db', () => ({
  prepare: jest.fn()
}));
jest.mock('bcrypt');

describe('Authentication', () => {
  let mockDb;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Set up database mock
    mockDb = {
      prepare: jest.fn().mockReturnThis(),
      get: jest.fn(),
      run: jest.fn().mockReturnValue({ lastID: 1 })
    };
    db.prepare.mockImplementation(() => mockDb);
  });

  describe('User Registration', () => {
    it('should register new user successfully', async () => {
      // Mock user doesn't exist
      mockDb.get.mockReturnValueOnce(null);
      
      // Mock password hashing
      const hashedPassword = 'hashedPassword123';
      bcrypt.hash.mockResolvedValueOnce(hashedPassword);

      // Test registration
      const userData = { email: 'test@example.com', password: 'password123' };
      const result = await registerUser(userData);

      // Verify registration result
      expect(result).toEqual({ id: 1, email: userData.email });

      // Verify database was called correctly
      expect(mockDb.get).toHaveBeenCalledWith(userData.email);
      expect(mockDb.run).toHaveBeenCalledWith(userData.email, hashedPassword);
    });

    it('should fail if user already exists', async () => {
      // Mock user exists
      mockDb.get.mockReturnValueOnce({ id: 1, email: 'test@example.com' });

      const userData = { email: 'test@example.com', password: 'password123' };
      await expect(registerUser(userData)).rejects.toThrow('User already exists');
    });
  });

  describe('User Login', () => {
    it('should login user successfully', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword123' };
      mockDb.get.mockReturnValueOnce(user);

      // Mock password comparison
      bcrypt.compare.mockResolvedValueOnce(true);

      const loginData = { email: 'test@example.com', password: 'password123' };
      const result = await loginUser(loginData);

      expect(result).toHaveProperty('token');
      expect(mockDb.get).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, user.password);
    });

    it('should fail with invalid credentials', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword123' };
      mockDb.get.mockReturnValueOnce(user);

      // Mock password comparison (fails)
      bcrypt.compare.mockResolvedValueOnce(false);

      const loginData = { email: 'test@example.com', password: 'wrongpassword' };
      await expect(loginUser(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should fail if user does not exist', async () => {
      // Mock user not found
      mockDb.get.mockReturnValueOnce(null);

      const loginData = { email: 'nonexistent@example.com', password: 'password123' };
      await expect(loginUser(loginData)).rejects.toThrow('User not found');
    });
  });
});
