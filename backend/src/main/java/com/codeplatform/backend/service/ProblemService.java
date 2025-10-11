package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.ProblemDetailDTO;
import com.codeplatform.backend.dto.ProblemListDTO;
import com.codeplatform.backend.model.Problem;

import com.codeplatform.backend.repository.ProblemRepository;

import com.codeplatform.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProblemService {
    
    @Autowired
    private ProblemRepository problemRepository;
    

    
    public List<ProblemListDTO> getAllProblems() {
        return problemRepository.findAll().stream()
                .map(this::convertToProblemListDTO)
                .collect(Collectors.toList());
    }
    
    public ProblemDetailDTO getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        // Boilerplates are now handled by BoilerplateService - same for all problems
        Map<Long, String> boilerplateMap = Map.of();
        
        return convertToProblemDetailDTO(problem, boilerplateMap);
    }
    
    public List<ProblemListDTO> getProblemsByDifficulty(String difficulty) {
        return problemRepository.findByDifficulty(difficulty).stream()
                .map(this::convertToProblemListDTO)
                .collect(Collectors.toList());
    }
    
    private ProblemListDTO convertToProblemListDTO(Problem problem) {
        return new ProblemListDTO(
            problem.getId(),
            problem.getTitle(),
            problem.getDifficulty(),
            problem.getTimeLimit(),
            problem.getMemoryLimit()
        );
    }
    
    private ProblemDetailDTO convertToProblemDetailDTO(Problem problem, Map<Long, String> boilerplates) {
        ProblemDetailDTO dto = new ProblemDetailDTO();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setConstraints(problem.getConstraints());
        dto.setDifficulty(problem.getDifficulty());
        dto.setTimeLimit(problem.getTimeLimit());
        dto.setMemoryLimit(problem.getMemoryLimit());
        dto.setSampleTestCases(JsonUtil.parseSampleTestCases(problem.getSampleTestCases()));
        dto.setTestCases(JsonUtil.parseTestCases(problem.getTestCases()));
        dto.setBoilerplates(boilerplates);
        return dto;
    }
}