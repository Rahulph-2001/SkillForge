import { z } from 'zod';

export const ListUsersRequestSchema = z.object({
  adminUserId: z.string().uuid('Invalid admin user ID'),
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
  search: z.string()
    .max(255, 'Search query too long')
    .trim()
    .optional(),
  role: z.enum(['user', 'admin'], {
    message: 'Invalid role',
  }).optional(),
  isActive: z.boolean().optional(),
});

export type ListUsersRequestDTO = z.infer<typeof ListUsersRequestSchema>;
