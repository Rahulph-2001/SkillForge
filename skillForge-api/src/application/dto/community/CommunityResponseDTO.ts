import { z } from 'zod';

/**
 * Zod schema for Community Response DTO
 */
export const CommunityResponseDTOSchema = z.object({
  id: z.string().uuid('Invalid community ID'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL').nullable(),
  videoUrl: z.string().url('Invalid video URL').nullable(),
  adminId: z.string().uuid('Invalid admin ID'),
  creditsCost: z.number().min(0, 'Credits cost must be non-negative'),
  creditsPeriod: z.string().min(1, 'Credits period is required'),
  membersCount: z.number().int().min(0, 'Members count must be non-negative'),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isJoined: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

export type CommunityResponseDTO = z.infer<typeof CommunityResponseDTOSchema>;