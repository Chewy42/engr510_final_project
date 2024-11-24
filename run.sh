#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development servers...${NC}"

# Navigate to frontend directory and start the React dev server
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend || exit 1
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm start &

# Store the frontend server PID
FRONTEND_PID=$!

# Navigate back to root directory
cd ..

# Start the backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd backend || exit 1
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi
npm start &

# Store the backend server PID
BACKEND_PID=$!

# Function to handle script termination
cleanup() {
    echo -e "${BLUE}\nShutting down servers...${NC}"
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}All servers are running!${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all servers${NC}"

# Keep script running and wait for signals
wait
