package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.ContestRegistration;
import com.codeplatform.backend.model.ContestRegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContestRegistrationRepository extends JpaRepository<ContestRegistration, ContestRegistrationId> {
    
    List<ContestRegistration> findByContestIdOrderByScoreDescProblemsSolvedDesc(Long contestId);
    
    List<ContestRegistration> findByUserId(Long userId);
    
    @Query("SELECT COUNT(cr) FROM ContestRegistration cr WHERE cr.contest.id = :contestId")
    Long countParticipantsByContestId(Long contestId);
    
    // New methods for contest service
    boolean existsByContestIdAndUserId(Long contestId, Long userId);
    
    @Query("SELECT cr FROM ContestRegistration cr WHERE cr.contest.id = :contestId AND cr.user.id = :userId")
    ContestRegistration findByContestIdAndUserId(@Param("contestId") Long contestId, @Param("userId") Long userId);
}