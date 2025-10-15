package com.codeplatform.backend.controller;

import com.codeplatform.backend.model.Contest;
import com.codeplatform.backend.model.Problem;
import com.codeplatform.backend.service.ContestService;
import com.codeplatform.backend.dto.LeaderboardEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contests")
@CrossOrigin(origins = "*")
public class ContestController {
    
    @Autowired
    private ContestService contestService;
    
    @GetMapping
    public ResponseEntity<List<Contest>> getAllContests() {
        try {
            List<Contest> contests = contestService.getAllContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            System.err.println("Error getting all contests: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Contest> getContestById(@PathVariable Long id) {
        try {
            Contest contest = contestService.getContestById(id);
            return ResponseEntity.ok(contest);
        } catch (Exception e) {
            System.err.println("Error getting contest by id: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<Contest>> getUpcomingContests() {
        try {
            List<Contest> contests = contestService.getUpcomingContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            System.err.println("Error getting upcoming contests: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/ongoing")
    public ResponseEntity<List<Contest>> getOngoingContests() {
        try {
            List<Contest> contests = contestService.getOngoingContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            System.err.println("Error getting ongoing contests: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Contest>> getAvailableContests() {
        try {
            List<Contest> contests = contestService.getAvailableContests();
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            System.err.println("Error getting available contests: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{contestId}/register/{userId}")
    public ResponseEntity<Map<String, Object>> registerForContest(
            @PathVariable Long contestId,
            @PathVariable Long userId) {
        try {
            boolean success = contestService.registerUserForContest(contestId, userId);
            
            Map<String, Object> response = Map.of(
                "success", success,
                "message", success ? "Successfully registered for contest" : "Already registered for contest"
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error registering for contest: " + e.getMessage());
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/{contestId}/registered/{userId}")
    public ResponseEntity<Map<String, Boolean>> isUserRegistered(
            @PathVariable Long contestId,
            @PathVariable Long userId) {
        try {
            boolean registered = contestService.isUserRegistered(contestId, userId);
            return ResponseEntity.ok(Map.of("registered", registered));
        } catch (Exception e) {
            System.err.println("Error checking registration: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{contestId}/problems")
    public ResponseEntity<List<Problem>> getContestProblems(@PathVariable Long contestId) {
        try {
            List<Problem> problems = contestService.getContestProblems(contestId);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            System.err.println("Error getting contest problems: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @PathVariable Long contestId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            List<LeaderboardEntry> leaderboard = contestService.getLiveLeaderboard(contestId, page, size);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            System.err.println("Error getting leaderboard: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{contestId}/stats")
    public ResponseEntity<Map<String, Object>> getContestStats(@PathVariable Long contestId) {
        try {
            Map<String, Object> stats = contestService.getContestStats(contestId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting contest stats: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{contestId}/submission-update")
    public ResponseEntity<String> updateLeaderboardOnSubmission(
            @PathVariable Long contestId,
            @RequestParam Long userId,
            @RequestParam String status) {
        try {
            contestService.updateLeaderboardOnSubmission(contestId, userId, status, java.time.LocalDateTime.now());
            return ResponseEntity.ok("Leaderboard updated successfully");
        } catch (Exception e) {
            System.err.println("Error updating leaderboard: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to update leaderboard");
        }
    }
    
    @GetMapping("/user/{userId}/participated")
    public ResponseEntity<List<Contest>> getUserParticipatedContests(@PathVariable Long userId) {
        try {
            List<Contest> contests = contestService.getUserParticipatedContests(userId);
            return ResponseEntity.ok(contests);
        } catch (Exception e) {
            System.err.println("Error getting user participated contests: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}