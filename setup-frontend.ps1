# Frontend Setup Script for CodePlatform

Write-Host "Setting up CodePlatform Frontend..." -ForegroundColor Green

# Navigate to frontend directory
Set-Location frontend

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if installation was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    
    Write-Host "`nSetup complete! You can now:" -ForegroundColor Green
    Write-Host "1. Start the backend: docker-compose up -d" -ForegroundColor Cyan
    Write-Host "2. Start the frontend: npm run dev" -ForegroundColor Cyan
    Write-Host "3. Access the application at: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "`nDefault login credentials:" -ForegroundColor Yellow
    Write-Host "Username: admin" -ForegroundColor White
    Write-Host "Password: admin123" -ForegroundColor White
} else {
    Write-Host "Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
}

# Return to root directory
Set-Location ..