package com.codeplatform.backend.controller;

import com.codeplatform.backend.dto.ContestRequest;
import com.codeplatform.backend.dto.ContestResponse;
import com.codeplatform.backend.model.ContestRegistration;
import com.codeplatform.backend.service.ContestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contests")
@CrossOrigin(origins = "*")
public class ContestController {
    
    @Autowired
    private ContestService contestService;
    
    @PostMapping
    public ResponseEntity<ContestResponse> createContest(@RequestBody ContestRequest request) {
        try {
            ContestResponse response = contestService.createContest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ContestResponse>> getAllContests() {
        try {
            List<ContestResponse> contests = contestService.getAllContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ContestResponse>> getActiveContests() {
        try {
            List<ContestResponse> contests = contestService.getActiveContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<ContestResponse>> getUpcomingContests() {
        try {
            List<ContestResponse> contests = contestService.getUpcomingContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContestResponse> getContestById(@PathVariable Long id) {
        try {
            ContestResponse contest = contestService.getContestById(id);
            return ResponseEntity.ok(contest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{contestId}/register/{userId}")
    public ResponseEntity<Void> registerForContest(@PathVariable Long contestId, @PathVariable Long userId) {
        try {
            contestService.registerForContest(contestId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<ContestRegistration>> getContestLeaderboard(@PathVariable Long contestId) {
        try {
            List<ContestRegistration> leaderboard = contestService.getContestLeaderboard(contestId);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}