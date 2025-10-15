package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.ContestLeaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContestLeaderboardRepository extends JpaRepository<ContestLeaderboard, Long> {
    
    // Find leaderboard entry for specific user in contest
    Optional<ContestLeaderboard> findByContestIdAndUserId(Long contestId, Long userId);
    
    // Get leaderboard for contest ordered by rank
    @Query("SELECT cl FROM ContestLeaderboard cl WHERE cl.contest.id = :contestId ORDER BY cl.score DESC, cl.totalSubmissions ASC, cl.lastSubmissionTime ASC")
    List<ContestLeaderboard> findByContestIdOrderByRank(@Param("contestId") Long contestId);
    
    // Get top N entries for contest
    @Query("SELECT cl FROM ContestLeaderboard cl WHERE cl.contest.id = :contestId ORDER BY cl.score DESC, cl.totalSubmissions ASC, cl.lastSubmissionTime ASC")
    List<ContestLeaderboard> findTopNByContestId(@Param("contestId") Long contestId);
    
    // Get leaderboard with pagination
    @Query("SELECT cl FROM ContestLeaderboard cl WHERE cl.contest.id = :contestId ORDER BY cl.score DESC, cl.totalSubmissions ASC, cl.lastSubmissionTime ASC")
    List<ContestLeaderboard> findByContestIdWithPagination(@Param("contestId") Long contestId);
    
    // Count participants in contest
    Long countByContestId(Long contestId);
    
    // Get user's rank in contest
    @Query("SELECT COUNT(cl) + 1 FROM ContestLeaderboard cl WHERE cl.contest.id = :contestId AND " +
           "(cl.score > :score OR " +
           "(cl.score = :score AND cl.totalSubmissions < :submissions) OR " +
           "(cl.score = :score AND cl.totalSubmissions = :submissions AND cl.lastSubmissionTime < :lastSubmission))")
    Integer getUserRankInContest(@Param("contestId") Long contestId, 
                                @Param("score") Integer score,
                                @Param("submissions") Integer submissions,
                                @Param("lastSubmission") java.time.LocalDateTime lastSubmission);
}