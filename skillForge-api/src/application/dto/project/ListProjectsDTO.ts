import { z } from 'zod';

export const ListProjectsRequestSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Open', 'In_Progress', 'Completed', 'Cancelled']).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

export type ListProjectsRequestDTO = z.infer<typeof ListProjectsRequestSchema>;

export const ListProjectsResponseSchema = z.object({
  projects: z.array(z.any()), // Will use ProjectResponseDTO
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

export type ListProjectsResponseDTO = z.infer<typeof ListProjectsResponseSchema>;

