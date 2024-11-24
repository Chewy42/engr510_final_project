#!/bin/bash

# Print colored output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}Running all tests across the stack...${NC}\n"

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

# Frontend Tests
cd frontend || exit 1

# Run unit tests
run_test_suite "Frontend Unit Tests" "npm run test:unit" || exit 1

# Start the frontend server in the background
echo "Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Wait for the server to start
echo "Waiting for frontend server to start..."
sleep 10

# Run E2E tests
run_test_suite "Frontend E2E Tests" "npm run test:e2e"
E2E_RESULT=$?

# Kill the frontend server
kill $FRONTEND_PID 2>/dev/null
wait $FRONTEND_PID 2>/dev/null

# Exit if E2E tests failed
[ $E2E_RESULT -ne 0 ] && exit 1

# Backend Tests
cd ../backend || exit 1

# Run backend tests
run_test_suite "Backend Tests" "npm test" || exit 1

echo -e "${GREEN}${BOLD}All tests completed successfully!${NC}"
exit 0
