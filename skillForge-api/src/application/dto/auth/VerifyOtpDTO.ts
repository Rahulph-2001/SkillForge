import { z } from 'zod';

export const VerifyOtpSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  otpCode: z.string().length(6, 'OTP must be 6 digits long').regex(/^\d+$/, 'OTP must be numeric')
});

export type VerifyOtpDTO = z.infer<typeof VerifyOtpSchema>;