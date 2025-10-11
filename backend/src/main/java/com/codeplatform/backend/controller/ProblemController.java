package com.codeplatform.backend.controller;

import com.codeplatform.backend.dto.ProblemDetailDTO;
import com.codeplatform.backend.dto.ProblemListDTO;
import com.codeplatform.backend.service.ProblemService;
import com.codeplatform.backend.service.BoilerplateService;
import com.codeplatform.backend.model.Language;
import com.codeplatform.backend.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*")
public class ProblemController {
    
    @Autowired
    private ProblemService problemService;
    
    @Autowired
    private BoilerplateService boilerplateService;
    
    @Autowired
    private LanguageRepository languageRepository;
    
    @GetMapping
    public ResponseEntity<List<ProblemListDTO>> getAllProblems() {
        try {
            List<ProblemListDTO> problems = problemService.getAllProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProblemDetailDTO> getProblemById(@PathVariable Long id) {
        try {
            ProblemDetailDTO problem = problemService.getProblemById(id);
            return ResponseEntity.ok(problem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<ProblemListDTO>> getProblemsByDifficulty(@PathVariable String difficulty) {
        try {
            List<ProblemListDTO> problems = problemService.getProblemsByDifficulty(difficulty);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{problemId}/boilerplate/{languageId}")
    public ResponseEntity<String> getBoilerplateCode(
            @PathVariable Long problemId, 
            @PathVariable Long languageId) {
        try {
            // Get language name
            Language language = languageRepository.findById(languageId)
                    .orElseThrow(() -> new RuntimeException("Language not found"));
            
            // Get standard boilerplate for the language
            String boilerplate = boilerplateService.getBoilerplateCode(language.getName());
            
            return ResponseEntity.ok(boilerplate);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}