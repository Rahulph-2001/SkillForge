export interface MCQAttempt {
  id: string;
  skillId: string;
  userId: string;
  questionsAsked: string[]; // Array of question IDs
  userAnswers: number[]; // Array of selected option indices
  score: number; // Percentage score
  passed: boolean;
  timeTaken?: number; // Seconds
  attemptedAt: Date;
}

export interface MCQQuestion {
  id: string;
  templateId: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: number;
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
  userId: string;
  questionIds: string[]; // IDs of questions that were asked
  answers: number[]; // User's selected answers
  timeTaken?: number;
}

export interface MCQResult {
  attemptId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  passingScore: number;
  details: {
    questionId: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation?: string;
  }[];
}
