import { z } from 'zod';

export const GetCreditTransactionsRequestSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['CREDIT_PURCHASE', 'SESSION_PAYMENT', 'SESSION_EARNING', 'PROJECT_EARNING']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type GetCreditTransactionsRequestDTO = z.infer<typeof GetCreditTransactionsRequestSchema>;

export const CreditTransactionSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  amount: z.number(),
  credits: z.number().int().optional(),
  description: z.string().nullable(),
  status: z.enum(['COMPLETED', 'PENDING', 'FAILED']),
  createdAt: z.string(),
  metadata: z.record(z.string(), z.any()).nullable(),
});

export type CreditTransactionDTO = z.infer<typeof CreditTransactionSchema>;

export const GetCreditTransactionsResponseSchema = z.object({
  transactions: z.array(CreditTransactionSchema),
  pagination: z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
  }),
  stats: z.object({
    totalEarned: z.number().int().min(0),
    totalSpent: z.number().int().min(0),
    totalPurchased: z.number().int().min(0),
  }),
});

export type GetCreditTransactionsResponseDTO = z.infer<typeof GetCreditTransactionsResponseSchema>;