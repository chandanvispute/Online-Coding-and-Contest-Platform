package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}