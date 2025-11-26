import { z } from 'zod';

export const VerifyForgotPasswordOtpSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  otpCode: z.string().length(6, 'OTP code must be 6 digits'),
});

export type VerifyForgotPasswordOtpDTO = z.infer<typeof VerifyForgotPasswordOtpSchema>;

