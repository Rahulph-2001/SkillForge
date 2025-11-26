import { z } from 'zod';

export const AdminLoginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type AdminLoginDTO = z.infer<typeof AdminLoginSchema>;