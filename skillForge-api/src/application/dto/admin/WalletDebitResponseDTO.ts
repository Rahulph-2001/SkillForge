import { z } from 'zod';

/**
 * Response DTO Schema for admin wallet debit operation
 */
export const WalletDebitResponseSchema = z.object({
    adminId: z.string().uuid(),
    previousBalance: z.number(),
    debitedAmount: z.number(),
    newBalance: z.number(),
    currency: z.string(),
    source: z.string(),
    referenceId: z.string(),
    timestamp: z.date(),
});

export type WalletDebitResponseDTO = z.infer<typeof WalletDebitResponseSchema>;
