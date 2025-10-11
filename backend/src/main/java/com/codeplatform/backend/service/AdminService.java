package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.ProblemCreateRequest;
import com.codeplatform.backend.dto.ProblemDetailDTO;
import com.codeplatform.backend.dto.UserResponse;
import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import com.codeplatform.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private LanguageRepository languageRepository;
    

    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private ContestRepository contestRepository;
    
    public ProblemDetailDTO createProblem(ProblemCreateRequest request) {
        User creator = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create problem
        Problem problem = new Problem();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setConstraints(request.getConstraints());
        problem.setDifficulty(request.getDifficulty());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        problem.setTestCases(JsonUtil.toJson(request.getTestCases()));
        problem.setExpectedOutputs(JsonUtil.toJson(request.getExpectedOutputs()));
        problem.setCreatedBy(creator);
        problem.setCreatedAt(LocalDateTime.now());
        problem.setUpdatedAt(LocalDateTime.now());
        
        problem = problemRepository.save(problem);
        
        // Boilerplates are now handled by BoilerplateService - no need to store in database
        
        ProblemDetailDTO dto = new ProblemDetailDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setConstraints(problem.getConstraints());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimit(problem.getTimeLimit());
        dto.setMemoryLimit(problem.getMemoryLimit());
        dto.setSampleTestCases(new ArrayList<>()); // Empty for now
        dto.setTestCases(request.getTestCases());
        dto.setBoilerplates(Map.of()); // Boilerplates handled by BoilerplateService
        return dto;
    }
    
    public void deleteProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        problemRepository.delete(problem);
    }
    
    public ProblemDetailDTO updateProblem(Long problemId, ProblemCreateRequest request) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setConstraints(request.getConstraints());
        problem.setDifficulty(request.getDifficulty());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());
        problem.setTestCases(JsonUtil.toJson(request.getTestCases()));
        problem.setExpectedOutputs(JsonUtil.toJson(request.getExpectedOutputs()));
        problem.setUpdatedAt(LocalDateTime.now());
        
        problem = problemRepository.save(problem);
        
        // Boilerplates are now handled by BoilerplateService - no need to update in database
        
        ProblemDetailDTO dto = new ProblemDetailDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setConstraints(problem.getConstraints());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimit(problem.getTimeLimit());
        dto.setMemoryLimit(problem.getMemoryLimit());
        dto.setSampleTestCases(new ArrayList<>()); // Empty for now
        dto.setTestCases(request.getTestCases());
        dto.setBoilerplates(Map.of()); // Boilerplates handled by BoilerplateService
        return dto;
    }
    
    // User Management Methods
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
    
    public UserResponse makeUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole("admin");
        user = userRepository.save(user);
        
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
    
    public UserResponse removeUserAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole("user");
        user = userRepository.save(user);
        
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
    
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
    
    // Dashboard Statistics
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count statistics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProblems", problemRepository.count());
        stats.put("totalSubmissions", submissionRepository.count());
        stats.put("totalContests", contestRepository.count());
        
        // Problem difficulty breakdown
        Map<String, Long> difficultyStats = new HashMap<>();
        difficultyStats.put("Easy", problemRepository.countByDifficulty("Easy"));
        difficultyStats.put("Medium", problemRepository.countByDifficulty("Medium"));
        difficultyStats.put("Hard", problemRepository.countByDifficulty("Hard"));
        stats.put("problemsByDifficulty", difficultyStats);
        
        // Submission status breakdown
        Map<String, Long> submissionStats = new HashMap<>();
        submissionStats.put("Accepted", submissionRepository.countByStatus("Accepted"));
        submissionStats.put("Wrong Answer", submissionRepository.countByStatus("Wrong Answer"));
        submissionStats.put("Time Limit Exceeded", submissionRepository.countByStatus("Time Limit Exceeded"));
        submissionStats.put("Runtime Error", submissionRepository.countByStatus("Runtime Error"));
        submissionStats.put("Compilation Error", submissionRepository.countByStatus("Compilation Error"));
        stats.put("submissionsByStatus", submissionStats);
        
        return stats;
    }
}