package com.codeplatform.backend.controller;

import com.codeplatform.backend.dto.SubmissionRequest;
import com.codeplatform.backend.dto.SubmissionResponse;
import com.codeplatform.backend.model.Submission;
import com.codeplatform.backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<SubmissionResponse> submitCode(@RequestBody SubmissionRequest request) {
        try {
            System.out.println("Received submission request: " + request);
            System.out.println("Problem ID: " + request.getProblemId());
            System.out.println("Language ID: " + request.getLanguageId());
            System.out.println("User ID: " + request.getUserId());
            System.out.println("Code length: " + (request.getCode() != null ? request.getCode().length() : "null"));

            SubmissionResponse response = submissionService.submitCode(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in submitCode: " + e.getMessage());
            e.printStackTrace();
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/user/{userId}/problem/{problemId}")
    public ResponseEntity<List<Submission>> getUserSubmissions(
            @PathVariable Long userId,
            @PathVariable Long problemId) {
        try {
            List<Submission> submissions = submissionService.getUserSubmissions(userId, problemId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/run-sample")
    public ResponseEntity<SubmissionResponse> runSampleTestCases(
            @RequestParam Long problemId,
            @RequestParam Long languageId,
            @RequestParam String code) {
        try {
            System.out.println("Running sample test cases - Problem: " + problemId + ", Language: " + languageId);

            SubmissionResponse response = submissionService.runSampleTestCases(problemId, languageId, code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in runSampleTestCases: " + e.getMessage());
            e.printStackTrace();
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/leaderboard/problem/{problemId}/language/{languageId}")
    public ResponseEntity<List<Submission>> getLeaderboard(
            @PathVariable Long problemId,
            @PathVariable Long languageId) {
        try {
            List<Submission> submissions = submissionService.getAcceptedSubmissions(problemId, languageId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = submissionService.getUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting user stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<Submission>> getUserRecentSubmissions(@PathVariable Long userId) {
        try {
            List<Submission> submissions = submissionService.getUserRecentSubmissions(userId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            System.err.println("Error getting recent submissions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint working!");
    }
}