package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.SubmissionRequest;
import com.codeplatform.backend.dto.SubmissionResponse;
import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;

@Service
public class SubmissionService {
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private LanguageRepository languageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @Autowired
    private ContestService contestService;
    
    public SubmissionResponse submitCode(SubmissionRequest request) {
        try {
            // Get entities
            Problem problem = problemRepository.findById(request.getProblemId())
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            
            Language language = languageRepository.findById(request.getLanguageId())
                    .orElseThrow(() -> new RuntimeException("Language not found"));
            
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Execute code
            SubmissionResponse response = codeExecutionService.executeCode(request.getCode(), language, problem);
            
            // Save submission
            Submission submission = new Submission();
            submission.setUser(user);
            submission.setProblem(problem);
            submission.setLanguage(language);
            submission.setCode(request.getCode());
            submission.setStatus(response.getStatus());
            submission.setCodeOutput(response.getOutput());
            submission.setExpectedOutput(response.getError());
            submission.setTestCaseFailed(response.getTestCaseFailed());
            submission.setExecutionTime(response.getExecutionTime());
            submission.setMemoryUsed(response.getMemoryUsed());
            
            submission = submissionRepository.save(submission);
            response.setSubmissionId(submission.getId());
            
            // Update contest leaderboard if this is a contest submission
            if (request.getContestId() != null) {
                contestService.updateLeaderboardOnSubmission(
                    request.getContestId(), 
                    request.getUserId(), 
                    response.getStatus(), 
                    submission.getSubmittedAt()
                );
            }
            
            return response;
            
        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }
    
    public List<Submission> getUserSubmissions(Long userId, Long problemId) {
        return submissionRepository.findByUserIdAndProblemId(userId, problemId);
    }
    
    public SubmissionResponse runSampleTestCases(Long problemId, Long languageId, String code) {
        try {
            // Get entities
            Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));
            
            Language language = languageRepository.findById(languageId)
                    .orElseThrow(() -> new RuntimeException("Language not found"));
            
            // Execute only sample test cases
            return codeExecutionService.executeSampleTestCases(code, language, problem);
            
        } catch (Exception e) {
            SubmissionResponse errorResponse = new SubmissionResponse();
            errorResponse.setStatus("System Error");
            errorResponse.setError(e.getMessage());
            return errorResponse;
        }
    }
    
    public List<Submission> getAcceptedSubmissions(Long problemId, Long languageId) {
        return submissionRepository.findAcceptedSubmissionsByProblemAndLanguageOrderByTime(problemId, languageId);
    }
    
    public List<Submission> getUserRecentSubmissions(Long userId) {
        return submissionRepository.findRecentSubmissionsByUserId(userId)
                .stream()
                .limit(10)
                .toList();
    }
    
    public Map<String, Object> getUserStats(Long userId) {
        List<Problem> solvedProblems = submissionRepository.findSolvedProblemsByUserId(userId);
        List<Object[]> difficultyStats = submissionRepository.findSolvedCountByDifficultyAndUserId(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSolved", solvedProblems.size());
        
        // Initialize difficulty counts
        Map<String, Integer> difficultyCounts = new HashMap<>();
        difficultyCounts.put("Easy", 0);
        difficultyCounts.put("Medium", 0);
        difficultyCounts.put("Hard", 0);
        
        // Fill in actual counts
        for (Object[] row : difficultyStats) {
            String difficulty = (String) row[0];
            Long count = (Long) row[1];
            difficultyCounts.put(difficulty, count.intValue());
        }
        
        stats.put("easySolved", difficultyCounts.get("Easy"));
        stats.put("mediumSolved", difficultyCounts.get("Medium"));
        stats.put("hardSolved", difficultyCounts.get("Hard"));
        
        // Calculate acceptance rate (simplified - based on recent submissions)
        List<Submission> recentSubmissions = submissionRepository.findRecentSubmissionsByUserId(userId)
                .stream()
                .limit(50)
                .toList();
        
        if (!recentSubmissions.isEmpty()) {
            long acceptedCount = recentSubmissions.stream()
                    .filter(s -> "Accepted".equals(s.getStatus()))
                    .count();
            double acceptanceRate = (double) acceptedCount / recentSubmissions.size() * 100;
            stats.put("acceptanceRate", Math.round(acceptanceRate * 100.0) / 100.0);
        } else {
            stats.put("acceptanceRate", 0.0);
        }
        
        // Calculate streak (simplified - consecutive days with accepted submissions)
        stats.put("streak", calculateStreak(userId));
        
        return stats;
    }
    
    public List<Problem> getUserSolvedProblems(Long userId) {
        return submissionRepository.findSolvedProblemsByUserId(userId);
    }
    
    private int calculateStreak(Long userId) {
        // Simplified streak calculation - just return 0 for now
        // In a real implementation, you'd check consecutive days with accepted submissions
        return 0;
    }
}