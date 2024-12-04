@echo on
setlocal EnableDelayedExpansion

:: Colors for Windows console
set "GREEN=[32m"
set "RED=[31m"
set "YELLOW=[33m"
set "NC=[0m"
set "BOLD=[1m"

:: Store the root directory
set "ROOT_DIR=%CD%"
set "FAILED_TESTS="

echo %BOLD%Running all tests across the stack...%NC%
echo.

:: Check for required environment files
if not exist "%ROOT_DIR%\backend\.env" (
    echo %RED%Error: backend/.env file is missing%NC%
    exit /b 1
)
if not exist "%ROOT_DIR%\frontend\.env" (
    echo %RED%Error: frontend/.env file is missing%NC%
    exit /b 1
)

:: Backend Tests
cd /d "%ROOT_DIR%\backend" || exit /b 1
echo %BOLD%Running Backend Tests...%NC%

:: Install backend dependencies if needed
echo Installing backend dependencies...
call npm ci
if !errorlevel! neq 0 (
    echo %RED%Failed to install backend dependencies%NC%
    exit /b 1
)

:: Run backend unit tests
echo %BOLD%Running backend unit tests...%NC%
call npm run test
if !errorlevel! neq 0 (
    set "FAILED_TESTS=!FAILED_TESTS! backend-unit"
    echo %RED%Backend unit tests failed%NC%
)

:: Run backend integration tests
echo %BOLD%Running backend integration tests...%NC%
call npm run test:integration -- --passWithNoTests
if !errorlevel! neq 0 (
    set "FAILED_TESTS=!FAILED_TESTS! backend-integration"
    echo %RED%Backend integration tests failed%NC%
)

:: Frontend Tests
cd /d "%ROOT_DIR%\frontend" || exit /b 1
echo %BOLD%Running Frontend Tests...%NC%

:: Install frontend dependencies if needed
echo Installing frontend dependencies...
call npm ci
if !errorlevel! neq 0 (
    echo %RED%Failed to install frontend dependencies%NC%
    exit /b 1
)

:: Run frontend unit tests
echo %BOLD%Running frontend unit tests...%NC%
call npm run test -- --watchAll=false --passWithNoTests
if !errorlevel! neq 0 (
    set "FAILED_TESTS=!FAILED_TESTS! frontend-unit"
    echo %RED%Frontend unit tests failed%NC%
)

:: Run Cypress E2E tests
echo %BOLD%Running Cypress E2E tests...%NC%
:: First verify Cypress is installed
call npx cypress verify
if !errorlevel! neq 0 (
    echo %YELLOW%Installing Cypress...%NC%
    call npx cypress install
)

:: Run Cypress tests headlessly
call npx cypress run --headless --browser chrome
if !errorlevel! neq 0 (
    set "FAILED_TESTS=!FAILED_TESTS! frontend-e2e"
    echo %RED%Frontend E2E tests failed%NC%
)

:: Generate test summary
echo.
echo %BOLD%Test Summary:%NC%
if defined FAILED_TESTS (
    echo %RED%The following test suites failed:%NC%
    echo !FAILED_TESTS!
    exit /b 1
) else (
    echo %GREEN%All test suites passed successfully!%NC%
    exit /b 0
)
