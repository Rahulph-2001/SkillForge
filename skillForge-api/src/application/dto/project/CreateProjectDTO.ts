import { z } from 'zod';

export const CreateProjectRequestSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must not exceed 5000 characters')
    .trim(),
  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category must not exceed 100 characters'),
  tags: z.array(z.string().min(1).max(50))
    .min(0, 'Tags cannot be empty array')
    .max(20, 'Maximum 20 tags allowed')
    .optional()
    .default([]),
  budget: z.number()
    .positive('Budget must be a positive number')
    .max(10000000, 'Budget is too large'),
  duration: z.string()
    .min(1, 'Duration is required')
    .max(100, 'Duration must not exceed 100 characters'),
  deadline: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be in YYYY-MM-DD format')
    .optional()
    .nullable(),
});

export type CreateProjectRequestDTO = z.infer<typeof CreateProjectRequestSchema>;

