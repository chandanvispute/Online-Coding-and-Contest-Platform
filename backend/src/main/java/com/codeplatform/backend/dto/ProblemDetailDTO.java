package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemDetailDTO {
    private Long id;
    private String title;
    private String description;
    private String constraints;
    private String difficulty;
    private Integer timeLimit;
    private Integer memoryLimit;
    private List<Map<String, Object>> sampleTestCases; // Sample test cases shown to users
    private List<Map<String, String>> testCases; // All test cases for submission
    private Map<Long, String> boilerplates; // languageId -> boilerplate code
}