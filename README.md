# CodePlatform - Online Coding Platform

A comprehensive online coding platform built with Spring Boot backend and React TypeScript frontend, featuring problem solving, contests, and administrative capabilities.

## Features

### For Users
- **Problem Solving**: Browse and solve coding problems across different difficulty levels
- **Multi-language Support**: Code in Java, Python, C++, and more
- **Real-time Code Execution**: Submit solutions and get instant feedback
- **Contest Participation**: Join coding contests and compete with other developers
- **Progress Tracking**: Monitor your coding progress and submission history
- **User Authentication**: Secure login and registration system

### For Administrators
- **Problem Management**: Create, edit, and delete coding problems
- **User Management**: Manage user accounts and admin privileges
- **Contest Management**: Create and manage coding contests
- **Dashboard Analytics**: View platform statistics and metrics
- **Test Case Management**: Define input/output test cases for problems

## Technology Stack

### Backend
- **Java 17** with Spring Boot 3.x
- **Spring Data JPA** for database operations
- **Spring Security** for authentication and authorization
- **H2 Database** for development (PostgreSQL for production)
- **Maven** for dependency management
- **Docker** for containerization

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Monaco Editor** for code editing
- **Docker** for containerization

## Project Structure

```
codeplatform/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/codeplatform/backend/
│   │       ├── config/      # Security and configuration
│   │       ├── controller/  # REST API controllers
│   │       ├── dto/         # Data transfer objects
│   │       ├── model/       # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── service/     # Business logic
│   │       └── util/        # Utility classes
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-test.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Admin/       # Admin panel components
│   │   │   ├── Auth/        # Authentication components
│   │   │   ├── Contests/    # Contest-related components
│   │   │   ├── Layout/      # Layout components
│   │   │   └── Problems/    # Problem-solving components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service functions
│   │   └── types/           # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker services configuration
├── test-apis.md            # API testing documentation
└── README.md
```

## Getting Started

### Prerequisites
- **Docker** and **Docker Compose**
- **Java 17** (for local development)
- **Node.js 18+** (for local development)
- **Maven** (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeplatform
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432
   - PgAdmin: http://localhost:5050

### Local Development Setup

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Backend will be available at**: http://localhost:8080

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Frontend will be available at**: http://localhost:3000

## API Documentation

### Authentication Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username

### Problem Endpoints
- `GET /api/problems` - Get all problems
- `GET /api/problems/{id}` - Get problem details
- `GET /api/problems/difficulty/{difficulty}` - Get problems by difficulty

### Submission Endpoints
- `POST /api/submissions/submit` - Submit code solution
- `GET /api/submissions/user/{userId}/problem/{problemId}` - Get user submissions
- `GET /api/submissions/leaderboard/problem/{problemId}/language/{languageId}` - Get leaderboard

### Contest Endpoints
- `GET /api/contests` - Get all contests
- `GET /api/contests/{id}` - Get contest details
- `GET /api/contests/active` - Get active contests
- `GET /api/contests/upcoming` - Get upcoming contests
- `POST /api/contests/{contestId}/register/{userId}` - Register for contest

### Admin Endpoints
- `POST /api/admin/problems` - Create problem
- `PUT /api/admin/problems/{id}` - Update problem
- `DELETE /api/admin/problems/{id}` - Delete problem
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/{userId}/make-admin` - Make user admin
- `GET /api/admin/stats` - Get dashboard statistics

For detailed API testing examples, see [test-apis.md](test-apis.md).

## Database Schema

### Core Entities
- **User**: User accounts and authentication
- **Problem**: Coding problems with test cases
- **Language**: Supported programming languages
- **Submission**: Code submissions and results
- **Contest**: Coding contests and participation
- **Topic**: Problem categorization

### Key Relationships
- Users can submit solutions to problems
- Problems can have multiple test cases and boilerplates
- Contests can contain multiple problems
- Users can participate in multiple contests

## Features in Detail

### Code Execution System
- Supports multiple programming languages (Java, Python, C++)
- Secure code execution with time and memory limits
- Real-time feedback with test case results
- Compilation error handling and runtime error detection
- **Sample Test Case Visibility**: Sample test cases remain visible after submission with full input/output details
- **Hidden Test Cases**: Additional test cases are executed but details are hidden for security

### Contest System
- Time-based contests with start and end times
- Real-time leaderboards
- Problem sets for contests
- Participant registration and management

### Admin Panel
- Comprehensive dashboard with statistics
- Problem creation with rich text editor
- User management with role assignment
- Contest creation and management

## Security Features
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure API endpoints with proper error handling

## Development Guidelines

### Backend Development
- Follow Spring Boot best practices
- Use proper exception handling
- Implement comprehensive logging
- Write unit tests for services
- Use DTOs for API responses

### Frontend Development
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Use Material-UI components consistently
- Maintain responsive design

## Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided test commands in [test-apis.md](test-apis.md) to test all API endpoints.

## Deployment

### Production Deployment
1. Update environment variables in docker-compose.yml
2. Configure PostgreSQL for production
3. Set up proper domain and SSL certificates
4. Use production builds for frontend

### Environment Variables
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `REACT_APP_API_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.