package com.codeplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
    
    @ManyToOne
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;
    
    @Column(length = 20)
    private String status;
    
    @Column(name = "code_output", columnDefinition = "TEXT")
    private String codeOutput;
    
    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;
    
    @Column(name = "test_case_failed", columnDefinition = "TEXT")
    private String testCaseFailed;
    
    @Column(name = "execution_time")
    private Long executionTime; // in milliseconds
    
    @Column(name = "memory_used")
    private Long memoryUsed; // in KB
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt = LocalDateTime.now();
}