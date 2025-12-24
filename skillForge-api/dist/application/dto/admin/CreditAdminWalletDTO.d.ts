import { z } from 'zod';
/**
 * Request DTO Schema for crediting admin wallet
 */
export declare const CreditAdminWalletRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
    source: z.ZodString;
    referenceId: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type CreditAdminWalletRequestDTO = z.infer<typeof CreditAdminWalletRequestSchema>;
//# sourceMappingURL=CreditAdminWalletDTO.d.ts.map