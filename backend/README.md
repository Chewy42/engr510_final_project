# ProjectFlow Backend

This is the backend server for the ProjectFlow application, built with Express.js and Node.js.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

- `GET /api/health` - Health check endpoint to verify server status

## Project Structure

```
backend/
├── src/
│   └── index.js    # Main server file
├── .env            # Environment variables
└── package.json    # Project dependencies and scripts
```
