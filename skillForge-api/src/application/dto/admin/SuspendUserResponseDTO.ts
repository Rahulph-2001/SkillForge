import { z } from 'zod';

/**
 * Zod schema for Suspend User Response DTO
 */
export const SuspendUserResponseDTOSchema = z.object({
  success: z.boolean(),
  message: z.string().min(1, 'Message is required'),
});

export type SuspendUserResponseDTO = z.infer<typeof SuspendUserResponseDTOSchema>;
