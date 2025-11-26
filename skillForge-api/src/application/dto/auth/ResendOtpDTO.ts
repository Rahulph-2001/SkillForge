import { z } from 'zod';

export const ResendOtpSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
});

export type ResendOtpDTO = z.infer<typeof ResendOtpSchema>;