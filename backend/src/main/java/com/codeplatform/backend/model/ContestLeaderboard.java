package com.codeplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contest_leaderboard")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContestLeaderboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer score = 0;
    
    @Column(name = "problems_solved", nullable = false)
    private Integer problemsSolved = 0;
    
    @Column(name = "total_submissions", nullable = false)
    private Integer totalSubmissions = 0;
    
    @Column(name = "last_submission_time")
    private LocalDateTime lastSubmissionTime;
    
    @Column(name = "penalty_time", nullable = false)
    private Long penaltyTime = 0L; // In minutes
    
    @Column(name = "rank_position")
    private Integer rankPosition;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructor for leaderboard entry
    public ContestLeaderboard(Contest contest, User user) {
        this.contest = contest;
        this.user = user;
        this.score = 0;
        this.problemsSolved = 0;
        this.totalSubmissions = 0;
        this.penaltyTime = 0L;
        this.updatedAt = LocalDateTime.now();
    }
}