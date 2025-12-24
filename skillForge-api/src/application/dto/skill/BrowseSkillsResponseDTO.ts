import { z } from 'zod';

/**
 * Zod schema for Browse Skill DTO
 */
export const BrowseSkillDTOSchema = z.object({
  id: z.string().uuid('Invalid skill ID'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  durationHours: z.number().min(0, 'Duration must be non-negative'),
  creditsPerHour: z.number().min(0, 'Credits per hour must be non-negative'),
  imageUrl: z.string().url('Invalid image URL').nullable(),
  tags: z.array(z.string()),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  totalSessions: z.number().int().min(0, 'Total sessions must be non-negative'),
  provider: z.object({
    id: z.string().uuid('Invalid provider ID'),
    name: z.string().min(1, 'Provider name is required'),
    email: z.string().email('Invalid email address'),
  }),
  availableDays: z.array(z.string()),
});

export type BrowseSkillDTO = z.infer<typeof BrowseSkillDTOSchema>;

/**
 * Zod schema for Browse Skills Response DTO
 */
export const BrowseSkillsResponseDTOSchema = z.object({
  skills: z.array(BrowseSkillDTOSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
  page: z.number().int().min(1, 'Page must be at least 1'),
  limit: z.number().int().min(1, 'Limit must be at least 1'),
  totalPages: z.number().int().min(0, 'Total pages must be non-negative'),
});

export type BrowseSkillsResponseDTO = z.infer<typeof BrowseSkillsResponseDTOSchema>;
