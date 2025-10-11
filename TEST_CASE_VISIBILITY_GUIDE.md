# Test Case Visibility Guide

## Overview
The CodePlatform implements a comprehensive test case system that balances transparency with security by showing sample test cases while hiding sensitive test cases.

## Test Case Types

### 1. Sample Test Cases (Always Visible)
- **Purpose**: Help users understand the problem and debug their solutions
- **Visibility**: Full input, expected output, and actual output are always shown
- **Identifier**: `isSample: true` in the API response
- **Display**: Marked with 👁️ icon and "SAMPLE" badge

### 2. Hidden Test Cases (Results Only)
- **Purpose**: Comprehensive testing without revealing edge cases
- **Visibility**: Only pass/fail status is shown, input/output details are hidden
- **Identifier**: `isSample: false` in the API response  
- **Display**: Marked with 🔒 icon and "HIDDEN" badge

## API Endpoints

### Run Sample Tests Only
```
POST /api/submissions/run-sample
```
- Executes only sample test cases
- Shows detailed results for debugging
- Faster execution for quick feedback

### Submit Code (Full Evaluation)
```
POST /api/submissions/submit
```
- Executes both sample and hidden test cases
- Sample test cases show full details
- Hidden test cases show only pass/fail status

## Response Structure

```json
{
  "status": "Accepted|Wrong Answer|Runtime Error",
  "totalTestCases": 5,
  "passedTestCases": 4,
  "successRate": 80.0,
  "testCaseResults": [
    {
      "testCaseNumber": 1,
      "isSample": true,
      "passed": true,
      "input": "visible input",
      "expectedOutput": "visible expected",
      "actualOutput": "visible actual",
      "executionTime": 50,
      "memoryUsed": 25,
      "status": "Accepted"
    },
    {
      "testCaseNumber": 2,
      "isSample": false,
      "passed": false,
      "input": "Hidden",
      "expectedOutput": "Hidden", 
      "actualOutput": "Hidden",
      "executionTime": 75,
      "memoryUsed": 30,
      "status": "Wrong Answer"
    }
  ]
}
```

## Frontend Display

### Sample Test Cases
```
👁️ Sample Test Case 1 [VISIBLE] ✅ PASSED
   📥 Input: [1,2,3,4], target = 6
   📤 Expected: [1, 2]
   🖥️ Your Output: [1, 2]
   ⏱️ 50ms 💾 25MB
```

### Hidden Test Cases
```
🔒 Hidden Test Case 3 [HIDDEN] ❌ FAILED
   📥 Input: Hidden
   📤 Expected: Hidden
   🖥️ Your Output: Hidden
   ⏱️ 75ms 💾 30MB
```

## Testing the Feature

### Using the Web Interface
1. Open `http://localhost:3000/test-submission-detailed.html`
2. Write your code
3. Click "🏃 Run Sample Tests" to see only sample test cases
4. Click "📤 Submit Code" to see both sample and hidden test cases

### Using PowerShell Script
```powershell
.\test-sample-visibility.ps1
```

### Using curl
```bash
# Run sample tests only
curl -X POST http://localhost:8080/api/submissions/run-sample \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "problemId=1&languageId=1&code=your_code_here"

# Submit full solution
curl -X POST http://localhost:8080/api/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{"problemId":1,"languageId":1,"userId":1,"code":"your_code_here"}'
```

## Benefits

### For Students/Users
- **Transparency**: Can see exactly what sample test cases expect
- **Debugging**: Full visibility into sample test case failures
- **Learning**: Understand problem requirements through examples

### For Platform Security
- **Edge Case Protection**: Hidden test cases prevent gaming the system
- **Comprehensive Testing**: Full test coverage without revealing all cases
- **Balanced Feedback**: Enough information to debug, not enough to cheat

## Implementation Details

### Backend (Java/Spring Boot)
- `CodeExecutionService.executeWithDetailedResults()` handles both test case types
- `TestCaseResult.isSample` flag controls visibility
- Sample test cases parsed from `Problem.sampleTestCases`
- Hidden test cases parsed from `Problem.testCases`

### Frontend (HTML/JavaScript)
- `displaySampleTestResults()` function handles rendering
- CSS classes differentiate sample vs hidden test cases
- Icons and badges provide visual indicators

## Best Practices

### For Problem Creators
1. Include 2-3 representative sample test cases
2. Cover basic functionality and edge cases in samples
3. Use hidden test cases for comprehensive validation
4. Ensure sample test cases are educational

### For Users
1. Use "Run Sample Tests" for quick debugging
2. Ensure sample test cases pass before full submission
3. Don't rely solely on sample test cases for validation
4. Consider edge cases not covered in samples

## Troubleshooting

### Sample Test Cases Not Showing
- Check `Problem.sampleTestCases` is properly formatted JSON
- Verify `isSample: true` is set in test case results
- Ensure frontend is using the correct API endpoint

### Hidden Test Cases Showing Details
- Check `isSample: false` is set correctly
- Verify frontend respects the `isSample` flag
- Ensure proper data masking in the service layer

### Performance Issues
- Use "Run Sample Tests" for quick feedback
- Sample test execution is faster than full submission
- Consider caching results for repeated sample test runs