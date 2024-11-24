@echo off
echo Starting development servers...

:: Kill any existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do taskkill /F /PID %%a 2>NUL
timeout /t 2 /nobreak >NUL

:: Start frontend server
echo Starting frontend server...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing frontend dependencies
        exit /b 1
    )
)
start cmd /k "npm start"

:: Initialize and start backend server
cd ..
cd backend
echo Starting backend server...

:: Create data directory if it doesn't exist
if not exist "data" mkdir data

:: Reset database and create dummy account
echo Initializing database...
node src/scripts/resetDb.js
if errorlevel 1 (
    echo Error initializing database
    exit /b 1
)

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing backend dependencies
        exit /b 1
    )
)

:: Start the backend server with logging
start cmd /k "npm start"

cd ..
echo All servers are running!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo Press Ctrl+C in the server windows to stop them.
