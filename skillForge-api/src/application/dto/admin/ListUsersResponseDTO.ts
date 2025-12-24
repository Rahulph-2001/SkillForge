import { z } from 'zod';
import { UserAdminDTOSchema } from './UserAdminDTO';

/**
 * Zod schema for List Users Response DTO
 */
export const ListUsersResponseDTOSchema = z.object({
  users: z.array(UserAdminDTOSchema),
  total: z.number().int().min(0, 'Total must be non-negative'),
});

export type ListUsersResponseDTO = z.infer<typeof ListUsersResponseDTOSchema>;
