import { z } from 'zod';

export const UserCreditPackageSchema = z.object({
  id: z.string().uuid(),
  credits: z.number().int().positive(),
  price: z.number().positive(),
  isPopular: z.boolean(),
  discount: z.number().int().min(0).max(100),
  finalPrice: z.number().positive(),
  savingsAmount: z.number().min(0),
});

export type UserCreditPackageDTO = z.infer<typeof UserCreditPackageSchema>;

export const GetUserCreditPackagesResponseSchema = z.object({
  packages: z.array(UserCreditPackageSchema),
});

export type GetUserCreditPackagesResponseDTO = z.infer<typeof GetUserCreditPackagesResponseSchema>;