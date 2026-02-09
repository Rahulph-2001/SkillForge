import { z } from 'zod';

// Create DTO
export const CreateCreditPackageSchema = z.object({
  credits: z.number().int().min(1, 'Credits must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative'),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  // discount field deliberately excluded from schema as per requirements
});

export type CreateCreditPackageDTO = z.infer<typeof CreateCreditPackageSchema>;

// Update DTO
export const UpdateCreditPackageSchema = z.object({
  credits: z.number().int().min(1).optional(),
  price: z.number().min(0).optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // discount: z.number().min(0).max(100).optional(), // Can verify later if needed
});

export type UpdateCreditPackageDTO = z.infer<typeof UpdateCreditPackageSchema>;

// Response DTO
export const CreditPackageResponseSchema = z.object({
  id: z.string().uuid(),
  credits: z.number(),
  price: z.number(),
  isPopular: z.boolean(),
  isActive: z.boolean(),
  discount: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreditPackageResponseDTO = z.infer<typeof CreditPackageResponseSchema>;
