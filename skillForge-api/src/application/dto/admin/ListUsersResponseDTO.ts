import { z } from 'zod';
import { UserAdminDTOSchema } from './UserAdminDTO'; 

export const PaginationMetadataSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const ListUsersResponseDTOSchema = z.object({
  users: z.array(UserAdminDTOSchema),
  pagination: PaginationMetadataSchema,
});

export type ListUsersResponseDTO = z.infer<typeof ListUsersResponseDTOSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;