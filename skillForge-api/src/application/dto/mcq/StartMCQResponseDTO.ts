import { z } from 'zod';

/**
 * Zod schema for MCQ Question DTO
 */
export const MCQQuestionDTOSchema = z.object({
  id: z.string().uuid('Invalid question ID'),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).min(2, 'At least 2 options required'),
  // No correctAnswer or explanation for security
});

export type MCQQuestionDTO = z.infer<typeof MCQQuestionDTOSchema>;

/**
 * Zod schema for Start MCQ Response DTO
 */
export const StartMCQResponseDTOSchema = z.object({
  skillId: z.string().uuid('Invalid skill ID'),
  templateId: z.string().uuid('Invalid template ID'),
  level: z.string().min(1, 'Level is required'),
  questions: z.array(MCQQuestionDTOSchema),
  totalQuestions: z.number().int().min(1, 'Total questions must be at least 1'),
  passingScore: z.number().min(0).max(100, 'Passing score must be between 0 and 100'),
});

export type StartMCQResponseDTO = z.infer<typeof StartMCQResponseDTOSchema>;
