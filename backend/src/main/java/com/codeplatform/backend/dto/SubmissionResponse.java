package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionResponse {
    private Long submissionId;
    private String status;
    private String output;
    private String error;
    private Long executionTime;
    private Long memoryUsed;
    private String testCaseFailed;
    private Integer totalTestCases;
    private Integer passedTestCases;
    private List<TestCaseResult> testCaseResults;
    private String compilationError;
    private Double successRate;
}