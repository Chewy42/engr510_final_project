@echo off
setlocal EnableDelayedExpansion

:: Colors for Windows console
set "GREEN=[32m"
set "RED=[31m"
set "NC=[0m"
set "BOLD=[1m"

echo %BOLD%Running all tests across the stack...%NC%
echo.

:: Function to run tests (implemented through labels)
goto :main

:run_test_suite
    set "test_name=%~1"
    set "command=%~2"
    
    echo %BOLD%=== %test_name% ===%NC%
    call %command%
    if !errorlevel! equ 0 (
        echo %GREEN%✓ %test_name% passed%NC%
        echo.
        exit /b 0
    ) else (
        echo %RED%✗ %test_name% failed%NC%
        echo.
        exit /b 1
    )
goto :eof

:main
:: Frontend Tests
cd frontend || exit /b 1

:: Install dependencies if needed
echo Installing frontend dependencies...
call npm install

:: Run unit tests with full output
echo Running frontend unit tests...
call :run_test_suite "Frontend Unit Tests" "npm run test:unit"
if !errorlevel! neq 0 exit /b 1

:: Start the frontend server in the background
echo Starting frontend server...
start /B npm start
set "FRONTEND_PID=!errorlevel!"

:: Wait for the server to start
echo Waiting for frontend server to start...
timeout /t 10 /nobreak > nul

:: Run E2E tests with full output
echo Running E2E tests...
call :run_test_suite "Frontend E2E Tests" "npm run test:e2e"
set "E2E_RESULT=!errorlevel!"

:: Kill the frontend server
taskkill /F /IM "node.exe" /T > nul 2>&1

:: Exit if E2E tests failed
if !E2E_RESULT! neq 0 exit /b 1

:: Return to root directory
cd ..

:: Backend Tests
cd backend || exit /b 1

:: Install dependencies if needed
echo Installing backend dependencies...
call pip install -r requirements.txt

:: Run Python tests with full output
echo Running backend tests...
call :run_test_suite "Backend Unit Tests" "python -m pytest tests/ -v"
if !errorlevel! neq 0 exit /b 1

:: Return to root directory
cd ..

:: Integration Tests (if any)
echo %BOLD%All test suites completed successfully!%NC%
exit /b 0
