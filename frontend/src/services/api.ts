import axios from 'axios';
import {
  User,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  Problem,
  ProblemListDTO,
  ProblemDetailDTO,
  Language,
  SubmissionRequest,
  SubmissionResponse,
  Submission,
  Contest,
  ContestCreateRequest,
  ProblemCreateRequest,
  DashboardStats
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (data: LoginRequest): Promise<UserResponse> =>
    api.post('/api/users/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<UserResponse> =>
    api.post('/api/users/register', data).then(res => res.data),
  
  getUser: (id: number): Promise<UserResponse> =>
    api.get(`/api/users/${id}`).then(res => res.data),
  
  getUserByUsername: (username: string): Promise<UserResponse> =>
    api.get(`/api/users/username/${username}`).then(res => res.data),
};

// Problems API
export const problemsAPI = {
  getAll: (): Promise<ProblemListDTO[]> =>
    api.get('/api/problems').then(res => res.data),
  
  getById: (id: number): Promise<ProblemDetailDTO> =>
    api.get(`/api/problems/${id}`).then(res => res.data),
  
  getByDifficulty: (difficulty: string): Promise<ProblemListDTO[]> =>
    api.get(`/api/problems/difficulty/${difficulty}`).then(res => res.data),
};

// Languages API
export const languagesAPI = {
  getAll: (): Promise<Language[]> =>
    api.get('/api/languages').then(res => res.data),
};

// Submissions API
export const submissionsAPI = {
  submit: (data: SubmissionRequest): Promise<SubmissionResponse> =>
    api.post('/api/submissions/submit', data).then(res => res.data),
  
  getUserSubmissions: (userId: number, problemId: number): Promise<Submission[]> =>
    api.get(`/api/submissions/user/${userId}/problem/${problemId}`).then(res => res.data),
  
  getLeaderboard: (problemId: number, languageId: number): Promise<Submission[]> =>
    api.get(`/api/submissions/leaderboard/problem/${problemId}/language/${languageId}`).then(res => res.data),
};

// Contests API
export const contestsAPI = {
  getAll: (): Promise<Contest[]> =>
    api.get('/api/contests').then(res => res.data),
  
  getById: (id: number): Promise<Contest> =>
    api.get(`/api/contests/${id}`).then(res => res.data),
  
  getActive: (): Promise<Contest[]> =>
    api.get('/api/contests/active').then(res => res.data),
  
  getUpcoming: (): Promise<Contest[]> =>
    api.get('/api/contests/upcoming').then(res => res.data),
  
  register: (contestId: number, userId: number): Promise<void> =>
    api.post(`/api/contests/${contestId}/register/${userId}`).then(res => res.data),
  
  getLeaderboard: (contestId: number): Promise<any[]> =>
    api.get(`/api/contests/${contestId}/leaderboard`).then(res => res.data),
  
  create: (data: ContestCreateRequest): Promise<Contest> =>
    api.post('/api/contests', data).then(res => res.data),
};

// Admin API
export const adminAPI = {
  // Problem management
  createProblem: (data: ProblemCreateRequest): Promise<ProblemDetailDTO> =>
    api.post('/api/admin/problems', data).then(res => res.data),
  
  updateProblem: (id: number, data: ProblemCreateRequest): Promise<ProblemDetailDTO> =>
    api.put(`/api/admin/problems/${id}`, data).then(res => res.data),
  
  deleteProblem: (id: number): Promise<void> =>
    api.delete(`/api/admin/problems/${id}`).then(res => res.data),
  
  // User management
  getAllUsers: (): Promise<UserResponse[]> =>
    api.get('/api/admin/users').then(res => res.data),
  
  makeUserAdmin: (userId: number): Promise<UserResponse> =>
    api.post(`/api/admin/users/${userId}/make-admin`).then(res => res.data),
  
  removeUserAdmin: (userId: number): Promise<UserResponse> =>
    api.post(`/api/admin/users/${userId}/remove-admin`).then(res => res.data),
  
  deleteUser: (userId: number): Promise<void> =>
    api.delete(`/api/admin/users/${userId}`).then(res => res.data),
  
  // Dashboard stats
  getDashboardStats: (): Promise<DashboardStats> =>
    api.get('/api/admin/stats').then(res => res.data),
};

export default api;