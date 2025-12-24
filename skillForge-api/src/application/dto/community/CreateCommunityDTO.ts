import { z } from 'zod';

export const CreateCommunitySchema = z.object({
  name: z.string()
    .min(3, 'Community name must be at least 3 characters')
    .max(100, 'Community name must not exceed 100 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  category: z.string()
    .min(2, 'Category is required')
    .max(50, 'Category must not exceed 50 characters')
    .trim(),
  creditsCost: z.number()
    .int('Credits must be an integer')
    .min(0, 'Credits cannot be negative')
    .optional()
    .default(0),
  creditsPeriod: z.string()
    .regex(/^\d+\s+(day|days|month|months)$/, 'Invalid period format (e.g., "30 days")')
    .optional()
    .default('30 days'),
});

export type CreateCommunityDTO = z.infer<typeof CreateCommunitySchema>;