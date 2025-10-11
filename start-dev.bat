@echo off
echo Starting CodePlatform Development Environment...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker first.
    exit /b 1
)

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start all services
echo Building and starting services...
docker-compose up --build

echo Development environment started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8080
echo PgAdmin: http://localhost:5050