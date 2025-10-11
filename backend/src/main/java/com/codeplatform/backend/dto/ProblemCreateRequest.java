package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemCreateRequest {
    private String title;
    private String description;
    private String constraints;
    private String difficulty;
    private Integer timeLimit;
    private Integer memoryLimit;
    private List<Map<String, String>> testCases;
    private List<String> expectedOutputs;
    private Long createdBy;
    private Map<Long, String> boilerplates; // languageId -> boilerplate code
}