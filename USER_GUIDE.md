# CodePlatform User Guide

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Web browser
- Python 3.x (for the simple frontend server)

### Quick Start
1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **Start the frontend server:**
   ```bash
   cd frontend/public
   python -m http.server 3000
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000/simple-index.html
   - Backend API: http://localhost:8080
   - Database Admin: http://localhost:5050

## 🎯 How to Use the Platform

### 1. **Access the Web Interface**
Open your browser and go to: **http://localhost:3000/simple-index.html**

You'll see:
- System status indicators
- API testing buttons
- Login form
- Available endpoints list

### 2. **Test the APIs**
Click the interactive buttons to test different features:

#### **Test Problems API**
- Click "Test Problems API" to see all available coding problems
- Returns: List of problems with ID, title, difficulty, time/memory limits

#### **Test Languages API**
- Click "Test Languages API" to see supported programming languages
- Returns: Java, Python, C++ with their file extensions

#### **Test User Registration**
- Click "Test User Registration" to create a random test user
- Automatically generates username, email, and password

### 3. **User Authentication**
Use the login form with these default accounts:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Test User Account:**
- Username: `testuser`
- Password: `admin123`

### 4. **API Endpoints You Can Use**

#### **Public Endpoints (No Authentication Required):**
```bash
# Get all problems
GET http://localhost:8080/api/problems

# Get all programming languages
GET http://localhost:8080/api/languages

# Register a new user
POST http://localhost:8080/api/users/register
Content-Type: application/json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}

# User login
POST http://localhost:8080/api/users/login
Content-Type: application/json
{
  "username": "admin",
  "password": "admin123"
}

# Get problem details
GET http://localhost:8080/api/problems/1

# Submit code solution
POST http://localhost:8080/api/submissions
Content-Type: application/json
{
  "problemId": 1,
  "languageId": 1,
  "code": "your code here",
  "userId": 1
}
```

#### **Admin Endpoints:**
```bash
# Get all users (Admin only)
GET http://localhost:8080/api/admin/users

# Create new problem (Admin only)
POST http://localhost:8080/api/admin/problems
```

### 5. **Database Access**
Access the PostgreSQL database through pgAdmin:
- URL: http://localhost:5050
- Email: `admin@codeplatform.com`
- Password: `password`

**Database Connection Details:**
- Host: `postgres` (or `localhost` from outside Docker)
- Port: `5432`
- Database: `codeplatform`
- Username: `admin`
- Password: `password`

## 🛠️ Development Usage

### **For API Development:**
1. Use tools like Postman, curl, or the web interface to test APIs
2. Check the backend logs: `docker logs finalyearproject-backend-1`
3. Monitor database changes through pgAdmin

### **For Frontend Development:**
1. The React frontend is in `/frontend` directory
2. Simple HTML interface is in `/frontend/public/simple-index.html`
3. Modify the simple interface for quick testing

### **Adding New Problems:**
1. Use the admin API endpoints
2. Or directly insert into the database via pgAdmin
3. Follow the existing problem structure in the database

## 📊 Sample Data Available

### **Users:**
- `admin` (admin role) - password: `admin123`
- `testuser` (user role) - password: `admin123`

### **Programming Languages:**
- Java (.java)
- Python (.py)
- C++ (.cpp)

### **Sample Problem:**
- **Two Sum** (Easy difficulty)
- Time limit: 2000ms
- Memory limit: 256MB
- Includes test cases and boilerplate code

## 🔧 Troubleshooting

### **If Backend Won't Start:**
```bash
# Check logs
docker logs finalyearproject-backend-1

# Restart services
docker-compose restart backend
```

### **If Database Connection Fails:**
```bash
# Check PostgreSQL status
docker logs codeplatform-db

# Restart database
docker-compose restart postgres
```

### **If Frontend Won't Load:**
```bash
# Make sure Python server is running
cd frontend/public
python -m http.server 3000
```

## 🎮 Example Usage Scenarios

### **Scenario 1: Student Solving Problems**
1. Access http://localhost:3000/simple-index.html
2. Click "Test Problems API" to see available problems
3. Use the API to get problem details
4. Submit solution using the submissions endpoint

### **Scenario 2: Admin Managing Platform**
1. Login as admin
2. Use admin endpoints to manage users
3. Add new problems via API
4. Monitor submissions through database

### **Scenario 3: Developer Testing APIs**
1. Use the web interface for quick API testing
2. Use curl or Postman for detailed testing
3. Check database state via pgAdmin
4. Monitor logs for debugging

## 🚀 Next Steps

### **To Build a Full Frontend:**
1. Fix the React compatibility issues
2. Use the existing TypeScript components in `/frontend/src`
3. Connect to the working backend APIs

### **To Add More Features:**
1. Implement code execution (CodeExecutionService is ready)
2. Add contest functionality
3. Implement real-time leaderboards
4. Add more programming languages

### **To Deploy in Production:**
1. Change database to persistent storage
2. Add proper authentication/authorization
3. Configure HTTPS
4. Set up proper logging and monitoring

## 📝 API Documentation

The platform provides a RESTful API with the following main resources:
- `/api/problems` - Problem management
- `/api/users` - User management
- `/api/languages` - Programming language support
- `/api/submissions` - Code submission handling
- `/api/admin` - Administrative functions
- `/api/contests` - Contest management

Each endpoint supports standard HTTP methods (GET, POST, PUT, DELETE) where appropriate.

---

**Happy Coding! 🎉**

For more details, check the source code in the respective controller files.