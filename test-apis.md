# Complete API Testing Guide

## Prerequisites
1. Start the application: `cd backend && ./mvnw spring-boot:run`
2. Application will be available at: http://localhost:8080

## 1. Health Check APIs
```bash
# Basic health check
curl -X GET http://localhost:8080/

# Health endpoint
curl -X GET http://localhost:8080/health
```

## 2. User Management APIs

### Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "admin123"
  }'
```

### Get User by ID
```bash
curl -X GET http://localhost:8080/api/users/1
```

### Get User by Username
```bash
curl -X GET http://localhost:8080/api/users/username/testuser
```

## 3. Language APIs

### Get All Languages
```bash
curl -X GET http://localhost:8080/api/languages
```

## 4. Problem APIs

### Get All Problems
```bash
curl -X GET http://localhost:8080/api/problems
```

### Get Specific Problem
```bash
curl -X GET http://localhost:8080/api/problems/1
```

### Get Problems by Difficulty
```bash
curl -X GET http://localhost:8080/api/problems/difficulty/Easy
curl -X GET http://localhost:8080/api/problems/difficulty/Medium
curl -X GET http://localhost:8080/api/problems/difficulty/Hard
```

## 5. Submission APIs

### Submit Java Code (Correct Solution)
```bash
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "languageId": 1,
    "userId": 2,
    "code": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        \n        int[] result = twoSum(nums, target);\n        System.out.println(result[0] + \" \" + result[1]);\n    }\n    \n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for(int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if(map.containsKey(complement)) {\n                return new int[]{map.get(complement), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{0, 1};\n    }\n}"
  }'
```

### Submit Python Code (Correct Solution)
```bash
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "languageId": 2,
    "userId": 2,
    "code": "def two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return [0, 1]\n\nif __name__ == \"__main__\":\n    n = int(input())\n    nums = list(map(int, input().split()))\n    target = int(input())\n    \n    result = two_sum(nums, target)\n    print(result[0], result[1])"
  }'
```

### Submit Wrong Answer (for testing)
```bash
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": 1,
    "languageId": 1,
    "userId": 2,
    "code": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int target = sc.nextInt();\n        \n        System.out.println(\"0 0\");\n    }\n}"
  }'
```

### Get User Submissions
```bash
curl -X GET http://localhost:8080/api/submissions/user/2/problem/1
```

### Get Leaderboard
```bash
curl -X GET http://localhost:8080/api/submissions/leaderboard/problem/1/language/1
curl -X GET http://localhost:8080/api/submissions/leaderboard/problem/1/language/2
```

## 6. Contest APIs

### Create Contest (Admin)
```bash
curl -X POST http://localhost:8080/api/contests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Contest 1",
    "startTime": "2025-08-30T10:00:00",
    "endTime": "2025-08-30T12:00:00",
    "createdBy": 1,
    "problemIds": [1]
  }'
```

### Get All Contests
```bash
curl -X GET http://localhost:8080/api/contests
```

### Get Active Contests
```bash
curl -X GET http://localhost:8080/api/contests/active
```

### Get Upcoming Contests
```bash
curl -X GET http://localhost:8080/api/contests/upcoming
```

### Get Contest by ID
```bash
curl -X GET http://localhost:8080/api/contests/1
```

### Register for Contest
```bash
curl -X POST http://localhost:8080/api/contests/1/register/2
```

### Get Contest Leaderboard
```bash
curl -X GET http://localhost:8080/api/contests/1/leaderboard
```

## 7. Admin APIs

### Create New Problem (Admin)
```bash
curl -X POST http://localhost:8080/api/admin/problems \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Add Two Numbers",
    "description": "Given two integers a and b, return their sum.",
    "constraints": "1 <= a, b <= 1000",
    "difficulty": "Easy",
    "timeLimit": 1000,
    "memoryLimit": 128,
    "testCases": [
      {"input": "5\n3", "description": "a=5, b=3"},
      {"input": "10\n20", "description": "a=10, b=20"}
    ],
    "expectedOutputs": ["8", "30"],
    "createdBy": 1,
    "boilerplates": {
      "1": "import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}",
      "2": "a = int(input())\nb = int(input())\nprint(a + b)"
    }
  }'
```

### Update Problem (Admin)
```bash
curl -X PUT http://localhost:8080/api/admin/problems/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum (Updated)",
    "description": "Updated description...",
    "constraints": "Updated constraints...",
    "difficulty": "Medium",
    "timeLimit": 3000,
    "memoryLimit": 512,
    "testCases": [
      {"input": "4\n2 7 11 15\n9", "description": "nums = [2,7,11,15], target = 9"}
    ],
    "expectedOutputs": ["0 1"],
    "boilerplates": {
      "1": "// Updated Java boilerplate",
      "2": "# Updated Python boilerplate"
    }
  }'
```

### Delete Problem (Admin)
```bash
curl -X DELETE http://localhost:8080/api/admin/problems/2
```

## Testing Workflow

1. **Start Application**: `./mvnw spring-boot:run`
2. **Test Health**: Run health check commands
3. **Test User Management**: Register and login users
4. **Test Problems**: Get problems and problem details
5. **Test Code Submission**: Submit correct and incorrect solutions
6. **Test Contests**: Create contests and register users
7. **Test Admin Features**: Create/update/delete problems

## Expected Responses

### Successful Submission Response:
```json
{
  "submissionId": 1,
  "status": "Accepted",
  "output": "All test cases passed",
  "error": "",
  "executionTime": 150,
  "memoryUsed": 0,
  "testCaseFailed": ""
}
```

### Wrong Answer Response:
```json
{
  "submissionId": 2,
  "status": "Wrong Answer",
  "output": "0 0",
  "error": "Expected: 0 1",
  "executionTime": 120,
  "memoryUsed": 0,
  "testCaseFailed": "Test case 1"
}
```

## Notes
- Default admin credentials: username=`admin`, password=`admin123`
- Default test user credentials: username=`testuser`, password=`admin123`
- H2 Console available at: http://localhost:8080/h2-console
- Database URL: `jdbc:h2:mem:testdb`, Username: `sa`, Password: (empty)