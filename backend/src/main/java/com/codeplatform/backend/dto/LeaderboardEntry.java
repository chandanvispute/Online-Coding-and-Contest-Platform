package com.codeplatform.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry implements Comparable<LeaderboardEntry> {
    private Long userId;
    private String username;
    private Integer score;
    private Integer problemsSolved;
    private Integer totalSubmissions;
    private LocalDateTime lastSubmissionTime;
    private Long penaltyTime;
    private Integer rank;
    
    @Override
    public int compareTo(LeaderboardEntry other) {
        // Primary: Higher score wins
        int scoreComparison = Integer.compare(other.score, this.score);
        if (scoreComparison != 0) return scoreComparison;
        
        // Secondary: Fewer submissions wins (less penalty)
        int submissionComparison = Integer.compare(this.totalSubmissions, other.totalSubmissions);
        if (submissionComparison != 0) return submissionComparison;
        
        // Tertiary: Earlier last submission wins
        if (this.lastSubmissionTime == null && other.lastSubmissionTime == null) return 0;
        if (this.lastSubmissionTime == null) return 1;
        if (other.lastSubmissionTime == null) return -1;
        
        return this.lastSubmissionTime.compareTo(other.lastSubmissionTime);
    }
}