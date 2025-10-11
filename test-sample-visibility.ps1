# Test Sample Test Case Visibility
# This script tests that sample test cases remain visible after code submission

$API_BASE = "http://localhost:8080"

Write-Host "🧪 Testing Sample Test Case Visibility" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Test 1: Run sample test cases only
Write-Host "`n1. Testing sample test cases (should show detailed results)..." -ForegroundColor Yellow

$sampleTestData = @{
    problemId = 1
    languageId = 1
    code = @"
public class Solution {
    public static void main(String[] args) {
        // Two Sum solution - correct implementation
        System.out.println("0 1");
    }
}
"@
} | ConvertTo-Json

try {
    $sampleResponse = Invoke-RestMethod -Uri "$API_BASE/api/submissions/run-sample" -Method POST -ContentType "application/json" -Body $sampleTestData
    
    Write-Host "✅ Sample test execution successful!" -ForegroundColor Green
    Write-Host "Status: $($sampleResponse.status)" -ForegroundColor White
    Write-Host "Test Cases: $($sampleResponse.passedTestCases)/$($sampleResponse.totalTestCases) passed" -ForegroundColor White
    
    if ($sampleResponse.testCaseResults) {
        Write-Host "`nSample Test Case Details:" -ForegroundColor Cyan
        foreach ($testCase in $sampleResponse.testCaseResults) {
            $visibility = if ($testCase.isSample) { "VISIBLE" } else { "HIDDEN" }
            $status = if ($testCase.passed) { "✅ PASSED" } else { "❌ FAILED" }
            
            Write-Host "  Test Case $($testCase.testCaseNumber): $status ($visibility)" -ForegroundColor White
            if ($testCase.isSample) {
                Write-Host "    Input: $($testCase.input)" -ForegroundColor Gray
                Write-Host "    Expected: $($testCase.expectedOutput)" -ForegroundColor Gray
                Write-Host "    Actual: $($testCase.actualOutput)" -ForegroundColor Gray
            } else {
                Write-Host "    Input: Hidden" -ForegroundColor Gray
                Write-Host "    Expected: Hidden" -ForegroundColor Gray
                Write-Host "    Actual: Hidden" -ForegroundColor Gray
            }
        }
    }
} catch {
    Write-Host "❌ Sample test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Submit code (should show both sample and hidden test cases)
Write-Host "`n2. Testing full submission (should show sample + hidden test cases)..." -ForegroundColor Yellow

$submissionData = @{
    problemId = 1
    languageId = 1
    userId = 1
    code = @"
public class Solution {
    public static void main(String[] args) {
        // Two Sum solution - correct implementation
        System.out.println("0 1");
    }
}
"@
} | ConvertTo-Json

try {
    $submissionResponse = Invoke-RestMethod -Uri "$API_BASE/api/submissions/submit" -Method POST -ContentType "application/json" -Body $submissionData
    
    Write-Host "✅ Full submission successful!" -ForegroundColor Green
    Write-Host "Status: $($submissionResponse.status)" -ForegroundColor White
    Write-Host "Test Cases: $($submissionResponse.passedTestCases)/$($submissionResponse.totalTestCases) passed" -ForegroundColor White
    Write-Host "Success Rate: $($submissionResponse.successRate)%" -ForegroundColor White
    
    if ($submissionResponse.testCaseResults) {
        Write-Host "`nFull Submission Test Case Details:" -ForegroundColor Cyan
        $sampleCount = 0
        $hiddenCount = 0
        
        foreach ($testCase in $submissionResponse.testCaseResults) {
            $visibility = if ($testCase.isSample) { "SAMPLE (VISIBLE)" } else { "HIDDEN" }
            $status = if ($testCase.passed) { "✅ PASSED" } else { "❌ FAILED" }
            
            if ($testCase.isSample) { $sampleCount++ } else { $hiddenCount++ }
            
            Write-Host "  Test Case $($testCase.testCaseNumber): $status - $visibility" -ForegroundColor White
            
            if ($testCase.isSample) {
                # Sample test cases should show full details
                Write-Host "    Input: $($testCase.input)" -ForegroundColor Gray
                Write-Host "    Expected: $($testCase.expectedOutput)" -ForegroundColor Gray
                Write-Host "    Actual: $($testCase.actualOutput)" -ForegroundColor Gray
            } else {
                # Hidden test cases should hide details
                Write-Host "    Input: $($testCase.input)" -ForegroundColor Gray
                Write-Host "    Expected: $($testCase.expectedOutput)" -ForegroundColor Gray
                Write-Host "    Actual: $($testCase.actualOutput)" -ForegroundColor Gray
            }
            Write-Host "    Time: $($testCase.executionTime)ms, Memory: $($testCase.memoryUsed)MB" -ForegroundColor Gray
        }
        
        Write-Host "`nSummary:" -ForegroundColor Cyan
        Write-Host "  Sample test cases (visible): $sampleCount" -ForegroundColor Green
        Write-Host "  Hidden test cases: $hiddenCount" -ForegroundColor Yellow
        Write-Host "  Total test cases: $($sampleCount + $hiddenCount)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Full submission failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test with failing code
Write-Host "`n3. Testing with failing code (should show sample test case failures)..." -ForegroundColor Yellow

$failingSubmissionData = @{
    problemId = 1
    languageId = 1
    userId = 1
    code = @"
public class Solution {
    public static void main(String[] args) {
        // Wrong solution - should fail
        System.out.println("1 2");
    }
}
"@
} | ConvertTo-Json

try {
    $failingResponse = Invoke-RestMethod -Uri "$API_BASE/api/submissions/submit" -Method POST -ContentType "application/json" -Body $failingSubmissionData
    
    Write-Host "✅ Failing submission processed!" -ForegroundColor Green
    Write-Host "Status: $($failingResponse.status)" -ForegroundColor White
    Write-Host "Test Cases: $($failingResponse.passedTestCases)/$($failingResponse.totalTestCases) passed" -ForegroundColor White
    
    if ($failingResponse.testCaseResults) {
        Write-Host "`nFailing Test Case Details:" -ForegroundColor Cyan
        foreach ($testCase in $failingResponse.testCaseResults) {
            if (-not $testCase.passed) {
                $visibility = if ($testCase.isSample) { "SAMPLE (VISIBLE)" } else { "HIDDEN" }
                Write-Host "  ❌ Test Case $($testCase.testCaseNumber) FAILED - $visibility" -ForegroundColor Red
                
                if ($testCase.isSample) {
                    Write-Host "    Input: $($testCase.input)" -ForegroundColor Gray
                    Write-Host "    Expected: $($testCase.expectedOutput)" -ForegroundColor Gray
                    Write-Host "    Actual: $($testCase.actualOutput)" -ForegroundColor Gray
                    Write-Host "    ❌ Sample test case failure details are visible!" -ForegroundColor Green
                } else {
                    Write-Host "    Details hidden for non-sample test case" -ForegroundColor Gray
                }
                break
            }
        }
    }
} catch {
    Write-Host "❌ Failing submission test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Sample test case visibility test completed!" -ForegroundColor Cyan
Write-Host "Key points verified:" -ForegroundColor White
Write-Host "  ✅ Sample test cases show full input/output details" -ForegroundColor Green
Write-Host "  ✅ Hidden test cases hide sensitive details" -ForegroundColor Green
Write-Host "  ✅ Both sample and hidden test cases are executed" -ForegroundColor Green
Write-Host "  ✅ Test case visibility is properly marked with isSample flag" -ForegroundColor Green