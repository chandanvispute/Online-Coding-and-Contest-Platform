package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.Contest;
import com.codeplatform.backend.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContestRepository extends JpaRepository<Contest, Long> {
    
    @Query("SELECT c FROM Contest c WHERE c.startTime <= :now AND c.endTime >= :now")
    List<Contest> findActiveContests(LocalDateTime now);
    
    @Query("SELECT c FROM Contest c WHERE c.startTime > :now")
    List<Contest> findUpcomingContests(LocalDateTime now);
    
    @Query("SELECT c FROM Contest c WHERE c.endTime < :now")
    List<Contest> findPastContests(LocalDateTime now);
    
    // New methods for contest service
    List<Contest> findByStartTimeAfterOrderByStartTime(LocalDateTime startTime);
    
    List<Contest> findByStartTimeBeforeAndEndTimeAfterOrderByStartTime(LocalDateTime startTime, LocalDateTime endTime);
    
    List<Contest> findByEndTimeAfterOrderByStartTime(LocalDateTime endTime);
    
    @Query("SELECT cp.problem FROM ContestProblem cp WHERE cp.contest.id = :contestId ORDER BY cp.problem.id")
    List<Problem> findProblemsByContestId(@Param("contestId") Long contestId);
    
    @Query("SELECT c FROM Contest c JOIN ContestRegistration cr ON c.id = cr.contest.id WHERE cr.user.id = :userId ORDER BY c.startTime DESC")
    List<Contest> findContestsByUserId(@Param("userId") Long userId);
}