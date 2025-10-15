# Frontend API Integration Guide

## Overview

The frontend has been fully integrated with the backend APIs. All authentication, problem management, and code submission features are now connected to your Spring Boot backend.

## What's Been Integrated

### ✅ Authentication System
- **Login**: Users can log in with username/password
- **Registration**: New users can create accounts
- **Session Management**: User data is stored in localStorage and context
- **Protected Routes**: All pages except login/signup require authentication

### ✅ Problem Management
- **Problem List**: Fetches all problems from `/api/problems`
- **Problem Details**: Shows full problem description, test cases, and constraints
- **Difficulty Filtering**: Filter problems by Easy/Medium/Hard
- **Search**: Search problems by title

### ✅ Code Editor & Execution
- **Multi-language Support**: Fetches supported languages from `/api/languages`
- **Code Templates**: Loads boilerplate code for each language
- **Sample Test Cases**: Run code against sample test cases
- **Full Submission**: Submit solutions for complete evaluation

### ✅ Results & Feedback
- **Test Results**: Shows detailed results for sample test case runs
- **Submission Results**: Complete submission feedback with pass/fail status
- **Error Handling**: Displays compilation errors and runtime errors
- **Performance Metrics**: Shows execution time and memory usage

### ✅ User Dashboard
- **Problem Statistics**: Shows total problems by difficulty
- **User Profile**: Displays current user information
- **Progress Tracking**: Visual progress bars for each difficulty level

## API Endpoints Used

### User Authentication
```
POST /api/users/register - User registration
POST /api/users/login - User login
GET /api/users/{id} - Get user by ID
GET /api/users/username/{username} - Get user by username
```

### Problem Management
```
GET /api/problems - Get all problems
GET /api/problems/{id} - Get problem details
GET /api/problems/difficulty/{difficulty} - Filter by difficulty
GET /api/problems/{problemId}/boilerplate/{languageId} - Get code template
```

### Language Support
```
GET /api/languages - Get all supported languages
```

### Code Submission
```
POST /api/submissions/submit - Submit solution
POST /api/submissions/run-sample - Run sample test cases
GET /api/submissions/user/{userId}/problem/{problemId} - Get user submissions
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Backend
```bash
docker-compose up -d
```

### 3. Start the Frontend
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## Default Login Credentials

```
Admin User:
Username: admin
Password: admin123

Test User:
Username: testuser
Password: admin123
```

## Key Features

### 🔐 Secure Authentication
- JWT-like session management
- Protected routes with automatic redirects
- User context throughout the application

### 💻 Advanced Code Editor
- Syntax highlighting for multiple languages
- Auto-loading of language-specific templates
- Real-time code editing with proper formatting

### 🧪 Comprehensive Testing
- Sample test case execution
- Full test suite submission
- Detailed result analysis with pass/fail status

### 📊 Rich User Interface
- Modern dark theme design
- Responsive layout for all screen sizes
- Interactive problem filtering and search
- Real-time feedback and loading states

### 🚀 Performance Optimized
- Efficient API calls with axios
- Error handling and retry mechanisms
- Loading states for better user experience

## File Structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx - Navigation with user context
│   ├── ProtectedRoute.jsx - Route protection
│   ├── TestResults.jsx - Sample test results display
│   └── SubmissionResult.jsx - Full submission results
├── context/
│   └── AuthContext.jsx - User authentication context
├── pages/
│   ├── Login.jsx - User login with API integration
│   ├── Signup.jsx - User registration with API integration
│   ├── ProblemSet.jsx - Problem list with API data
│   ├── ProblemDetail.jsx - Problem solving interface
│   └── Dashboard.jsx - User dashboard with statistics
├── services/
│   └── api.js - All API integration logic
└── App.jsx - Main app with routing and context
```

## API Response Handling

### Problem List Response
```json
[
  {
    "id": 1,
    "title": "Two Sum",
    "difficulty": "Easy",
    "acceptanceRate": 49.2,
    "topics": [
      {"name": "Array"},
      {"name": "Hash Table"}
    ]
  }
]
```

### Problem Detail Response
```json
{
  "id": 1,
  "title": "Two Sum",
  "description": "HTML formatted description",
  "difficulty": "Easy",
  "timeLimit": 2000,
  "memoryLimit": 256,
  "sampleTestCases": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "expectedOutput": "[0,1]"
    }
  ],
  "topics": [
    {"name": "Array"},
    {"name": "Hash Table"}
  ]
}
```

### Submission Response
```json
{
  "submissionId": 123,
  "status": "Accepted",
  "executionTime": 150,
  "memoryUsed": 1024,
  "totalTestCases": 10,
  "passedTestCases": 10,
  "successRate": 100.0,
  "testCaseResults": [
    {
      "testCaseNumber": 1,
      "input": "test input",
      "expectedOutput": "expected",
      "actualOutput": "actual",
      "passed": true,
      "executionTime": 15,
      "isSample": true
    }
  ]
}
```

## Error Handling

The frontend handles various error scenarios:

- **Network Errors**: Connection issues with the backend
- **Authentication Errors**: Invalid credentials or expired sessions
- **Validation Errors**: Invalid input data
- **Compilation Errors**: Code compilation failures
- **Runtime Errors**: Code execution errors
- **API Errors**: Backend service errors

## Next Steps

### Immediate Testing
1. Start both backend and frontend
2. Register a new user or use default credentials
3. Browse problems and attempt to solve one
4. Test code execution and submission

### Future Enhancements
1. **Contest Integration**: Connect contest pages to backend APIs
2. **User Submissions History**: Show past submissions
3. **Leaderboards**: Display user rankings
4. **Real-time Updates**: WebSocket integration for live updates
5. **Advanced Editor**: Monaco Editor integration for better code editing

## Troubleshooting

### Common Issues

**Frontend won't start:**
```bash
cd frontend
npm install
npm run dev
```

**API calls failing:**
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API endpoints are accessible

**Authentication not working:**
- Check if user exists in database
- Verify password encoding matches backend
- Clear localStorage and try again

**Code submission errors:**
- Ensure all required fields are provided
- Check if language is supported
- Verify problem exists in database

## Support

The integration is complete and ready for testing. All major features are working:
- ✅ User authentication and registration
- ✅ Problem browsing and filtering
- ✅ Code editing with multiple languages
- ✅ Sample test case execution
- ✅ Full solution submission
- ✅ Detailed result feedback
- ✅ User dashboard with statistics

Start the application and begin testing the complete coding platform experience!