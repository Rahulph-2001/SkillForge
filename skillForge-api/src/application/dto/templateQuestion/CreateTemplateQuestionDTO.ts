import { z } from 'zod';

export const CreateTemplateQuestionSchema = z.object({
  templateId: z.string().uuid('Invalid template ID'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    message: 'Invalid question level',
  }),
  question: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(1000, 'Question too long')
    .trim(),
  options: z.array(z.string().min(1, 'Option cannot be empty').max(500, 'Option too long'))
    .length(4, 'Exactly 4 options are required'),
  correctAnswer: z.number()
    .int('Must be an integer')
    .min(0, 'Correct answer must be between 0 and 3')
    .max(3, 'Correct answer must be between 0 and 3'),
  explanation: z.string()
    .max(1000, 'Explanation too long')
    .trim()
    .optional(),
  isActive: z.boolean()
    .optional()
    .default(true),
});

export type CreateTemplateQuestionDTO = z.infer<typeof CreateTemplateQuestionSchema>;
