import { z } from 'zod';

/**
 * Zod schema for User Admin DTO
 */
export const UserAdminDTOSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  credits: z.number().int().min(0, 'Credits must be non-negative'),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  emailVerified: z.boolean(),
  avatarUrl: z.string().url('Invalid avatar URL').nullable(),
});

export type UserAdminDTO = z.infer<typeof UserAdminDTOSchema>;
