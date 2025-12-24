import { z } from 'zod';
import { UserResponseDTOSchema } from './UserResponseDTO';

/**
 * Zod schema for Verify OTP Response DTO
 */
export const VerifyOtpResponseDTOSchema = z.object({
  user: UserResponseDTOSchema,
  token: z.string().min(1, 'Token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  message: z.string().min(1, 'Message is required'),
});

export type VerifyOtpResponseDTO = z.infer<typeof VerifyOtpResponseDTOSchema>;
