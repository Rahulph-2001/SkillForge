import { z } from 'zod';
/**
 * Response DTO Schema for admin wallet debit operation
 */
export declare const WalletDebitResponseSchema: z.ZodObject<{
    adminId: z.ZodString;
    previousBalance: z.ZodNumber;
    debitedAmount: z.ZodNumber;
    newBalance: z.ZodNumber;
    currency: z.ZodString;
    source: z.ZodString;
    referenceId: z.ZodString;
    timestamp: z.ZodDate;
}, z.core.$strip>;
export type WalletDebitResponseDTO = z.infer<typeof WalletDebitResponseSchema>;
//# sourceMappingURL=WalletDebitResponseDTO.d.ts.map