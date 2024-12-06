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
    local name=$2
    local retries=30
    local wait_time=2

    echo -e "${BLUE}Waiting for $name to be available...${NC}"
    
    while [ $retries -gt 0 ]; do
        if is_port_in_use $port; then
            echo -e "${GREEN}$name is now available!${NC}"
            return 0
        fi
        retries=$((retries-1))
        sleep $wait_time
    done

    echo -e "${RED}Timeout waiting for $name${NC}"
    return 1
}

# Function to handle script termination
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${BLUE}Stopping frontend server...${NC}"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${BLUE}Stopping backend server...${NC}"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # Kill any remaining processes on the ports
    kill_port_process 3000
    kill_port_process 5000
    
    echo -e "${GREEN}Cleanup complete${NC}"
    exit 0
}

# Set up trap to catch termination signal
trap cleanup SIGINT SIGTERM

# Function to start the frontend
start_frontend() {
    echo -e "${BLUE}Starting frontend server...${NC}"
    
    # Kill any process running on frontend port
    kill_port_process 3000

    # Navigate to frontend directory
    cd frontend

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing frontend dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install frontend dependencies${NC}"
            exit 1
        fi
    fi

    # Start frontend server
    npm start &
    FRONTEND_PID=$!

    # Wait for frontend to be available
    wait_for_service 3000 "Frontend"

    cd ..
}

# Function to start the backend
start_backend() {
    echo -e "${BLUE}Starting backend server...${NC}"
    
    # Kill any process running on backend port
    kill_port_process 5000

    # Navigate to backend directory
    cd backend

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing backend dependencies...${NC}"
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install backend dependencies${NC}"
            exit 1
        fi
    fi

    # Start backend server in development mode
    npm run dev &
    BACKEND_PID=$!

    # Wait for backend to be available
    wait_for_service 5000 "Backend"

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
