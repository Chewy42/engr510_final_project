# Backend Documentation

## Overview
The backend is built using Node.js and Express.js, providing a RESTful API service for the frontend application. This documentation provides detailed information about the backend architecture, components, and their interactions.

## Directory Structure
```
backend/
├── data/               # Data storage directory
├── src/               # Source code
│   ├── __tests__/     # Test files
│   ├── db/            # Database related code
│   ├── middleware/    # Custom middleware
│   ├── routes/        # API route definitions
│   ├── scripts/       # Utility scripts
│   ├── app.js         # Express application setup
│   └── index.js       # Main entry point
├── .env               # Environment variables
└── package.json       # Project dependencies and scripts
```

## Core Components

### Entry Points
- `index.js`: Main server entry point that:
  - Configures environment variables
  - Initializes the database connection
  - Creates a default admin account if not exists
  - Starts the Express server on configured port (default: 5000)
- `app.js`: Express application configuration including:
  - Security middleware (helmet)
  - CORS configuration
  - JSON body parsing
  - Route mounting
  - Error handling middleware

### Security Features
1. **Helmet Integration**: Implements various HTTP headers for security
2. **CORS Protection**: Configured Cross-Origin Resource Sharing
3. **Password Hashing**: Uses bcrypt for secure password storage
4. **Error Handling**: Global error middleware to prevent sensitive information leakage

### Middleware Components

#### Global Middleware
1. **Helmet** (`helmet`)
   - Secures app by setting various HTTP headers
   - Prevents common web vulnerabilities

2. **CORS** (`cors`)
   - Enables Cross-Origin Resource Sharing
   - Allows frontend to communicate with API

3. **Body Parser** (`express.json()`)
   - Parses incoming JSON payloads
   - Enables req.body in routes

#### Authentication Middleware (`src/middleware/auth.js`)
- Purpose: Protect routes requiring authentication
- Implementation:
  ```javascript
  // Usage: router.get('/protected-route', auth, (req, res) => { ... })
  const auth = (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) throw new Error();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate.' });
    }
  };
  ```
- Features:
  - Extracts JWT from Authorization header
  - Verifies token validity
  - Attaches user data to request
  - Returns 401 on authentication failure

### API Endpoints

#### Authentication (`/api/auth`)

1. **Register User**
   - Endpoint: `POST /api/auth/register`
   - Purpose: Create new user account
   - Request Body:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - Success Response (201):
     ```json
     {
       "token": "JWT_TOKEN"
     }
     ```
   - Error Responses:
     - 400: Email already registered
     - 500: Server error

2. **Login User**
   - Endpoint: `POST /api/auth/login`
   - Purpose: Authenticate existing user
   - Request Body:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - Success Response (200):
     ```json
     {
       "token": "JWT_TOKEN"
     }
     ```
   - Error Responses:
     - 401: Invalid credentials
     - 500: Server error

#### Health Check (`/api/health`)
- Endpoint: `GET /api/health`
- Purpose: Server health monitoring
- Response: Status and uptime information

### Error Handling

#### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});
```

#### Error Responses
1. **Authentication Errors** (401)
   - Invalid or missing JWT token
   - Invalid credentials

2. **Bad Request Errors** (400)
   - Duplicate email registration
   - Missing required fields

3. **Server Errors** (500)
   - Database operation failures
   - Unexpected runtime errors

### Authentication Flow
1. User registers or logs in via respective endpoints
2. Server validates credentials and generates JWT token
3. Client stores JWT token
4. Token must be included in Authorization header for protected routes:
   ```
   Authorization: Bearer <token>
   ```

### Security Implementation
1. **Password Security**:
   - Passwords are hashed using bcrypt with salt rounds of 10
   - Original passwords are never stored
2. **JWT Authentication**:
   - Tokens are signed with a secure secret key
   - Tokens contain user ID for session management
3. **Database Security**:
   - Prepared statements prevent SQL injection
   - Email uniqueness is enforced at database level

### Database Layer
The backend uses SQLite through the `better-sqlite3` package for data persistence:

#### Database Configuration
- Location: `data/projectflow.db`
- Implementation: `src/db/database.js`
- Features:
  - Automatic database creation
  - Prepared statements for SQL injection prevention
  - Verbose logging for debugging
  - Foreign key constraints

#### Schema

1. **Users Table**
   ```sql
   CREATE TABLE users (
     uid INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   )
   ```

2. **Projects Table**
   ```sql
   CREATE TABLE projects (
     project_id INTEGER PRIMARY KEY AUTOINCREMENT,
     uid INTEGER NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     data TEXT,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (uid) REFERENCES users(uid)
   )
   ```

#### Data Models

1. **User Model**
   - `uid`: Unique user identifier
   - `email`: User's email address (unique)
   - `password`: Bcrypt hashed password
   - `created_at`: Account creation timestamp

2. **Project Model**
   - `project_id`: Unique project identifier
   - `uid`: Owner's user ID (foreign key)
   - `title`: Project title
   - `description`: Project description
   - `data`: Project data in JSON format
   - `created_at`: Project creation timestamp
   - `updated_at`: Last modification timestamp

#### Database Operations
- All database operations use prepared statements
- Foreign key constraints ensure data integrity
- Timestamps are automatically managed
- JSON data is stored in TEXT fields for flexibility

### Development Setup

1. **Prerequisites**
   - Node.js and npm installed
   - SQLite3 support

2. **Environment Variables**
   Required in `.env`:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

3. **Database Initialization**
   - Database file is automatically created
   - Tables are created if they don't exist
   - Default admin account is created on first run

### Testing
Location: `src/__tests__/`
- Unit tests for core functionality
- Integration tests for API endpoints
- Test utilities and helpers

### Testing Infrastructure

#### Test Setup (`src/__tests__/setup.js`, `setup.ts`)
- Database initialization
- Test environment configuration
- Utility functions for testing

#### Authentication Tests (`src/__tests__/auth.test.js`, `auth.test.ts`)
1. **Test Environment**
   - Fresh database for each test
   - Automated table creation/cleanup
   - Test user seeding

2. **Login Endpoint Tests**
   ```javascript
   describe('POST /api/auth/login', () => {
     // Test valid authentication
     it('should authenticate valid user', async () => {
       const res = await request(app)
         .post('/api/auth/login')
         .send({
           email: 'test@example.com',
           password: 'password'
         });
       expect(res.statusCode).toBe(200);
       expect(res.body).toHaveProperty('token');
     });

     // Test invalid credentials
     it('should reject invalid password');
     it('should reject non-existent user');
   });
   ```

3. **Test Coverage**
   - User authentication
   - Error handling
   - Input validation
   - Database operations

4. **Running Tests**
   ```bash
   # Run all tests
   npm test

   # Run specific test file
   npm test auth.test.js
   ```

### Development Workflow

1. **Local Development**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

2. **Testing**
   - Write tests for new features
   - Ensure all tests pass before deployment
   - Follow TDD practices

3. **Deployment**
   ```bash
   # Build for production
   npm run build

   # Start production server
   npm start
   ```

### Best Practices

1. **Code Organization**
   - Modular route handlers
   - Middleware separation
   - Clear file structure

2. **Security**
   - Environment variable management
   - Secure authentication flow
   - Input validation

3. **Error Handling**
   - Consistent error responses
   - Detailed error logging
   - User-friendly messages

4. **Database**
   - Prepared statements
   - Transaction management
   - Data validation

### Troubleshooting

1. **Common Issues**
   - Database connection errors
   - Authentication failures
   - Environment configuration

2. **Debugging**
   - Check server logs
   - Verify environment variables
   - Test database connectivity

3. **Support**
   - Review documentation
   - Check test coverage
   - Consult development team

### Deployment Considerations
1. **Environment Variables**
   - Secure JWT secret
   - Production port configuration
   - Database path configuration

2. **Security Checklist**
   - ✓ Password hashing
   - ✓ JWT authentication
   - ✓ SQL injection prevention
   - ✓ CORS configuration
   - ✓ HTTP security headers

## AI Services Architecture

### Configuration (`src/config/ai.config.js`)
```javascript
{
  defaultModel: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY,
  apiEndpoint: 'https://api.openai.com/v1',
  maxTokens: 2000,
  temperature: 0.7,
  streamingEnabled: true,
  retryAttempts: 3,
  timeout: 30000
}
```

### Task Queue System

#### Queue Service (`src/services/queue.service.js`)
- Manages asynchronous task processing
- Ensures sequential execution
- Handles task dependencies
- Features:
  - Task prioritization
  - Error handling
  - Progress tracking
  - Child task management

#### Task Types
1. **Project Setup Task**
   - Initial project structure generation
   - Creates PRD and UX analysis tasks

2. **PRD Analysis Task**
   - Analyzes product requirements
   - Generates detailed specifications

3. **UX Analysis Task**
   - Analyzes user experience requirements
   - Generates component hierarchy

4. **Component Generation Task**
   - Generates React components
   - Implements visual layouts

### WebSocket Implementation

#### Server Setup (`src/websocket.js`)
```javascript
const wss = new WebSocket.Server({ server, path: '/ws' });
```

#### Event Handling
1. **Connection Events**
   - New connection setup
   - Client disconnection cleanup
   - Error handling

2. **Message Types**
   - Task updates
   - Generation status
   - Error notifications

3. **Task Updates**
   ```javascript
   eventEmitter.on('taskUpdate', (update) => {
     ws.send(JSON.stringify({
       type: 'task_update',
       ...update
     }));
   });
   ```

### AI Processing Pipeline

1. **Request Flow**
   ```
   Client Request → WebSocket → Task Queue → AI Processing → Real-time Updates
   ```

2. **Task Execution Flow**
   ```
   Project Setup → PRD Analysis → UX Analysis → Component Generation
   ```

3. **Error Handling**
   - Retry mechanism for failed requests
   - Error propagation to client
   - Logging and monitoring

### API Endpoints

#### AI Routes (`/api/ai`)
1. **Generate Response**
   - `POST /api/ai/generate`
   - Handles synchronous AI requests
   - Supports template-based prompts

2. **Stream Response**
   - `POST /api/ai/stream`
   - Server-Sent Events for streaming
   - Real-time response chunks

#### Analysis Routes (`/api/analysis`)
1. **Create Analysis**
   - `POST /api/analysis/:projectId`
   - Supports multiple analyzer types:
     - Business case analysis
     - Requirements analysis
     - Risk assessment

## Configuration
- Environment variables are stored in `.env` file
- Project configuration and dependencies are defined in `package.json`

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start the server: `npm start`

Note: This is an initial documentation version. Further details about specific components, API endpoints, and interactions will be added in subsequent updates.
