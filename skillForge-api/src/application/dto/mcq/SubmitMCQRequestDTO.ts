import { z } from 'zod';

export const SubmitMCQRequestSchema = z.object({
  skillId: z.string().uuid('Invalid skill ID'),
  userId: z.string().uuid('Invalid user ID'),
  questionIds: z.array(z.string().uuid('Invalid question ID'))
    .min(1, 'At least one question is required')
    .max(100, 'Too many questions'),
  answers: z.array(z.number().int().min(0).max(3, 'Answer must be between 0 and 3'))
    .min(1, 'At least one answer is required')
    .max(100, 'Too many answers'),
  timeTaken: z.number()
    .int('Time must be an integer')
    .min(0, 'Time cannot be negative')
    .optional(),
}).refine((data) => data.questionIds.length === data.answers.length, {
  message: 'Number of questions and answers must match',
  path: ['answers'],
});

export type SubmitMCQRequestDTO = z.infer<typeof SubmitMCQRequestSchema>;
