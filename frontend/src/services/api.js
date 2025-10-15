import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API call failed:', error);
    throw error;
  }
);

// User API
export const userAPI = {
  register: async (userData) => {
    return api.post('/users/register', userData);
  },

  login: async (credentials) => {
    return api.post('/users/login', credentials);
  },

  getUserById: async (id) => {
    return api.get(`/users/${id}`);
  },

  getUserByUsername: async (username) => {
    return api.get(`/users/username/${username}`);
  },
};

// Problem API
export const problemAPI = {
  getAllProblems: async () => {
    return api.get('/problems');
  },

  getProblemById: async (id) => {
    return api.get(`/problems/${id}`);
  },

  getProblemsByDifficulty: async (difficulty) => {
    return api.get(`/problems/difficulty/${difficulty}`);
  },

  getBoilerplateCode: async (problemId, languageId) => {
    const response = await api.get(`/problems/${problemId}/boilerplate/${languageId}`);
    return response; // This returns the string directly
  },
};

// Language API
export const languageAPI = {
  getAllLanguages: async () => {
    return api.get('/languages');
  },
};

// Submission API
export const submissionAPI = {
  submitCode: async (submissionData) => {
    return api.post('/submissions/submit', submissionData);
  },

  runSampleTestCases: async (problemId, languageId, code) => {
    const params = new URLSearchParams({
      problemId: problemId.toString(),
      languageId: languageId.toString(),
      code: code,
    });
    
    return api.post(`/submissions/run-sample?${params}`);
  },

  getUserSubmissions: async (userId, problemId) => {
    return api.get(`/submissions/user/${userId}/problem/${problemId}`);
  },

  getUserRecentSubmissions: async (userId) => {
    return api.get(`/submissions/user/${userId}/recent`);
  },

  getUserStats: async (userId) => {
    return api.get(`/submissions/user/${userId}/stats`);
  },

  getUserSolvedProblems: async (userId) => {
    return api.get(`/submissions/user/${userId}/solved-problems`);
  },

  getLeaderboard: async (problemId, languageId) => {
    return api.get(`/submissions/leaderboard/problem/${problemId}/language/${languageId}`);
  },
};

// Contest API
export const contestAPI = {
  getAllContests: async () => {
    return api.get('/contests');
  },

  getContestById: async (id) => {
    return api.get(`/contests/${id}`);
  },

  getUpcomingContests: async () => {
    return api.get('/contests/upcoming');
  },

  getOngoingContests: async () => {
    return api.get('/contests/ongoing');
  },

  getAvailableContests: async () => {
    return api.get('/contests/available');
  },

  registerForContest: async (contestId, userId) => {
    return api.post(`/contests/${contestId}/register/${userId}`);
  },

  isUserRegistered: async (contestId, userId) => {
    return api.get(`/contests/${contestId}/registered/${userId}`);
  },

  getContestProblems: async (contestId) => {
    return api.get(`/contests/${contestId}/problems`);
  },

  getLeaderboard: async (contestId, page = 0, size = 20) => {
    return api.get(`/contests/${contestId}/leaderboard?page=${page}&size=${size}`);
  },

  getContestStats: async (contestId) => {
    return api.get(`/contests/${contestId}/stats`);
  },

  updateLeaderboardOnSubmission: async (contestId, userId, status) => {
    const params = new URLSearchParams({
      userId: userId.toString(),
      status: status,
    });
    return api.post(`/contests/${contestId}/submission-update?${params}`);
  },

  getUserParticipatedContests: async (userId) => {
    return api.get(`/contests/user/${userId}/participated`);
  },
};

// Admin API
export const adminAPI = {
  // User Management
  getAllUsers: async () => {
    return api.get('/admin/users');
  },

  makeUserAdmin: async (userId) => {
    return api.post(`/admin/users/${userId}/make-admin`);
  },

  removeUserAdmin: async (userId) => {
    return api.post(`/admin/users/${userId}/remove-admin`);
  },

  deleteUser: async (userId) => {
    return api.delete(`/admin/users/${userId}`);
  },

  createUser: async (userData) => {
    return api.post('/admin/users', userData);
  },

  // Problem Management
  createProblem: async (problemData) => {
    return api.post('/admin/problems', problemData);
  },

  updateProblem: async (problemId, problemData) => {
    return api.put(`/admin/problems/${problemId}`, problemData);
  },

  deleteProblem: async (problemId) => {
    return api.delete(`/admin/problems/${problemId}`);
  },

  // Contest Management
  getAllContests: async () => {
    return api.get('/admin/contests');
  },

  createContest: async (contestData) => {
    return api.post('/admin/contests', contestData);
  },

  updateContest: async (contestId, contestData) => {
    return api.put(`/admin/contests/${contestId}`, contestData);
  },

  deleteContest: async (contestId) => {
    return api.delete(`/admin/contests/${contestId}`);
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    return api.get('/admin/stats');
  },
};