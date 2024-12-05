#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Store PIDs
FRONTEND_PID=""
BACKEND_PID=""

# Function to kill process on a specific port
kill_port_process() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
    fi
}

# Function to check if a port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Function to wait for a service to be available
wait_for_service() {
    local port=$1
    local service=$2
    local timeout=30
    local count=0

    echo -e "${BLUE}Waiting for $service to start...${NC}"
    while ! nc -z localhost $port; do
        sleep 1
        count=$((count + 1))
        if [ $count -eq $timeout ]; then
            echo -e "${RED}Timeout waiting for $service to start${NC}"
            return 1
        fi
    done
    echo -e "${GREEN}$service is up and running!${NC}"
    return 0
}

# Function to handle script termination
cleanup() {
    echo -e "\n${BLUE}Shutting down servers...${NC}"
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${YELLOW}Stopping frontend server...${NC}"
        kill -TERM $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${YELLOW}Stopping backend server...${NC}"
        kill -TERM $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}All servers stopped successfully${NC}"
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

# Function to start the frontend
start_frontend() {
    echo -e "${BLUE}Starting frontend server...${NC}"
    
    # Kill any existing process on port 3000
    kill_port_process 3000
    
    cd frontend || exit 1
    
    # Check for and install dependencies
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install frontend dependencies${NC}"
            exit 1
        fi
    fi
    
    # Run tests
    echo -e "${YELLOW}Running frontend tests...${NC}"
    npm test
    
    # Start frontend server
    npm start &
    FRONTEND_PID=$!
    
    # Wait for frontend to be available
    wait_for_service 3000 "Frontend server" || exit 1
    
    cd ..
}

# Function to start the backend
start_backend() {
    echo -e "${BLUE}Starting backend server...${NC}"
    
    # Kill any existing process on port 5000
    kill_port_process 5000
    
    cd backend || exit 1
    
    # Check for and install dependencies
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install backend dependencies${NC}"
            exit 1
        fi
    fi
    
    # Create server.js if it doesn't exist
    if [ ! -f "src/server.js" ]; then
        echo -e "${YELLOW}Creating server.js...${NC}"
        mkdir -p src
        cat > src/server.js << 'EOL'
const app = require('./app');
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
EOL
    fi
    
    # Run tests
    echo -e "${YELLOW}Running backend tests...${NC}"
    npm test
    
    # Start backend server
    npm start &
    BACKEND_PID=$!
    
    # Wait for backend to be available
    wait_for_service 5000 "Backend server" || exit 1
    
    cd ..
}

# Main execution
echo -e "${BLUE}Starting development environment...${NC}"

# Start backend first
start_backend

# Then start frontend
start_frontend

echo -e "${GREEN}Development environment is ready!${NC}"
echo -e "${BLUE}Frontend server: ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}Backend server:  ${GREEN}http://localhost:5000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Wait for user interrupt
wait
