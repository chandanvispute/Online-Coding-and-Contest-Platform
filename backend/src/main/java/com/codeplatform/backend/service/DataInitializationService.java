package com.codeplatform.backend.service;

import com.codeplatform.backend.model.*;
import com.codeplatform.backend.repository.*;
import com.codeplatform.backend.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private LanguageRepository languageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProblemRepository problemRepository;
    
    @Autowired
    private ContestRepository contestRepository;
    
    @Autowired
    private ContestRegistrationRepository contestRegistrationRepository;
    
    @Autowired
    private ContestLeaderboardRepository contestLeaderboardRepository;
    
    @Autowired
    private SubmissionRepository submissionRepository;
    
    @Autowired
    private ContestProblemRepository contestProblemRepository;
    
    @Override
    public void run(String... args) throws Exception {
        initializeLanguages();
        initializeUsers();
        initializeProblems();
        initializeContestData();
    }
    
    private void initializeLanguages() {
        if (languageRepository.count() == 0) {
            Language java = new Language(null, "Java", "java");
            Language python = new Language(null, "Python", "py");
            Language cpp = new Language(null, "C++", "cpp");
            
            languageRepository.saveAll(Arrays.asList(java, python, cpp));
            System.out.println("Languages initialized");
        }
    }
    
    private void initializeUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@codeplatform.com");
            admin.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            admin.setRole("admin");
            
            User testUser = new User();
            testUser.setUsername("testuser");
            testUser.setEmail("test@codeplatform.com");
            testUser.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            testUser.setRole("user");
            
            // Additional contest participants
            User alice = new User();
            alice.setUsername("alice");
            alice.setEmail("alice@codeplatform.com");
            alice.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            alice.setRole("user");
            
            User bob = new User();
            bob.setUsername("bob");
            bob.setEmail("bob@codeplatform.com");
            bob.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            bob.setRole("user");
            
            User charlie = new User();
            charlie.setUsername("charlie");
            charlie.setEmail("charlie@codeplatform.com");
            charlie.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            charlie.setRole("user");
            
            User diana = new User();
            diana.setUsername("diana");
            diana.setEmail("diana@codeplatform.com");
            diana.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            diana.setRole("user");
            
            User eve = new User();
            eve.setUsername("eve");
            eve.setEmail("eve@codeplatform.com");
            eve.setPasswordHash("$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S"); // "admin123"
            eve.setRole("user");
            
            userRepository.saveAll(Arrays.asList(admin, testUser, alice, bob, charlie, diana, eve));
            System.out.println("Users initialized");
        }
    }
    
    private void initializeProblems() {
        if (problemRepository.count() == 0) {
            User admin = userRepository.findByUsername("admin");
            Language java = languageRepository.findByName("Java");
            Language python = languageRepository.findByName("Python");
            Language cpp = languageRepository.findByName("C++");
            
            // Problem 1: Two Sum
            Problem twoSum = new Problem();
            twoSum.setTitle("Two Sum");
            twoSum.setDescription("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.");
            twoSum.setConstraints("2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.");
            twoSum.setDifficulty("Easy");
            twoSum.setTimeLimit(2000);
            twoSum.setMemoryLimit(256);
            twoSum.setCreatedBy(admin);
            
            // Sample test cases (shown to users)
            List<Map<String, Object>> twoSumSampleCases = Arrays.asList(
                Map.of(
                    "input", "4\n2 7 11 15\n9",
                    "output", "0 1",
                    "explanation", "Because nums[0] + nums[1] == 9, we return [0, 1]."
                ),
                Map.of(
                    "input", "3\n3 2 4\n6", 
                    "output", "1 2",
                    "explanation", "Because nums[1] + nums[2] == 6, we return [1, 2]."
                )
            );
            twoSum.setSampleTestCases(JsonUtil.toJson(twoSumSampleCases));
            
            // All test cases (including hidden ones for submission)
            List<Map<String, String>> twoSumAllTestCases = Arrays.asList(
                Map.of("input", "4\n2 7 11 15\n9", "description", "nums = [2,7,11,15], target = 9"),
                Map.of("input", "3\n3 2 4\n6", "description", "nums = [3,2,4], target = 6"),
                Map.of("input", "2\n3 3\n6", "description", "nums = [3,3], target = 6"),
                Map.of("input", "5\n1 2 3 4 5\n8", "description", "nums = [1,2,3,4,5], target = 8"),
                Map.of("input", "6\n-1 -2 -3 -4 -5 0\n-8", "description", "nums = [-1,-2,-3,-4,-5,0], target = -8"),
                Map.of("input", "4\n0 4 3 0\n0", "description", "nums = [0,4,3,0], target = 0")
            );
            twoSum.setTestCases(JsonUtil.toJson(twoSumAllTestCases));
            twoSum.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("0 1", "1 2", "0 1", "2 4", "2 4", "0 3")));
            problemRepository.save(twoSum);
            
            // Problem 2: Reverse Integer
            Problem reverseInteger = new Problem();
            reverseInteger.setTitle("Reverse Integer");
            reverseInteger.setDescription("Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).");
            reverseInteger.setConstraints("-2^31 <= x <= 2^31 - 1");
            reverseInteger.setDifficulty("Medium");
            reverseInteger.setTimeLimit(1000);
            reverseInteger.setMemoryLimit(128);
            reverseInteger.setCreatedBy(admin);
            
            // Sample test cases
            List<Map<String, Object>> reverseSampleCases = Arrays.asList(
                Map.of(
                    "input", "123",
                    "output", "321",
                    "explanation", "The reverse of 123 is 321."
                ),
                Map.of(
                    "input", "-123", 
                    "output", "-321",
                    "explanation", "The reverse of -123 is -321."
                ),
                Map.of(
                    "input", "120", 
                    "output", "21",
                    "explanation", "The reverse of 120 is 021, which is just 21."
                )
            );
            reverseInteger.setSampleTestCases(JsonUtil.toJson(reverseSampleCases));
            
            // All test cases
            List<Map<String, String>> reverseAllTestCases = Arrays.asList(
                Map.of("input", "123", "description", "x = 123"),
                Map.of("input", "-123", "description", "x = -123"),
                Map.of("input", "120", "description", "x = 120"),
                Map.of("input", "1534236469", "description", "x = 1534236469 (overflow case)"),
                Map.of("input", "-2147483648", "description", "x = -2147483648 (overflow case)"),
                Map.of("input", "0", "description", "x = 0")
            );
            reverseInteger.setTestCases(JsonUtil.toJson(reverseAllTestCases));
            reverseInteger.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("321", "-321", "21", "0", "0", "0")));
            problemRepository.save(reverseInteger);
            
            // Problem 3: Palindrome Number
            Problem palindromeNumber = new Problem();
            palindromeNumber.setTitle("Palindrome Number");
            palindromeNumber.setDescription("Given an integer x, return true if x is palindrome integer.\n\nAn integer is a palindrome when it reads the same backward as forward.\n\nFor example, 121 is a palindrome while 123 is not.");
            palindromeNumber.setConstraints("-2^31 <= x <= 2^31 - 1");
            palindromeNumber.setDifficulty("Easy");
            palindromeNumber.setTimeLimit(1000);
            palindromeNumber.setMemoryLimit(128);
            palindromeNumber.setCreatedBy(admin);
            
            // Sample test cases
            List<Map<String, Object>> palindromeSampleCases = Arrays.asList(
                Map.of(
                    "input", "121",
                    "output", "true",
                    "explanation", "121 reads as 121 from left to right and from right to left."
                ),
                Map.of(
                    "input", "-121", 
                    "output", "false",
                    "explanation", "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
                ),
                Map.of(
                    "input", "10", 
                    "output", "false",
                    "explanation", "Reads 01 from right to left. Therefore it is not a palindrome."
                )
            );
            palindromeNumber.setSampleTestCases(JsonUtil.toJson(palindromeSampleCases));
            
            // All test cases
            List<Map<String, String>> palindromeAllTestCases = Arrays.asList(
                Map.of("input", "121", "description", "x = 121"),
                Map.of("input", "-121", "description", "x = -121"),
                Map.of("input", "10", "description", "x = 10"),
                Map.of("input", "0", "description", "x = 0"),
                Map.of("input", "1221", "description", "x = 1221"),
                Map.of("input", "12321", "description", "x = 12321")
            );
            palindromeNumber.setTestCases(JsonUtil.toJson(palindromeAllTestCases));
            palindromeNumber.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("true", "false", "false", "true", "true", "true")));
            problemRepository.save(palindromeNumber);
            
            // Problem 4: Longest Common Prefix
            Problem longestCommonPrefix = new Problem();
            longestCommonPrefix.setTitle("Longest Common Prefix");
            longestCommonPrefix.setDescription("Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string \"\".");
            longestCommonPrefix.setConstraints("1 <= strs.length <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lower-case English letters.");
            longestCommonPrefix.setDifficulty("Easy");
            longestCommonPrefix.setTimeLimit(1000);
            longestCommonPrefix.setMemoryLimit(128);
            longestCommonPrefix.setCreatedBy(admin);
            
            // Sample test cases
            List<Map<String, Object>> prefixSampleCases = Arrays.asList(
                Map.of(
                    "input", "3\nflower\nflow\nflight",
                    "output", "fl",
                    "explanation", "The longest common prefix is \"fl\"."
                ),
                Map.of(
                    "input", "3\ndog\nracecar\ncar", 
                    "output", "",
                    "explanation", "There is no common prefix among the input strings."
                )
            );
            longestCommonPrefix.setSampleTestCases(JsonUtil.toJson(prefixSampleCases));
            
            // All test cases
            List<Map<String, String>> prefixAllTestCases = Arrays.asList(
                Map.of("input", "3\nflower\nflow\nflight", "description", "strs = [\"flower\",\"flow\",\"flight\"]"),
                Map.of("input", "3\ndog\nracecar\ncar", "description", "strs = [\"dog\",\"racecar\",\"car\"]"),
                Map.of("input", "1\na", "description", "strs = [\"a\"]"),
                Map.of("input", "3\nab\nab\nab", "description", "strs = [\"ab\",\"ab\",\"ab\"]"),
                Map.of("input", "2\nabc\nabcd", "description", "strs = [\"abc\",\"abcd\"]")
            );
            longestCommonPrefix.setTestCases(JsonUtil.toJson(prefixAllTestCases));
            longestCommonPrefix.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("fl", "", "a", "ab", "abc")));
            problemRepository.save(longestCommonPrefix);
            
            // Problem 5: Valid Parentheses
            Problem validParentheses = new Problem();
            validParentheses.setTitle("Valid Parentheses");
            validParentheses.setDescription("Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.");
            validParentheses.setConstraints("1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.");
            validParentheses.setDifficulty("Easy");
            validParentheses.setTimeLimit(1000);
            validParentheses.setMemoryLimit(128);
            validParentheses.setCreatedBy(admin);
            
            // Sample test cases
            List<Map<String, Object>> parenthesesSampleCases = Arrays.asList(
                Map.of(
                    "input", "()",
                    "output", "true",
                    "explanation", "The string contains valid parentheses."
                ),
                Map.of(
                    "input", "()[]{}", 
                    "output", "true",
                    "explanation", "All brackets are properly matched and closed."
                ),
                Map.of(
                    "input", "(]", 
                    "output", "false",
                    "explanation", "The brackets are not properly matched."
                )
            );
            validParentheses.setSampleTestCases(JsonUtil.toJson(parenthesesSampleCases));
            
            // All test cases
            List<Map<String, String>> parenthesesAllTestCases = Arrays.asList(
                Map.of("input", "()", "description", "s = \"()\""),
                Map.of("input", "()[]{}", "description", "s = \"()[]{}\""),
                Map.of("input", "(]", "description", "s = \"(]\""),
                Map.of("input", "([)]", "description", "s = \"([)]\""),
                Map.of("input", "{[]}", "description", "s = \"{[]}\""),
                Map.of("input", "((", "description", "s = \"((\"")
            );
            validParentheses.setTestCases(JsonUtil.toJson(parenthesesAllTestCases));
            validParentheses.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("true", "true", "false", "false", "true", "false")));
            problemRepository.save(validParentheses);
            
            // Problem 6: Merge Two Sorted Lists
            Problem mergeTwoLists = new Problem();
            mergeTwoLists.setTitle("Merge Two Sorted Lists");
            mergeTwoLists.setDescription("You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.");
            mergeTwoLists.setConstraints("The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.");
            mergeTwoLists.setDifficulty("Easy");
            mergeTwoLists.setTimeLimit(1000);
            mergeTwoLists.setMemoryLimit(128);
            mergeTwoLists.setCreatedBy(admin);
            
            // Sample test cases
            List<Map<String, Object>> mergeSampleCases = Arrays.asList(
                Map.of(
                    "input", "3\n1 2 4\n3\n1 3 4",
                    "output", "1 1 2 3 4 4",
                    "explanation", "The merged list is [1,1,2,3,4,4]."
                ),
                Map.of(
                    "input", "0\n1\n0", 
                    "output", "0",
                    "explanation", "The first list is empty, so return the second list [0]."
                ),
                Map.of(
                    "input", "0\n0", 
                    "output", "",
                    "explanation", "Both lists are empty, so return an empty list."
                )
            );
            mergeTwoLists.setSampleTestCases(JsonUtil.toJson(mergeSampleCases));
            
            // All test cases
            List<Map<String, String>> mergeAllTestCases = Arrays.asList(
                Map.of("input", "3\n1 2 4\n3\n1 3 4", "description", "list1 = [1,2,4], list2 = [1,3,4]"),
                Map.of("input", "0\n1\n0", "description", "list1 = [], list2 = [0]"),
                Map.of("input", "0\n0", "description", "list1 = [], list2 = []"),
                Map.of("input", "1\n5\n2\n1 4", "description", "list1 = [5], list2 = [1,4]"),
                Map.of("input", "2\n-9 3\n2\n5 7", "description", "list1 = [-9,3], list2 = [5,7]")
            );
            mergeTwoLists.setTestCases(JsonUtil.toJson(mergeAllTestCases));
            mergeTwoLists.setExpectedOutputs(JsonUtil.toJson(Arrays.asList("1 1 2 3 4 4", "0", "", "1 4 5", "-9 3 5 7")));
            problemRepository.save(mergeTwoLists);
            
            System.out.println("Sample problems initialized");
        }
    }
    
    private void initializeContestData() {
        if (contestRepository.count() == 0) {
            User admin = userRepository.findByUsername("admin");
            List<User> users = userRepository.findAll();
            List<Problem> problems = problemRepository.findAll();
            List<Language> languages = languageRepository.findAll();
            
            // Create past contest (completed)
            Contest pastContest = new Contest();
            pastContest.setName("Weekly Contest #1");
            pastContest.setStartTime(LocalDateTime.now().minusDays(7));
            pastContest.setEndTime(LocalDateTime.now().minusDays(7).plusHours(2));
            pastContest.setCreatedBy(admin);
            pastContest = contestRepository.save(pastContest);
            
            // Create ongoing contest
            Contest ongoingContest = new Contest();
            ongoingContest.setName("Weekly Contest #2");
            ongoingContest.setStartTime(LocalDateTime.now().minusHours(1));
            ongoingContest.setEndTime(LocalDateTime.now().plusHours(1));
            ongoingContest.setCreatedBy(admin);
            ongoingContest = contestRepository.save(ongoingContest);
            
            // Create upcoming contest
            Contest upcomingContest = new Contest();
            upcomingContest.setName("Weekly Contest #3");
            upcomingContest.setStartTime(LocalDateTime.now().plusDays(2));
            upcomingContest.setEndTime(LocalDateTime.now().plusDays(2).plusHours(2));
            upcomingContest.setCreatedBy(admin);
            upcomingContest = contestRepository.save(upcomingContest);
            
            // Add problems to contests (using first 3 problems for each contest)
            for (int i = 0; i < Math.min(3, problems.size()); i++) {
                // Past contest problems
                ContestProblem pastContestProblem = new ContestProblem();
                pastContestProblem.setId(new ContestProblemId(pastContest.getId(), problems.get(i).getId()));
                pastContestProblem.setContest(pastContest);
                pastContestProblem.setProblem(problems.get(i));
                contestProblemRepository.save(pastContestProblem);
                
                // Ongoing contest problems
                ContestProblem ongoingContestProblem = new ContestProblem();
                ongoingContestProblem.setId(new ContestProblemId(ongoingContest.getId(), problems.get(i).getId()));
                ongoingContestProblem.setContest(ongoingContest);
                ongoingContestProblem.setProblem(problems.get(i));
                contestProblemRepository.save(ongoingContestProblem);
                
                // Upcoming contest problems
                ContestProblem upcomingContestProblem = new ContestProblem();
                upcomingContestProblem.setId(new ContestProblemId(upcomingContest.getId(), problems.get(i).getId()));
                upcomingContestProblem.setContest(upcomingContest);
                upcomingContestProblem.setProblem(problems.get(i));
                contestProblemRepository.save(upcomingContestProblem);
            }
            
            // Register users for contests and create submissions
            createContestParticipation(pastContest, users, problems, languages, true); // Past contest with results
            createContestParticipation(ongoingContest, users, problems, languages, false); // Ongoing contest with partial results
            
            // Register some users for upcoming contest (no submissions yet)
            for (int i = 1; i < Math.min(4, users.size()); i++) {
                ContestRegistration registration = new ContestRegistration();
                registration.setId(new ContestRegistrationId(upcomingContest.getId(), users.get(i).getId()));
                registration.setContest(upcomingContest);
                registration.setUser(users.get(i));
                contestRegistrationRepository.save(registration);
            }
            
            System.out.println("Contest data initialized with participants and leaderboards");
        }
    }
    
    private void createContestParticipation(Contest contest, List<User> users, List<Problem> problems, List<Language> languages, boolean isCompleted) {
        // Skip admin user (index 0) for contest participation
        for (int i = 1; i < Math.min(6, users.size()); i++) {
            User user = users.get(i);
            
            // Register user for contest
            ContestRegistration registration = new ContestRegistration();
            registration.setId(new ContestRegistrationId(contest.getId(), user.getId()));
            registration.setContest(contest);
            registration.setUser(user);
            contestRegistrationRepository.save(registration);
            
            // Create leaderboard entry
            ContestLeaderboard leaderboardEntry = new ContestLeaderboard(contest, user);
            
            // Create submissions based on user performance (simulated)
            int problemsSolved = 0;
            int totalSubmissions = 0;
            int score = 0;
            long penaltyTime = 0;
            LocalDateTime lastSubmissionTime = contest.getStartTime();
            
            // Simulate different performance levels for users
            int performanceLevel = i % 3; // 0: high performer, 1: medium, 2: low
            int maxProblems = Math.min(3, problems.size());
            
            for (int j = 0; j < maxProblems; j++) {
                Problem problem = problems.get(j);
                Language language = languages.get(j % languages.size());
                
                // Determine if user solved this problem based on performance level
                boolean solved = false;
                int attempts = 1;
                
                switch (performanceLevel) {
                    case 0: // High performer - solves most problems quickly
                        solved = j < 3;
                        attempts = 1 + (int)(Math.random() * 2); // 1-2 attempts
                        break;
                    case 1: // Medium performer - solves some problems with more attempts
                        solved = j < 2;
                        attempts = 2 + (int)(Math.random() * 3); // 2-4 attempts
                        break;
                    case 2: // Low performer - solves fewer problems with many attempts
                        solved = j < 1;
                        attempts = 3 + (int)(Math.random() * 4); // 3-6 attempts
                        break;
                }
                
                // For ongoing contest, reduce completion rate
                if (!isCompleted) {
                    solved = solved && Math.random() > 0.3; // 70% chance to maintain solution
                    attempts = Math.max(1, attempts - 1);
                }
                
                // Create submissions
                for (int attempt = 0; attempt < attempts; attempt++) {
                    Submission submission = new Submission();
                    submission.setUser(user);
                    submission.setProblem(problem);
                    submission.setLanguage(language);
                    submission.setCode("// Sample solution for " + problem.getTitle());
                    
                    // Last attempt is successful if problem is solved
                    if (attempt == attempts - 1 && solved) {
                        submission.setStatus("Accepted");
                        problemsSolved++;
                        score += 100; // 100 points per problem
                        
                        // Add penalty time (minutes from contest start)
                        long minutesFromStart = 20 + (attempt * 10) + (j * 15) + (int)(Math.random() * 30);
                        penaltyTime += minutesFromStart + (attempt * 20); // 20 min penalty per wrong attempt
                        lastSubmissionTime = contest.getStartTime().plusMinutes(minutesFromStart);
                    } else {
                        submission.setStatus(Math.random() > 0.5 ? "Wrong Answer" : "Runtime Error");
                        penaltyTime += 20; // 20 min penalty for wrong submission
                    }
                    
                    submission.setExecutionTime(50L + (long)(Math.random() * 200)); // 50-250ms
                    submission.setMemoryUsed(20L + (long)(Math.random() * 50)); // 20-70KB
                    submission.setSubmittedAt(contest.getStartTime().plusMinutes(20 + (attempt * 10) + (j * 15)));
                    
                    submissionRepository.save(submission);
                    totalSubmissions++;
                }
            }
            
            // Update registration with final stats
            registration.setProblemsSolved(problemsSolved);
            registration.setScore(score);
            contestRegistrationRepository.save(registration);
            
            // Update leaderboard entry
            leaderboardEntry.setScore(score);
            leaderboardEntry.setProblemsSolved(problemsSolved);
            leaderboardEntry.setTotalSubmissions(totalSubmissions);
            leaderboardEntry.setPenaltyTime(penaltyTime);
            leaderboardEntry.setLastSubmissionTime(lastSubmissionTime);
            leaderboardEntry.setUpdatedAt(LocalDateTime.now());
            
            contestLeaderboardRepository.save(leaderboardEntry);
        }
        
        // Update rankings for the contest
        updateContestRankings(contest.getId());
    }
    
    private void updateContestRankings(Long contestId) {
        List<ContestLeaderboard> entries = contestLeaderboardRepository
            .findByContestIdOrderByRank(contestId);
        
        for (int i = 0; i < entries.size(); i++) {
            ContestLeaderboard entry = entries.get(i);
            entry.setRankPosition(i + 1);
            contestLeaderboardRepository.save(entry);
        }
    }
}