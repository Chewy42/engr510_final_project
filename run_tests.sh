#!/bin/bash

# Print colored output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Store the root directory
ROOT_DIR=$(pwd)

# Cleanup function
cleanup() {
    echo "Cleaning up processes..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
    fi
    cd "$ROOT_DIR"
}

# Set up trap for cleanup
trap cleanup EXIT

# Function to run tests with proper error handling
run_test_suite() {
    local test_name=$1
    local command=$2
    
    echo -e "${BOLD}=== $test_name ===${NC}"
    if eval $command; then
        echo -e "${GREEN}✓ $test_name passed${NC}\n"
        return 0
    else
        echo -e "${RED}✗ $test_name failed${NC}\n"
        return 1
    fi
}

echo -e "${BOLD}Running all tests across the stack...${NC}\n"

# Backend Tests
cd backend || exit 1
echo -e "${BOLD}Running Backend Tests...${NC}"

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Run backend unit tests with coverage
run_test_suite "Backend Unit Tests" "npm run test:coverage" || exit 1

# Run backend integration tests
run_test_suite "Backend Integration Tests" "npm run test:integration" || exit 1

# Frontend Tests
cd "$ROOT_DIR/frontend" || exit 1
echo -e "${BOLD}Running Frontend Tests...${NC}"

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Run unit tests with coverage
run_test_suite "Frontend Unit Tests" "npm run test:coverage" || exit 1

# Start the frontend server in the background for E2E tests
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for the frontend server to start
echo "Waiting for frontend server to start..."
sleep 10

# Run E2E tests
run_test_suite "Frontend E2E Tests" "npm run test:e2e"
E2E_RESULT=$?

# Return to root directory
cd "$ROOT_DIR"

# Exit with the E2E test result
exit $E2E_RESULT
