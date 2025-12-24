import { z } from 'zod';

export const CreateSkillTemplateSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title too long')
    .trim(),
  category: z.string()
    .min(2, 'Category is required')
    .max(100, 'Category too long')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description too long')
    .trim(),
  creditsMin: z.number()
    .int('Must be an integer')
    .min(1, 'Minimum credits must be at least 1'),
  creditsMax: z.number()
    .int('Must be an integer')
    .min(1, 'Maximum credits must be at least 1'),
  mcqCount: z.number()
    .int('Must be an integer')
    .min(5, 'At least 5 questions required')
    .max(100, 'Maximum 100 questions allowed'),
  passRange: z.number()
    .int('Must be an integer')
    .min(1, 'Pass percentage must be at least 1')
    .max(100, 'Pass percentage cannot exceed 100')
    .default(70),
  levels: z.array(z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    message: 'Invalid level',
  }))
    .min(1, 'At least one level is required')
    .max(4, 'Maximum 4 levels allowed'),
  tags: z.array(z.string().min(1).max(50, 'Tag too long'))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  status: z.enum(['Active', 'Inactive'], {
    message: 'Invalid status',
  }).optional().default('Active'),
}).refine((data) => data.creditsMin <= data.creditsMax, {
  message: 'Minimum credits cannot be greater than maximum credits',
  path: ['creditsMax'],
});

export type CreateSkillTemplateDTO = z.infer<typeof CreateSkillTemplateSchema>;
