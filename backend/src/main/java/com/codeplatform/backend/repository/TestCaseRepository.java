package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    
    List<TestCase> findByProblemIdOrderByTestCaseNumber(Long problemId);
    
    @Query("SELECT tc FROM TestCase tc WHERE tc.problem.id = :problemId AND tc.isSample = true ORDER BY tc.testCaseNumber")
    List<TestCase> findSampleTestCasesByProblemId(@Param("problemId") Long problemId);
    
    @Query("SELECT tc FROM TestCase tc WHERE tc.problem.id = :problemId AND tc.isSample = false ORDER BY tc.testCaseNumber")
    List<TestCase> findHiddenTestCasesByProblemId(@Param("problemId") Long problemId);
    
    @Query("SELECT COUNT(tc) FROM TestCase tc WHERE tc.problem.id = :problemId")
    Long countByProblemId(@Param("problemId") Long problemId);
    
    @Query("SELECT COUNT(tc) FROM TestCase tc WHERE tc.problem.id = :problemId AND tc.isSample = true")
    Long countSampleTestCasesByProblemId(@Param("problemId") Long problemId);
}