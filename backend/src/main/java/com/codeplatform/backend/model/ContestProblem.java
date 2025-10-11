package com.codeplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "contest_problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContestProblem {
    @EmbeddedId
    private ContestProblemId id;
    
    @ManyToOne
    @MapsId("contestId")
    @JoinColumn(name = "contest_id")
    private Contest contest;
    
    @ManyToOne
    @MapsId("problemId")
    @JoinColumn(name = "problem_id")
    private Problem problem;
}