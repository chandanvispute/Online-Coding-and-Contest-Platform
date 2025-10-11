// User types
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Problem types
export interface Problem {
  id: number;
  title: string;
  description: string;
  constraints: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemListDTO {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptanceRate: number;
}

export interface ProblemDetailDTO {
  id: number;
  title: string;
  description: string;
  constraints: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  boilerplates: { [key: number]: string };
}

export interface TestCase {
  input: string;
  description: string;
}

// Language types
export interface Language {
  id: number;
  name: string;
  extension: string;
  compileCommand: string;
  runCommand: string;
}

// Submission types
export interface SubmissionRequest {
  problemId: number;
  languageId: number;
  userId: number;
  code: string;
}

export interface SubmissionResponse {
  submissionId: number;
  status: string;
  output: string;
  error: string;
  executionTime: number;
  memoryUsed: number;
  testCaseFailed: string;
}

export interface Submission {
  id: number;
  code: string;
  status: string;
  output: string;
  error: string;
  executionTime: number;
  memoryUsed: number;
  submittedAt: string;
  user: User;
  problem: Problem;
  language: Language;
}

// Contest types
export interface Contest {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  createdBy: User;
  problems: Problem[];
  participants: User[];
}

export interface ContestCreateRequest {
  name: string;
  startTime: string;
  endTime: string;
  createdBy: number;
  problemIds: number[];
}

// Admin types
export interface ProblemCreateRequest {
  title: string;
  description: string;
  constraints: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  expectedOutputs: string[];
  createdBy: number;
  boilerplates: { [key: number]: string };
}

export interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalSubmissions: number;
  totalContests: number;
  problemsByDifficulty: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  submissionsByStatus: {
    [key: string]: number;
  };
}