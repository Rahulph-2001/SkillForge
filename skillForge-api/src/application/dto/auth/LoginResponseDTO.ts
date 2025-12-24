import { z } from 'zod';
import { UserResponseDTOSchema } from './UserResponseDTO';

/**
 * Zod schema for Login Response DTO
 */
export const LoginResponseDTOSchema = z.object({
  user: UserResponseDTOSchema,
  token: z.string().min(1, 'Token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type LoginResponseDTO = z.infer<typeof LoginResponseDTOSchema>;
