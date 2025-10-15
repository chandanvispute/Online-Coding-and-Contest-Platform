package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionRequest {
    private Long problemId;
    private Long languageId;
    private String code;
    private Long userId; // temporary until JWT is implemented
    private Long contestId; // optional - for contest submissions
}