import { z } from 'zod';

/**
 * Zod schema for Skill Response DTO
 */
export const SkillResponseDTOSchema = z.object({
  id: z.string().uuid('Invalid skill ID'),
  providerId: z.string().uuid('Invalid provider ID'),
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
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SkillResponseDTO = z.infer<typeof SkillResponseDTOSchema>;
