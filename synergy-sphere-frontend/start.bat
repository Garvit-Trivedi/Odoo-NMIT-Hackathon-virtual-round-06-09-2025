@echo off
echo Starting SynergySphere Frontend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found
    echo Please run this script from the synergy-sphere-frontend directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists, if not copy from .env.example
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy ".env.example" ".env"
    ) else (
        echo Warning: No .env file found. Creating default configuration...
        echo # API Configuration > .env
        echo VITE_API_URL=https://synergy-z4ny.onrender.com/api >> .env
        echo. >> .env
        echo # Socket.IO Configuration >> .env
        echo VITE_SOCKET_URL=https://synergy-z4ny.onrender.com >> .env
        echo. >> .env
        echo # App Configuration >> .env
        echo VITE_APP_NAME=SynergySphere >> .env
        echo VITE_APP_VERSION=1.0.0 >> .env
    )
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo Backend configured for: https://synergy-z4ny.onrender.com
echo.

npm run dev
