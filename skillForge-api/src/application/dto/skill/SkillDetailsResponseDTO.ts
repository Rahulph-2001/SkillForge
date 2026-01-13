import { z } from 'zod';

/**
 * Zod schema for Skill Details DTO
 */
export const SkillDetailsDTOSchema = z.object({
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
    avatarUrl: z.string().url('Invalid avatar URL').nullable(),
    rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
    reviewCount: z.number().int().min(0, 'Review count must be non-negative'),
  }),
  availability: z.object({
    weeklySchedule: z.record(z.string(), z.object({
      enabled: z.boolean(),
      slots: z.array(z.object({
        start: z.string(),
        end: z.string(),
      })),
    })),
    blockedDates: z.array(z.object({
      date: z.coerce.date(),
      reason: z.string().optional(),
    })),
    timezone: z.string().min(1, 'Timezone is required'),
    bookedSlots: z.array(z.object({
      id: z.string().uuid('Invalid slot ID'),
      title: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
  }).nullable(),
});

export type SkillDetailsDTO = z.infer<typeof SkillDetailsDTOSchema>;
