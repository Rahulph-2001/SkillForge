import { z } from 'zod';

export const CreateProjectApplicationSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  coverLetter: z.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(5000, 'Cover letter must not exceed 5000 characters')
    .trim(),
  proposedBudget: z.number().positive('Budget must be positive').optional(),
  proposedDuration: z.string().max(100).optional(),
});

export type CreateProjectApplicationDTO = z.infer<typeof CreateProjectApplicationSchema>;