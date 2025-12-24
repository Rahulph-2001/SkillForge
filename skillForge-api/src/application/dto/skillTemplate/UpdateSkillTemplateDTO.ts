import { z } from 'zod';

export const UpdateSkillTemplateSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title too long')
    .trim()
    .optional(),
  category: z.string()
    .min(2, 'Category is required')
    .max(100, 'Category too long')
    .trim()
    .optional(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description too long')
    .trim()
    .optional(),
  creditsMin: z.number()
    .int('Must be an integer')
    .min(1, 'Minimum credits must be at least 1')
    .optional(),
  creditsMax: z.number()
    .int('Must be an integer')
    .min(1, 'Maximum credits must be at least 1')
    .optional(),
  mcqCount: z.number()
    .int('Must be an integer')
    .min(5, 'At least 5 questions required')
    .max(100, 'Maximum 100 questions allowed')
    .optional(),
  passRange: z.number()
    .int('Must be an integer')
    .min(1, 'Pass percentage must be at least 1')
    .max(100, 'Pass percentage cannot exceed 100')
    .optional(),
  levels: z.array(z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']))
    .min(1, 'At least one level is required')
    .max(4, 'Maximum 4 levels allowed')
    .optional(),
  tags: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  status: z.enum(['Active', 'Inactive']).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => {
  if (data.creditsMin !== undefined && data.creditsMax !== undefined) {
    return data.creditsMin <= data.creditsMax;
  }
  return true;
}, {
  message: 'Minimum credits cannot be greater than maximum credits',
  path: ['creditsMax'],
});

export type UpdateSkillTemplateDTO = z.infer<typeof UpdateSkillTemplateSchema>;
