package com.codeplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    @Column(name = "sample_test_cases", columnDefinition = "TEXT")
    private String sampleTestCases; // JSON string for sample test cases shown to users
    
    @Column(name = "test_cases", columnDefinition = "TEXT")
    private String testCases; // JSON string for all test cases (including hidden ones)
    
    @Column(name = "expected_outputs", columnDefinition = "TEXT")
    private String expectedOutputs; // JSON string for H2 compatibility
    
    @Column(length = 20)
    private String difficulty;
    
    @Column(name = "time_limit")
    private Integer timeLimit; // in milliseconds
    
    @Column(name = "memory_limit")
    private Integer memoryLimit; // in MB
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}