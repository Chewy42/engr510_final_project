const jwt = require('jsonwebtoken');
const { APIError } = require('./errorHandler');

const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new APIError(401, 'No Authorization header');
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      throw new APIError(401, 'Invalid token format');
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new APIError(401, 'No token provided');
    }

    try {
      // Verify the token and extract user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set user object with id (instead of uid)
      req.user = {
        id: decoded.id,
        ...decoded
      };
      
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      throw new APIError(401, 'Invalid token');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    next(error);
  }
};

module.exports = auth;
