require('dotenv').config();
const app = require('./app');
const db = require('./db/database');
const bcrypt = require('bcrypt');
const http = require('http');
const setupWebSocket = require('./websocket');

const PORT = process.env.PORT || 5000;

// Create dummy account if it doesn't exist
const createDummyAccount = async () => {
  try {
    const email = 'mfavela@chapman.edu';
    const password = 'password';
    console.log('Creating dummy account:', { email });
    
    // Check if account already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    console.log('Existing user:', existingUser ? 'yes' : 'no');

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
      
      const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, hashedPassword);
      console.log('Dummy account created:', result);
    } else {
      console.log('Dummy account already exists');
    }
  } catch (error) {
    console.error('Error creating dummy account:', error);
  }
};

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Setup WebSocket server using the same HTTP server
const wss = setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket Server is available at ws://localhost:${PORT}/ws`);
  createDummyAccount();
});
