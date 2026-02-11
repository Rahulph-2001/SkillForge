import { z } from 'zod';

export const ListUsersRequestDTOSchema = z.object({
  adminUserId: z.string().uuid(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});

export type ListUsersRequestDTO = z.infer<typeof ListUsersRequestDTOSchema>;