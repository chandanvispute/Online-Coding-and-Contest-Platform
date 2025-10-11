# CodePlatform Quick Reference

## 🚀 Start the Application
```bash
# Start all services
docker-compose up -d

# Start frontend server
cd frontend/public && python -m http.server 3000
```

## 🌐 Access URLs
- **Web Interface**: http://localhost:3000/simple-index.html
- **Backend API**: http://localhost:8080
- **Database Admin**: http://localhost:5050

## 👤 Default Login Credentials
```
Admin:
- Username: admin
- Password: admin123

User:
- Username: testuser  
- Password: admin123
```

## 📡 Essential API Calls

### Get All Problems
```bash
curl http://localhost:8080/api/problems
```

### Get All Languages
```bash
curl http://localhost:8080/api/languages
```

### Register New User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"password123"}'
```

### User Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Problem Details
```bash
curl http://localhost:8080/api/problems/1
```

### Submit Code Solution
```bash
curl -X POST http://localhost:8080/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "languageId": 1,
    "code": "public class Solution { public int[] twoSum(int[] nums, int target) { return new int[]{0,1}; } }",
    "userId": 1
  }'
```

## 🗄️ Database Access
```
pgAdmin URL: http://localhost:5050
Email: admin@codeplatform.com
Password: password

Database Connection:
Host: postgres (or localhost)
Port: 5432
Database: codeplatform
Username: admin
Password: password
```

## 🔧 Common Commands
```bash
# View backend logs
docker logs finalyearproject-backend-1

# View database logs  
docker logs codeplatform-db

# Restart backend
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## 🎯 Testing Workflow
1. Open http://localhost:3000/simple-index.html
2. Click "Test Problems API" → Should show "Two Sum" problem
3. Click "Test Languages API" → Should show Java, Python, C++
4. Click "Test User Registration" → Creates random user
5. Enter admin/admin123 and click "Test Login" → Should succeed

## 📊 Sample Data Structure

### Problem Response
```json
{
  "id": 1,
  "title": "Two Sum",
  "difficulty": "Easy",
  "timeLimit": 2000,
  "memoryLimit": 256
}
```

### Language Response
```json
{
  "id": 1,
  "name": "Java",
  "extension": "java"
}
```

### User Registration Request
```json
{
  "username": "newuser",
  "email": "user@example.com", 
  "password": "password123"
}
```

## 🚨 Troubleshooting
- **404 errors**: Check if backend is running on port 8080
- **Database errors**: Ensure PostgreSQL container is healthy
- **CORS errors**: Backend has CORS enabled for all origins
- **Frontend not loading**: Make sure Python server is running on port 3000