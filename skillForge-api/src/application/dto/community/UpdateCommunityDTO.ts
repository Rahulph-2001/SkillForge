import { z } from 'zod';

export const UpdateCommunitySchema = z.object({
  name: z.string()
    .min(3, 'Community name must be at least 3 characters')
    .max(100, 'Community name must not exceed 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional(),
  category: z.string()
    .min(2, 'Category is required')
    .max(50, 'Category must not exceed 50 characters')
    .trim()
    .optional(),
  creditsCost: z.number()
    .int('Credits must be an integer')
    .min(0, 'Credits cannot be negative')
    .optional(),
  creditsPeriod: z.string()
    .regex(/^\d+\s+(day|days|month|months)$/, 'Invalid period format (e.g., "30 days")')
    .optional(),
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  videoUrl: z.string()
    .url('Invalid video URL')
    .optional(),
});

export type UpdateCommunityDTO = z.infer<typeof UpdateCommunitySchema>;