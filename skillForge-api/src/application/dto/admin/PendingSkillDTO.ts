import { z } from 'zod';

/**
 * Zod schema for Pending Skill DTO
 */
export const PendingSkillDTOSchema = z.object({
  id: z.string().uuid('Invalid skill ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  providerName: z.string().min(1, 'Provider name is required'),
  providerEmail: z.string().email('Invalid email address'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  durationHours: z.number().min(0, 'Duration must be non-negative'),
  creditsPerHour: z.number().min(0, 'Credits per hour must be non-negative'),
  tags: z.array(z.string()),
  imageUrl: z.string().url('Invalid image URL').nullable(),
  templateId: z.string().uuid('Invalid template ID').nullable(),
  status: z.string().min(1, 'Status is required'),
  verificationStatus: z.string().nullable(),
  mcqScore: z.number().min(0).max(100).nullable(),
  mcqTotalQuestions: z.number().int().min(0).nullable(),
  mcqPassingScore: z.number().min(0).max(100).nullable(),
  verifiedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PendingSkillDTO = z.infer<typeof PendingSkillDTOSchema>;
