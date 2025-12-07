export interface MCQAttempt {
    id: string;
    skillId: string;
    userId: string;
    questionsAsked: string[];
    userAnswers: number[];
    score: number;
    passed: boolean;
    timeTaken?: number;
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
    questionIds: string[];
    answers: number[];
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
//# sourceMappingURL=MCQAttempt.d.ts.map