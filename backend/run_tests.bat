@echo off
echo Running backend tests...

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

:: Run tests
call npm test

echo Test run complete!
