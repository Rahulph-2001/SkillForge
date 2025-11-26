import { z } from 'zod';

export const RegisterSchema = z.object({
  fullName: z.string()
    .min(2, { message: 'Full name must be at least 2 characters long' })
    .max(100, { message: 'Full name must not exceed 100 characters' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Full name can only contain letters and spaces' }),
  email: z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string()
    .min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;