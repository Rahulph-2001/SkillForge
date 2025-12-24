import { z } from 'zod';
/**
 * Response DTO Schema for admin wallet credit operation
 */
export declare const WalletCreditResponseSchema: z.ZodObject<{
    adminId: z.ZodString;
    previousBalance: z.ZodNumber;
    creditedAmount: z.ZodNumber;
    newBalance: z.ZodNumber;
    currency: z.ZodString;
    source: z.ZodString;
    referenceId: z.ZodString;
    timestamp: z.ZodDate;
}, z.core.$strip>;
export type WalletCreditResponseDTO = z.infer<typeof WalletCreditResponseSchema>;
//# sourceMappingURL=WalletCreditResponseDTO.d.ts.map