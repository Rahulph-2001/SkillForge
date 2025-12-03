import api from './api';

export interface MCQQuestion {
  id: string;
  templateId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer?: number; // Only available after submission
  explanation?: string;
  isActive: boolean;
}

export interface MCQTestSession {
  skillId: string;
  templateId: string;
  level: string;
  questions: MCQQuestion[];
  totalQuestions: number;
  passingScore: number;
}

export interface MCQSubmission {
  skillId: string;
  questionIds: string[]; // Array of question IDs that were asked
  answers: number[]; // Array of selected option indices
  timeTaken?: number; // Optional, in seconds
}

export interface MCQResultDetail {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation?: string;
}

export interface MCQResult {
  attemptId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  passingScore: number;
  details: MCQResultDetail[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const mcqTestService = {
  // Start MCQ test for a skill
  startTest: async (skillId: string) => {
    return api.get<ApiResponse<MCQTestSession>>(`/mcq/start/${skillId}`);
  },

  // Submit MCQ test answers
  submitTest: async (submission: MCQSubmission) => {
    return api.post<ApiResponse<MCQResult>>('/mcq/submit', submission);
  },
};
