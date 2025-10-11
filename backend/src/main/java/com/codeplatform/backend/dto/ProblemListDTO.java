package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemListDTO {
    private Long id;
    private String title;
    private String difficulty;
    private Integer timeLimit;
    private Integer memoryLimit;
}