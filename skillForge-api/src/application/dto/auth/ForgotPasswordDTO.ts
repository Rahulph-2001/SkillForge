import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordSchema>;

