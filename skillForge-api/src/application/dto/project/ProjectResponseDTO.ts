import { z } from 'zod';

/**
 * Zod schema for Project Response DTO
 */
export const ProjectResponseDTOSchema = z.object({
  id: z.string().uuid('Invalid project ID'),
  clientId: z.string().uuid('Invalid client ID'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  budget: z.number().nonnegative('Budget must be non-negative'),
  duration: z.string().min(1, 'Duration is required'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').nullable().optional(),
  status: z.enum(['Open', 'In_Progress', 'Completed', 'Cancelled']),
  paymentId: z.string().uuid('Invalid payment ID').nullable().optional(),
  applicationsCount: z.number().int().nonnegative('Applications count must be non-negative'),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  // Client information (optional, populated when needed)
  client: z.object({
    name: z.string(),
    avatar: z.string().nullable().optional(),
    rating: z.number().nullable().optional(),
    isVerified: z.boolean().optional(),
  }).optional(),
  // Accepted Contributor information (optional)
  acceptedContributor: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }).optional(),
});

export type ProjectResponseDTO = z.infer<typeof ProjectResponseDTOSchema>;

