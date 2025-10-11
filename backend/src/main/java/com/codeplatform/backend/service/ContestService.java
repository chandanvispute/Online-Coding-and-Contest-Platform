package com.codeplatform.backend.service;

import com.codeplatform.backend.dto.*;
import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContestService {
    
    @Autowired
    private ContestRepository contestRepository;
    
    @Autowired
    private ContestRegistrationRepository registrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProblemRepository problemRepository;
    
    public ContestResponse createContest(ContestRequest request) {
        User creator = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Contest contest = new Contest();
        contest.setName(request.getName());
        contest.setStartTime(request.getStartTime());
        contest.setEndTime(request.getEndTime());
        contest.setCreatedBy(creator);
        contest.setCreatedAt(LocalDateTime.now());
        
        contest = contestRepository.save(contest);
        
        return convertToContestResponse(contest);
    }
    
    public List<ContestResponse> getAllContests() {
        return contestRepository.findAll().stream()
                .map(this::convertToContestResponse)
                .collect(Collectors.toList());
    }
    
    public List<ContestResponse> getActiveContests() {
        return contestRepository.findActiveContests(LocalDateTime.now()).stream()
                .map(this::convertToContestResponse)
                .collect(Collectors.toList());
    }
    
    public List<ContestResponse> getUpcomingContests() {
        return contestRepository.findUpcomingContests(LocalDateTime.now()).stream()
                .map(this::convertToContestResponse)
                .collect(Collectors.toList());
    }
    
    public ContestResponse getContestById(Long id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
        return convertToContestResponse(contest);
    }
    
    public void registerForContest(Long contestId, Long userId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ContestRegistrationId id = new ContestRegistrationId(contestId, userId);
        ContestRegistration registration = new ContestRegistration();
        registration.setId(id);
        registration.setContest(contest);
        registration.setUser(user);
        
        registrationRepository.save(registration);
    }
    
    public List<ContestRegistration> getContestLeaderboard(Long contestId) {
        return registrationRepository.findByContestIdOrderByScoreDescProblemsSolvedDesc(contestId);
    }
    
    private ContestResponse convertToContestResponse(Contest contest) {
        String status = getContestStatus(contest);
        Long participantCount = registrationRepository.countParticipantsByContestId(contest.getId());
        
        return new ContestResponse(
            contest.getId(),
            contest.getName(),
            contest.getStartTime(),
            contest.getEndTime(),
            contest.getCreatedBy().getUsername(),
            contest.getCreatedAt(),
            participantCount,
            List.of(), // Problems will be loaded separately if needed
            status
        );
    }
    
    private String getContestStatus(Contest contest) {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(contest.getStartTime())) {
            return "UPCOMING";
        } else if (now.isAfter(contest.getEndTime())) {
            return "ENDED";
        } else {
            return "ACTIVE";
        }
    }
}