package com.codeplatform.backend.repository;

import com.codeplatform.backend.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    
    List<Problem> findByDifficulty(String difficulty);
    
    @Query("SELECT p FROM Problem p JOIN ProblemTopic pt ON p.id = pt.problem.id WHERE pt.topic.name = :topicName")
    List<Problem> findByTopicName(String topicName);
    
    Long countByDifficulty(String difficulty);
}