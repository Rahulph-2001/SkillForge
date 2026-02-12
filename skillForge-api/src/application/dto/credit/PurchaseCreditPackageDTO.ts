import { z } from 'zod';

// Schema for the complete request (used by use case)
export const PurchaseCreditPackageRequestSchema = z.object({
  userId: z.string().uuid(),
  packageId: z.string().uuid(),
  paymentIntentId: z.string(),
});

// Schema for body validation (userId comes from auth middleware)
export const PurchaseCreditPackageBodySchema = z.object({
  packageId: z.string().uuid(),
  paymentIntentId: z.string(),
});

export type PurchaseCreditPackageRequestDTO = z.infer<typeof PurchaseCreditPackageRequestSchema>;

export const PurchaseCreditPackageResponseSchema = z.object({
  transactionId: z.string().uuid(),
  creditsAdded: z.number().int().positive(),
  newCreditBalance: z.number().int().min(0),
  amountPaid: z.number().positive(),
  status: z.enum(['COMPLETED', 'PENDING', 'FAILED']),
  createdAt: z.coerce.date(),
});

export type PurchaseCreditPackageResponseDTO = z.infer<typeof PurchaseCreditPackageResponseSchema>;