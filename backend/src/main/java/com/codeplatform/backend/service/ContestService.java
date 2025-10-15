package com.codeplatform.backend.service;

import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import com.codeplatform.backend.dto.LeaderboardEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ContestService {
    
    @Autowired
    private ContestRepository contestRepository;
    
    @Autowired
    private ContestRegistrationRepository contestRegistrationRepository;
    
    @Autowired
    private ContestLeaderboardRepository contestLeaderboardRepository;
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // In-memory cache for live leaderboards
    private final Map<Long, PriorityQueue<LeaderboardEntry>> liveLeaderboards = new ConcurrentHashMap<>();
    private final Map<Long, Map<Long, LeaderboardEntry>> userLastSubmissions = new ConcurrentHashMap<>();
    
    public List<Contest> getAllContests() {
        return contestRepository.findAll();
    }
    
    public Contest getContestById(Long id) {
        return contestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
    }
    
    public List<Contest> getUpcomingContests() {
        LocalDateTime now = LocalDateTime.now();
        return contestRepository.findByStartTimeAfterOrderByStartTime(now);
    }
    
    public List<Contest> getOngoingContests() {
        LocalDateTime now = LocalDateTime.now();
        return contestRepository.findByStartTimeBeforeAndEndTimeAfterOrderByStartTime(now, now);
    }
    
    public List<Contest> getAvailableContests() {
        LocalDateTime now = LocalDateTime.now();
        return contestRepository.findByEndTimeAfterOrderByStartTime(now);
    }
    
    public List<Contest> getUserParticipatedContests(Long userId) {
        return contestRepository.findContestsByUserId(userId);
    }
    
    @Transactional
    public boolean registerUserForContest(Long contestId, Long userId) {
        try {
            Contest contest = contestRepository.findById(contestId)
                    .orElseThrow(() -> new RuntimeException("Contest not found"));
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if contest is still available for registration
            LocalDateTime now = LocalDateTime.now();
            if (contest.getEndTime().isBefore(now)) {
                throw new RuntimeException("Contest has already ended");
            }
            
            // Check if user is already registered
            if (contestRegistrationRepository.existsByContestIdAndUserId(contestId, userId)) {
                return false; // Already registered
            }
            
            // Register user
            ContestRegistration registration = new ContestRegistration();
            registration.setContest(contest);
            registration.setUser(user);
            registration.setId(new ContestRegistrationId(contestId, userId));
            contestRegistrationRepository.save(registration);
            
            // Initialize leaderboard entry
            ContestLeaderboard leaderboardEntry = new ContestLeaderboard(contest, user);
            contestLeaderboardRepository.save(leaderboardEntry);
            
            // Initialize in-memory structures
            initializeLeaderboardForContest(contestId);
            
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to register for contest: " + e.getMessage());
        }
    }
    
    public boolean isUserRegistered(Long contestId, Long userId) {
        return contestRegistrationRepository.existsByContestIdAndUserId(contestId, userId);
    }
    
    public List<Problem> getContestProblems(Long contestId) {
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        LocalDateTime now = LocalDateTime.now();
        
        // Problems are only visible if contest has started
        if (contest.getStartTime().isAfter(now)) {
            return new ArrayList<>(); // Contest hasn't started yet
        }
        
        return contestRepository.findProblemsByContestId(contestId);
    }
    
    @Transactional
    public void updateLeaderboardOnSubmission(Long contestId, Long userId, String status, LocalDateTime submissionTime) {
        try {
            // Update database leaderboard
            ContestLeaderboard entry = contestLeaderboardRepository.findByContestIdAndUserId(contestId, userId)
                    .orElseThrow(() -> new RuntimeException("User not registered for contest"));
            
            entry.setTotalSubmissions(entry.getTotalSubmissions() + 1);
            entry.setLastSubmissionTime(submissionTime);
            
            if ("Accepted".equals(status)) {
                entry.setScore(entry.getScore() + 100); // 100 points per solved problem
                entry.setProblemsSolved(entry.getProblemsSolved() + 1);
            }
            
            entry.setUpdatedAt(LocalDateTime.now());
            contestLeaderboardRepository.save(entry);
            
            // Update in-memory leaderboard
            updateLiveLeaderboard(contestId, entry);
            
        } catch (Exception e) {
            System.err.println("Error updating leaderboard: " + e.getMessage());
        }
    }
    
    private void updateLiveLeaderboard(Long contestId, ContestLeaderboard dbEntry) {
        // Get or create priority queue for contest
        PriorityQueue<LeaderboardEntry> leaderboard = liveLeaderboards.computeIfAbsent(
            contestId, k -> new PriorityQueue<>()
        );
        
        // Get or create user submissions map for contest
        Map<Long, LeaderboardEntry> userSubmissions = userLastSubmissions.computeIfAbsent(
            contestId, k -> new ConcurrentHashMap<>()
        );
        
        // Create new leaderboard entry
        LeaderboardEntry newEntry = new LeaderboardEntry(
            dbEntry.getUser().getId(),
            dbEntry.getUser().getUsername(),
            dbEntry.getScore(),
            dbEntry.getProblemsSolved(),
            dbEntry.getTotalSubmissions(),
            dbEntry.getLastSubmissionTime(),
            dbEntry.getPenaltyTime(),
            null // Rank will be calculated
        );
        
        // Update user's latest submission
        userSubmissions.put(dbEntry.getUser().getId(), newEntry);
        
        // Add to priority queue (it will automatically sort)
        leaderboard.offer(newEntry);
    }
    
    public List<LeaderboardEntry> getLiveLeaderboard(Long contestId, int page, int size) {
        initializeLeaderboardForContest(contestId);
        
        PriorityQueue<LeaderboardEntry> leaderboard = liveLeaderboards.get(contestId);
        Map<Long, LeaderboardEntry> userSubmissions = userLastSubmissions.get(contestId);
        
        if (leaderboard == null || userSubmissions == null) {
            return new ArrayList<>();
        }
        
        List<LeaderboardEntry> result = new ArrayList<>();
        PriorityQueue<LeaderboardEntry> tempQueue = new PriorityQueue<>(leaderboard);
        
        int currentRank = 1;
        int processed = 0;
        int startIndex = page * size;
        int endIndex = startIndex + size;
        
        while (!tempQueue.isEmpty() && processed < endIndex) {
            LeaderboardEntry entry = tempQueue.poll();
            
            // Check if this is the user's latest submission
            LeaderboardEntry latestSubmission = userSubmissions.get(entry.getUserId());
            if (latestSubmission != null && 
                latestSubmission.getLastSubmissionTime().equals(entry.getLastSubmissionTime())) {
                
                if (processed >= startIndex) {
                    entry.setRank(currentRank);
                    result.add(entry);
                }
                processed++;
                currentRank++;
            }
        }
        
        return result;
    }
    
    private void initializeLeaderboardForContest(Long contestId) {
        if (!liveLeaderboards.containsKey(contestId)) {
            // Load from database
            List<ContestLeaderboard> dbEntries = contestLeaderboardRepository.findByContestIdOrderByRank(contestId);
            
            PriorityQueue<LeaderboardEntry> leaderboard = new PriorityQueue<>();
            Map<Long, LeaderboardEntry> userSubmissions = new ConcurrentHashMap<>();
            
            for (ContestLeaderboard dbEntry : dbEntries) {
                LeaderboardEntry entry = new LeaderboardEntry(
                    dbEntry.getUser().getId(),
                    dbEntry.getUser().getUsername(),
                    dbEntry.getScore(),
                    dbEntry.getProblemsSolved(),
                    dbEntry.getTotalSubmissions(),
                    dbEntry.getLastSubmissionTime(),
                    dbEntry.getPenaltyTime(),
                    null
                );
                
                leaderboard.offer(entry);
                userSubmissions.put(dbEntry.getUser().getId(), entry);
            }
            
            liveLeaderboards.put(contestId, leaderboard);
            userLastSubmissions.put(contestId, userSubmissions);
        }
    }
    
    public Map<String, Object> getContestStats(Long contestId) {
        Map<String, Object> stats = new HashMap<>();
        
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new RuntimeException("Contest not found"));
        
        Long participantCount = contestLeaderboardRepository.countByContestId(contestId);
        
        stats.put("contestId", contestId);
        stats.put("contestName", contest.getName());
        stats.put("startTime", contest.getStartTime());
        stats.put("endTime", contest.getEndTime());
        stats.put("participantCount", participantCount);
        stats.put("status", getContestStatus(contest));
        
        return stats;
    }
    
    private String getContestStatus(Contest contest) {
        LocalDateTime now = LocalDateTime.now();
        
        if (now.isBefore(contest.getStartTime())) {
            return "UPCOMING";
        } else if (now.isAfter(contest.getEndTime())) {
            return "ENDED";
        } else {
            return "ONGOING";
        }
    }
}