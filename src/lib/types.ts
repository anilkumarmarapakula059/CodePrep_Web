export type Difficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type UserRole = 'STUDENT' | 'PROFESSIONAL' | 'ADMIN';
export type ExecutionStatus =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR';

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
  executionTimeMs: number;
  errorMessage?: string;
}

export interface ExecutionResponse {
  status: ExecutionStatus;
  totalTestCases: number;
  passedTestCases: number;
  executionTimeMs: number;
  memoryKb: number;
  results: TestCaseResult[];
  compilationError?: string;
  passedAll: boolean;
}

export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  frequency: number;
  acceptanceRate: number;
  estimatedTimeMinutes: number;
  topics: string[];
  companies: string[];
  userStatus?: 'UNATTEMPTED' | 'ATTEMPTED' | 'SOLVED';
  isBookmarked?: boolean;
}

export interface AIMentorRequest {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language: string;
  mode: 'explain' | 'hint' | 'debug' | 'approach' | 'complexity';
  userMessage?: string;
}

export interface AIMentorResponse {
  mode: string;
  reply: string;
  followUpPrompt?: string;
}
