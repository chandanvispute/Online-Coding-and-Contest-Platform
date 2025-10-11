package com.codeplatform.backend.dto;

public class TestCaseResult {
    private Integer testCaseNumber;
    private String input;
    private String expectedOutput;
    private String actualOutput;
    private Boolean passed;
    private String status;
    private Long executionTime;
    private Long memoryUsed;
    private String error;
    private Boolean isSample;

    // Constructors
    public TestCaseResult() {}

    public TestCaseResult(Integer testCaseNumber, String input, String expectedOutput, 
                         String actualOutput, Boolean passed, String status) {
        this.testCaseNumber = testCaseNumber;
        this.input = input;
        this.expectedOutput = expectedOutput;
        this.actualOutput = actualOutput;
        this.passed = passed;
        this.status = status;
    }

    // Getters and Setters
    public Integer getTestCaseNumber() { return testCaseNumber; }
    public void setTestCaseNumber(Integer testCaseNumber) { this.testCaseNumber = testCaseNumber; }

    public String getInput() { return input; }
    public void setInput(String input) { this.input = input; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getExecutionTime() { return executionTime; }
    public void setExecutionTime(Long executionTime) { this.executionTime = executionTime; }

    public Long getMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(Long memoryUsed) { this.memoryUsed = memoryUsed; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public Boolean getIsSample() { return isSample; }
    public void setIsSample(Boolean isSample) { this.isSample = isSample; }
}