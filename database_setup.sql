-- =====================================================
-- CodePlatform Database Setup Script
-- Complete database recreation with all data
-- =====================================================

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS contest_leaderboard CASCADE;
DROP TABLE IF EXISTS contest_registrations CASCADE;
DROP TABLE IF EXISTS contest_problems CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS contests CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages table
CREATE TABLE languages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    extension VARCHAR(10) NOT NULL
);

-- Problems table
CREATE TABLE problems (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    constraints TEXT,
    sample_test_cases TEXT,
    test_cases TEXT,
    expected_outputs TEXT,
    difficulty VARCHAR(20),
    time_limit INTEGER,
    memory_limit INTEGER,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contests table
CREATE TABLE contests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    problem_id BIGINT NOT NULL REFERENCES problems(id),
    language_id BIGINT NOT NULL REFERENCES languages(id),
    code TEXT NOT NULL,
    status VARCHAR(20),
    code_output TEXT,
    expected_output TEXT,
    test_case_failed TEXT,
    execution_time BIGINT,
    memory_used BIGINT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contest Problems (Many-to-Many)
CREATE TABLE contest_problems (
    contest_id BIGINT NOT NULL REFERENCES contests(id),
    problem_id BIGINT NOT NULL REFERENCES problems(id),
    PRIMARY KEY (contest_id, problem_id)
);

-- Contest Registrations (Many-to-Many with additional fields)
CREATE TABLE contest_registrations (
    contest_id BIGINT NOT NULL REFERENCES contests(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    problems_solved INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    PRIMARY KEY (contest_id, user_id)
);

-- Contest Leaderboard
CREATE TABLE contest_leaderboard (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT NOT NULL REFERENCES contests(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    score INTEGER NOT NULL DEFAULT 0,
    problems_solved INTEGER NOT NULL DEFAULT 0,
    total_submissions INTEGER NOT NULL DEFAULT 0,
    last_submission_time TIMESTAMP,
    penalty_time BIGINT NOT NULL DEFAULT 0,
    rank_position INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERT DATA
-- =====================================================

-- Insert Languages
INSERT INTO languages (id, name, extension) VALUES
(1, 'Java', 'java'),
(2, 'Python', 'py'),
(3, 'C++', 'cpp');

-- Reset language sequence
SELECT setval('languages_id_seq', 3, true);

-- Insert Users
INSERT INTO users (id, username, email, password_hash, role, created_at, updated_at) VALUES
(1, 'admin', 'admin@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'testuser', 'test@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'alice', 'alice@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'bob', 'bob@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'charlie', 'charlie@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'diana', 'diana@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'eve', 'eve@codeplatform.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P8jW9TukLrx.3S', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset users sequence
SELECT setval('users_id_seq', 7, true);

-- Insert Problems
INSERT INTO problems (id, title, description, constraints, sample_test_cases, test_cases, expected_outputs, difficulty, time_limit, memory_limit, created_by, created_at, updated_at) VALUES
(1, 'Two Sum', 
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
'2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.',
'[{"input":"4\n2 7 11 15\n9","output":"0 1","explanation":"Because nums[0] + nums[1] == 9, we return [0, 1]."},{"input":"3\n3 2 4\n6","output":"1 2","explanation":"Because nums[1] + nums[2] == 6, we return [1, 2]."}]',
'[{"input":"4\n2 7 11 15\n9","description":"nums = [2,7,11,15], target = 9"},{"input":"3\n3 2 4\n6","description":"nums = [3,2,4], target = 6"},{"input":"2\n3 3\n6","description":"nums = [3,3], target = 6"},{"input":"5\n1 2 3 4 5\n8","description":"nums = [1,2,3,4,5], target = 8"},{"input":"6\n-1 -2 -3 -4 -5 0\n-8","description":"nums = [-1,-2,-3,-4,-5,0], target = -8"},{"input":"4\n0 4 3 0\n0","description":"nums = [0,4,3,0], target = 0"}]',
'["0 1","1 2","0 1","2 4","2 4","0 3"]',
'Easy', 2000, 256, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Reverse Integer',
'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).',
'-2^31 <= x <= 2^31 - 1',
'[{"input":"123","output":"321","explanation":"The reverse of 123 is 321."},{"input":"-123","output":"-321","explanation":"The reverse of -123 is -321."},{"input":"120","output":"21","explanation":"The reverse of 120 is 021, which is just 21."}]',
'[{"input":"123","description":"x = 123"},{"input":"-123","description":"x = -123"},{"input":"120","description":"x = 120"},{"input":"1534236469","description":"x = 1534236469 (overflow case)"},{"input":"-2147483648","description":"x = -2147483648 (overflow case)"},{"input":"0","description":"x = 0"}]',
'["321","-321","21","0","0","0"]',
'Medium', 1000, 128, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Palindrome Number',
'Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.',
'-2^31 <= x <= 2^31 - 1',
'[{"input":"121","output":"true","explanation":"121 reads as 121 from left to right and from right to left."},{"input":"-121","output":"false","explanation":"From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."},{"input":"10","output":"false","explanation":"Reads 01 from right to left. Therefore it is not a palindrome."}]',
'[{"input":"121","description":"x = 121"},{"input":"-121","description":"x = -121"},{"input":"10","description":"x = 10"},{"input":"0","description":"x = 0"},{"input":"1221","description":"x = 1221"},{"input":"12321","description":"x = 12321"}]',
'["true","false","false","true","true","true"]',
'Easy', 1000, 128, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'Longest Common Prefix',
'Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".',
'1 <= strs.length <= 200
0 <= strs[i].length <= 200
strs[i] consists of only lower-case English letters.',
'[{"input":"3\nflower\nflow\nflight","output":"fl","explanation":"The longest common prefix is \"fl\"."},{"input":"3\ndog\nracecar\ncar","output":"","explanation":"There is no common prefix among the input strings."}]',
'[{"input":"3\nflower\nflow\nflight","description":"strs = [\"flower\",\"flow\",\"flight\"]"},{"input":"3\ndog\nracecar\ncar","description":"strs = [\"dog\",\"racecar\",\"car\"]"},{"input":"1\na","description":"strs = [\"a\"]"},{"input":"3\nab\nab\nab","description":"strs = [\"ab\",\"ab\",\"ab\"]"},{"input":"2\nabc\nabcd","description":"strs = [\"abc\",\"abcd\"]"}]',
'["fl","","a","ab","abc"]',
'Easy', 1000, 128, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'Valid Parentheses',
'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.',
'1 <= s.length <= 10^4
s consists of parentheses only ''()[]{}''.', 
'[{"input":"()","output":"true","explanation":"The string contains valid parentheses."},{"input":"()[]{}","output":"true","explanation":"All brackets are properly matched and closed."},{"input":"(]","output":"false","explanation":"The brackets are not properly matched."}]',
'[{"input":"()","description":"s = \"()\""},{"input":"()[]{}","description":"s = \"()[]{}\""},{"input":"(]","description":"s = \"(]\""},{"input":"([)]","description":"s = \"([)]\""},{"input":"{[]}","description":"s = \"{[]}\""},{"input":"((","description":"s = \"((\""}]',
'["true","true","false","false","true","false"]',
'Easy', 1000, 128, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 'Merge Two Sorted Lists',
'You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.',
'The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both list1 and list2 are sorted in non-decreasing order.',
'[{"input":"3\n1 2 4\n3\n1 3 4","output":"1 1 2 3 4 4","explanation":"The merged list is [1,1,2,3,4,4]."},{"input":"0\n1\n0","output":"0","explanation":"The first list is empty, so return the second list [0]."},{"input":"0\n0","output":"","explanation":"Both lists are empty, so return an empty list."}]',
'[{"input":"3\n1 2 4\n3\n1 3 4","description":"list1 = [1,2,4], list2 = [1,3,4]"},{"input":"0\n1\n0","description":"list1 = [], list2 = [0]"},{"input":"0\n0","description":"list1 = [], list2 = []"},{"input":"1\n5\n2\n1 4","description":"list1 = [5], list2 = [1,4]"},{"input":"2\n-9 3\n2\n5 7","description":"list1 = [-9,3], list2 = [5,7]"}]',
'["1 1 2 3 4 4","0","","1 4 5","-9 3 5 7"]',
'Easy', 1000, 128, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset problems sequence
SELECT setval('problems_id_seq', 6, true);

-- Insert Contests
INSERT INTO contests (id, name, start_time, end_time, created_by, created_at) VALUES
(1, 'Weekly Contest #1', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '2 hours', 1, CURRENT_TIMESTAMP),
(2, 'Weekly Contest #2', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '1 hour', 1, CURRENT_TIMESTAMP),
(3, 'Weekly Contest #3', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days' + INTERVAL '2 hours', 1, CURRENT_TIMESTAMP);

-- Reset contests sequence
SELECT setval('contests_id_seq', 3, true);

-- Insert Contest Problems (Each contest has first 3 problems)
INSERT INTO contest_problems (contest_id, problem_id) VALUES
-- Contest 1 problems
(1, 1), (1, 2), (1, 3),
-- Contest 2 problems  
(2, 1), (2, 2), (2, 3),
-- Contest 3 problems
(3, 1), (3, 2), (3, 3);

-- Insert Contest Registrations
INSERT INTO contest_registrations (contest_id, user_id, problems_solved, score) VALUES
-- Past Contest #1 (completed)
(1, 2, 2, 200),  -- testuser: 2 problems, 200 points
(1, 3, 1, 100),  -- alice: 1 problem, 100 points
-- Ongoing Contest #2 (partial results)
(2, 2, 1, 100),  -- testuser: 1 problem, 100 points
(2, 4, 1, 100),  -- bob: 1 problem, 100 points
-- Upcoming Contest #3 (registered, no results yet)
(3, 3, 0, 0),    -- alice: registered
(3, 5, 0, 0),    -- charlie: registered
(3, 6, 0, 0);    -- diana: registered

-- Insert Contest Leaderboard entries
INSERT INTO contest_leaderboard (id, contest_id, user_id, score, problems_solved, total_submissions, last_submission_time, penalty_time, rank_position, updated_at) VALUES
-- Past Contest #1 Leaderboard
(1, 1, 2, 200, 2, 8, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '65 minutes', 85, 1, CURRENT_TIMESTAMP),
(2, 1, 3, 100, 1, 4, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '35 minutes', 55, 2, CURRENT_TIMESTAMP),
-- Ongoing Contest #2 Leaderboard  
(3, 2, 2, 100, 1, 3, CURRENT_TIMESTAMP - INTERVAL '25 minutes', 45, 1, CURRENT_TIMESTAMP),
(4, 2, 4, 100, 1, 2, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 30, 2, CURRENT_TIMESTAMP);

-- Reset contest_leaderboard sequence
SELECT setval('contest_leaderboard_id_seq', 4, true);
-- Inse
rt Sample Submissions for realistic data
INSERT INTO submissions (id, user_id, problem_id, language_id, code, status, execution_time, memory_used, submitted_at) VALUES
-- Past Contest #1 Submissions (testuser - 2 problems solved)
(1, 2, 1, 1, '// Java solution for Two Sum\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implementation here\n        return new int[]{0, 1};\n    }\n}', 'Wrong Answer', 120, 45, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '25 minutes'),
(2, 2, 1, 1, '// Java solution for Two Sum - Fixed\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Correct implementation\n        return new int[]{0, 1};\n    }\n}', 'Accepted', 95, 42, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '35 minutes'),
(3, 2, 2, 2, '# Python solution for Reverse Integer\ndef reverse(x):\n    # Implementation here\n    return 321', 'Runtime Error', 0, 0, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '45 minutes'),
(4, 2, 2, 2, '# Python solution for Reverse Integer - Fixed\ndef reverse(x):\n    # Correct implementation\n    return 321', 'Accepted', 78, 38, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '65 minutes'),
(5, 2, 3, 1, '// Java solution for Palindrome Number\npublic class Solution {\n    public boolean isPalindrome(int x) {\n        return false;\n    }\n}', 'Wrong Answer', 85, 35, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '75 minutes'),
(6, 2, 3, 1, '// Java solution for Palindrome Number\npublic class Solution {\n    public boolean isPalindrome(int x) {\n        return false;\n    }\n}', 'Wrong Answer', 92, 37, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '85 minutes'),

-- Past Contest #1 Submissions (alice - 1 problem solved)
(7, 3, 1, 2, '# Python solution for Two Sum\ndef twoSum(nums, target):\n    # Implementation\n    return [0, 1]', 'Accepted', 105, 48, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '35 minutes'),
(8, 3, 2, 2, '# Python solution for Reverse Integer\ndef reverse(x):\n    return 0', 'Wrong Answer', 67, 32, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '55 minutes'),
(9, 3, 2, 2, '# Python solution for Reverse Integer\ndef reverse(x):\n    return 0', 'Wrong Answer', 71, 34, CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '75 minutes'),

-- Ongoing Contest #2 Submissions (testuser - 1 problem solved)
(10, 2, 1, 3, '// C++ solution for Two Sum\n#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {0, 1};\n    }\n};', 'Wrong Answer', 110, 52, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(11, 2, 1, 3, '// C++ solution for Two Sum - Fixed\n#include <vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Correct implementation\n        return {0, 1};\n    }\n};', 'Accepted', 88, 49, CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
(12, 2, 2, 1, '// Java solution for Reverse Integer\npublic class Solution {\n    public int reverse(int x) {\n        return 0;\n    }\n}', 'Wrong Answer', 95, 41, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),

-- Ongoing Contest #2 Submissions (bob - 1 problem solved)  
(13, 4, 1, 1, '// Java solution for Two Sum\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implementation\n        return new int[]{0, 1};\n    }\n}', 'Accepted', 102, 46, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(14, 4, 2, 1, '// Java solution for Reverse Integer\npublic class Solution {\n    public int reverse(int x) {\n        return 0;\n    }\n}', 'Wrong Answer', 89, 39, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),

-- Additional submissions for variety (non-contest submissions)
(15, 3, 4, 2, '# Python solution for Longest Common Prefix\ndef longestCommonPrefix(strs):\n    return "fl"', 'Accepted', 76, 33, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(16, 4, 5, 1, '// Java solution for Valid Parentheses\npublic class Solution {\n    public boolean isValid(String s) {\n        return true;\n    }\n}', 'Accepted', 82, 36, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(17, 5, 6, 3, '// C++ solution for Merge Two Sorted Lists\nstruct ListNode {\n    int val;\n    ListNode *next;\n};\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n        return l1;\n    }\n};', 'Wrong Answer', 125, 58, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(18, 6, 1, 2, '# Python solution for Two Sum\ndef twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []', 'Accepted', 156, 62, CURRENT_TIMESTAMP - INTERVAL '12 hours'),
(19, 7, 3, 1, '// Java solution for Palindrome Number\npublic class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0) return false;\n        String s = String.valueOf(x);\n        return s.equals(new StringBuilder(s).reverse().toString());\n    }\n}', 'Accepted', 98, 44, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
(20, 2, 4, 1, '// Java solution for Longest Common Prefix\npublic class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        if (strs.length == 0) return "";\n        String prefix = strs[0];\n        for (int i = 1; i < strs.length; i++) {\n            while (strs[i].indexOf(prefix) != 0) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) return "";\n            }\n        }\n        return prefix;\n    }\n}', 'Accepted', 87, 41, CURRENT_TIMESTAMP - INTERVAL '4 hours');

-- Reset submissions sequence
SELECT setval('submissions_id_seq', 20, true);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Problem indexes
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_created_by ON problems(created_by);
CREATE INDEX idx_problems_title ON problems(title);

-- Submission indexes
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_language_id ON submissions(language_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);

-- Contest indexes
CREATE INDEX idx_contests_start_time ON contests(start_time);
CREATE INDEX idx_contests_end_time ON contests(end_time);
CREATE INDEX idx_contests_created_by ON contests(created_by);

-- Contest registration indexes
CREATE INDEX idx_contest_registrations_contest_id ON contest_registrations(contest_id);
CREATE INDEX idx_contest_registrations_user_id ON contest_registrations(user_id);

-- Contest leaderboard indexes
CREATE INDEX idx_contest_leaderboard_contest_id ON contest_leaderboard(contest_id);
CREATE INDEX idx_contest_leaderboard_user_id ON contest_leaderboard(user_id);
CREATE INDEX idx_contest_leaderboard_score ON contest_leaderboard(score DESC);
CREATE INDEX idx_contest_leaderboard_rank ON contest_leaderboard(rank_position);

-- Contest problem indexes
CREATE INDEX idx_contest_problems_contest_id ON contest_problems(contest_id);
CREATE INDEX idx_contest_problems_problem_id ON contest_problems(problem_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify data insertion
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Languages', COUNT(*) FROM languages  
UNION ALL
SELECT 'Problems', COUNT(*) FROM problems
UNION ALL
SELECT 'Contests', COUNT(*) FROM contests
UNION ALL
SELECT 'Submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'Contest Registrations', COUNT(*) FROM contest_registrations
UNION ALL
SELECT 'Contest Leaderboard', COUNT(*) FROM contest_leaderboard
UNION ALL
SELECT 'Contest Problems', COUNT(*) FROM contest_problems;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT username, email, role FROM users LIMIT 5;

SELECT 'Sample Problems:' as info;
SELECT id, title, difficulty, time_limit FROM problems LIMIT 3;

SELECT 'Sample Contests:' as info;
SELECT id, name, start_time, end_time FROM contests;

SELECT 'Contest #1 Leaderboard:' as info;
SELECT cl.rank_position, u.username, cl.score, cl.problems_solved, cl.total_submissions
FROM contest_leaderboard cl
JOIN users u ON cl.user_id = u.id
WHERE cl.contest_id = 1
ORDER BY cl.rank_position;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

SELECT '✅ Database setup completed successfully!' as status;
SELECT '🏆 CodePlatform database is ready with:' as info;
SELECT '   - 7 users (admin, testuser, alice, bob, charlie, diana, eve)' as users_info;
SELECT '   - 3 programming languages (Java, Python, C++)' as languages_info;
SELECT '   - 6 coding problems with test cases' as problems_info;
SELECT '   - 3 contests (past, ongoing, upcoming)' as contests_info;
SELECT '   - 20 realistic submissions with various statuses' as submissions_info;
SELECT '   - Complete leaderboard data for contests' as leaderboard_info;
SELECT '🔐 Login credentials: admin/admin123 or testuser/admin123' as login_info;