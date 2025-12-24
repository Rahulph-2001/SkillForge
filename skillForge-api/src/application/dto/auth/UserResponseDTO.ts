import { z } from 'zod';

/**
 * Zod schema for User Response DTO
 */
export const UserResponseDTOSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  credits: z.number().int().min(0, 'Credits must be non-negative'),
  verification: z.object({
    email_verified: z.boolean(),
  }),
  subscriptionPlan: z.string().min(1, 'Subscription plan is required'),
  avatarUrl: z.string().url('Invalid avatar URL').nullable(),
});

export type UserResponseDTO = z.infer<typeof UserResponseDTOSchema>;