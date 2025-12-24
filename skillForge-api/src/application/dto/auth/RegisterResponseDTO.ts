import { z } from 'zod';

/**
 * Zod schema for Register Response DTO
 */
export const RegisterResponseDTOSchema = z.object({
  email: z.string().email('Invalid email address'),
  expiresAt: z.string().min(1, 'Expiration date is required'),
  message: z.string().min(1, 'Message is required'),
});

export type RegisterResponseDTO = z.infer<typeof RegisterResponseDTOSchema>;
