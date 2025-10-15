package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.ContestProblem;
import com.codeplatform.backend.model.ContestProblemId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContestProblemRepository extends JpaRepository<ContestProblem, ContestProblemId> {
    
    List<ContestProblem> findByContestId(Long contestId);
    
    List<ContestProblem> findByProblemId(Long problemId);
    
    boolean existsByContestIdAndProblemId(Long contestId, Long problemId);
    
    void deleteByContestId(Long contestId);
}