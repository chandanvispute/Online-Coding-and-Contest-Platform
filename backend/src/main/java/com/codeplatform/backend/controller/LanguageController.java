package com.codeplatform.backend.controller;

import com.codeplatform.backend.model.Language;
import com.codeplatform.backend.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/languages")
@CrossOrigin(origins = "*")
public class LanguageController {
    
    @Autowired
    private LanguageRepository languageRepository;
    
    @GetMapping
    public ResponseEntity<List<Language>> getAllLanguages() {
        try {
            List<Language> languages = languageRepository.findAll();
            return ResponseEntity.ok(languages);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}