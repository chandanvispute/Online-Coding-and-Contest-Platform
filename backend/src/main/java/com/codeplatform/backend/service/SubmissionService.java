package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.SubmissionRequest;
import com.codeplatform.backend.dto.SubmissionResponse;
import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
}