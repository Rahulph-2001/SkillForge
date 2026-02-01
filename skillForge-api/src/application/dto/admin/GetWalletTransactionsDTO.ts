
import { z } from 'zod';

export const WalletTransactionSchema = z.object({
    id: z.string(),
    transactionId: z.string(),
    userId: z.string(),
    userName: z.string(),
    userEmail: z.string(),
    type: z.enum(['CREDIT', 'WITHDRAWAL', 'DEBIT']),
    amount: z.number(),
    description: z.string(),
    date: z.date(),
    status: z.enum(['COMPLETED', 'PENDING', 'FAILED']),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const GetWalletTransactionsResponseSchema = z.object({
    transactions: z.array(WalletTransactionSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export type WalletTransactionDTO = z.infer<typeof WalletTransactionSchema>;
export type GetWalletTransactionsResponseDTO = z.infer<typeof GetWalletTransactionsResponseSchema>;