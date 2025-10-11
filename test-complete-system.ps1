# Complete System Test for CodePlatform
Write-Host "Testing CodePlatform System..." -ForegroundColor Green

# Test Backend APIs
Write-Host "`nTesting Backend APIs..." -ForegroundColor Yellow

# Test 1: Get all problems
Write-Host "1. Testing GET /api/problems" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/problems" -Method GET
    Write-Host "✓ Problems API working - Found $($response.Count) problems" -ForegroundColor Green
} catch {
    Write-Host "✗ Problems API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get languages
Write-Host "2. Testing GET /api/languages" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/languages" -Method GET
    Write-Host "✓ Languages API working - Found $($response.Count) languages" -ForegroundColor Green
} catch {
    Write-Host "✗ Languages API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test user registration
Write-Host "3. Testing POST /api/users/register" -ForegroundColor Cyan
$testUser = @{
    username = "testuser$(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/users/register" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "✓ User registration working - User ID: $($response.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend
Write-Host "`nTesting Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nSystem Test Complete!" -ForegroundColor Green
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "- H2 Database Console: http://localhost:8080/h2-console" -ForegroundColor White