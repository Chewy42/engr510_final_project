require('dotenv').config();
const app = require('./app');
const db = require('./db/database');
const bcrypt = require('bcrypt');
const http = require('http');
const setupWebSocket = require('./websocket');

const PORT = process.env.PORT || 5000;
const WS_PORT = process.env.WS_PORT || 3001;

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

// Create HTTP server for WebSocket
const wsServer = http.createServer();
const wss = setupWebSocket(wsServer);

// Start servers
app.listen(PORT, () => {
  console.log(`HTTP Server is running on port ${PORT}`);
  createDummyAccount();
});

wsServer.listen(WS_PORT, () => {
  console.log(`WebSocket Server is running on port ${WS_PORT}`);
});
