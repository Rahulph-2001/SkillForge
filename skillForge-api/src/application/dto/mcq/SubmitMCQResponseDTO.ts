import { z } from 'zod';

/**
 * Zod schema for Submit MCQ Response DTO
 */
export const SubmitMCQResponseDTOSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
  score: z.number().min(0).max(100, 'Score must be between 0 and 100'),
  passed: z.boolean(),
  correctAnswers: z.number().int().min(0, 'Correct answers must be non-negative'),
  totalQuestions: z.number().int().min(1, 'Total questions must be at least 1'),
  passingScore: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
  details: z.array(z.object({
    questionId: z.string().uuid('Invalid question ID'),
    userAnswer: z.number().int().min(0, 'User answer must be non-negative'),
    correctAnswer: z.number().int().min(0, 'Correct answer must be non-negative'),
    isCorrect: z.boolean(),
    explanation: z.string().optional(),
  })),
});

export type SubmitMCQResponseDTO = z.infer<typeof SubmitMCQResponseDTOSchema>;
