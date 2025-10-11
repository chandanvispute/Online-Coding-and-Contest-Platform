package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    List<Submission> findByUserIdAndProblemId(Long userId, Long problemId);
    
    List<Submission> findByProblemIdAndStatus(Long problemId, String status);
    
    @Query("SELECT s FROM Submission s WHERE s.problem.id = :problemId AND s.language.id = :languageId AND s.status = 'Accepted' ORDER BY s.executionTime ASC")
    List<Submission> findAcceptedSubmissionsByProblemAndLanguageOrderByTime(Long problemId, Long languageId);
    
    Long countByStatus(String status);
}