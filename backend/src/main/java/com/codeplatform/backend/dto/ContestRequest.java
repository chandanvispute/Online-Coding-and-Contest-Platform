package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContestRequest {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long createdBy;
    private List<Long> problemIds;
}