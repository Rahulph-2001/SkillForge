import { z } from 'zod';

export const UpdateTemplateQuestionSchema = z.object({
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    message: 'Invalid question level',
  }).optional(),
  question: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(1000, 'Question too long')
    .trim()
    .optional(),
  options: z.array(z.string().min(1, 'Option cannot be empty').max(500, 'Option too long'))
    .length(4, 'Exactly 4 options are required')
    .optional(),
  correctAnswer: z.number()
    .int('Must be an integer')
    .min(0, 'Correct answer must be between 0 and 3')
    .max(3, 'Correct answer must be between 0 and 3')
    .optional(),
  explanation: z.string()
    .max(1000, 'Explanation too long')
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateTemplateQuestionDTO = z.infer<typeof UpdateTemplateQuestionSchema>;
