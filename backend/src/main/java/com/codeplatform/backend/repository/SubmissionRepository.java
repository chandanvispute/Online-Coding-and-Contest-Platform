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
    
    // Get user's submissions ordered by submission time
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    
    // Get user's accepted submissions for dashboard stats
    @Query("SELECT s FROM Submission s WHERE s.user.id = :userId AND s.status = 'Accepted'")
    List<Submission> findAcceptedSubmissionsByUserId(Long userId);
    
    // Get user's solved problems (distinct problems with accepted submissions)
    @Query("SELECT DISTINCT s.problem FROM Submission s WHERE s.user.id = :userId AND s.status = 'Accepted'")
    List<com.codeplatform.backend.model.Problem> findSolvedProblemsByUserId(Long userId);
    
    // Get user's submission stats by difficulty
    @Query("SELECT p.difficulty, COUNT(DISTINCT p.id) FROM Submission s JOIN s.problem p WHERE s.user.id = :userId AND s.status = 'Accepted' GROUP BY p.difficulty")
    List<Object[]> findSolvedCountByDifficultyAndUserId(Long userId);
    
    // Get user's recent submissions (last 10)
    @Query("SELECT s FROM Submission s WHERE s.user.id = :userId ORDER BY s.submittedAt DESC")
    List<Submission> findRecentSubmissionsByUserId(Long userId);
    
    // Check if user has solved a specific problem
    @Query("SELECT COUNT(s) > 0 FROM Submission s WHERE s.user.id = :userId AND s.problem.id = :problemId AND s.status = 'Accepted'")
    boolean hasUserSolvedProblem(Long userId, Long problemId);
}