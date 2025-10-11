package com.codeplatform.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "contest_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContestRegistration {
    @EmbeddedId
    private ContestRegistrationId id;
    
    @ManyToOne
    @MapsId("contestId")
    @JoinColumn(name = "contest_id")
    private Contest contest;
    
    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "problems_solved")
    private Integer problemsSolved = 0;
    
    @Column
    private Integer score = 0;
}