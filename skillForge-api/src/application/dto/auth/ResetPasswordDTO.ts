import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  otpCode: z.string().length(6, 'OTP code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

