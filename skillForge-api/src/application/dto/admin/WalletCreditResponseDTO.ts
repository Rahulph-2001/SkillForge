import { z } from 'zod';

/**
 * Response DTO Schema for admin wallet credit operation
 */
export const WalletCreditResponseSchema = z.object({
    adminId: z.string().uuid(),
    previousBalance: z.number(),
    creditedAmount: z.number(),
    newBalance: z.number(),
    currency: z.string(),
    source: z.string(),
    referenceId: z.string(),
    timestamp: z.date(),
});

export type WalletCreditResponseDTO = z.infer<typeof WalletCreditResponseSchema>;
