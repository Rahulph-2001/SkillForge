import { z } from 'zod';
/**
 * Request DTO Schema for debiting admin wallet
 */
export declare const DebitAdminWalletRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
    source: z.ZodString;
    referenceId: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type DebitAdminWalletRequestDTO = z.infer<typeof DebitAdminWalletRequestSchema>;
//# sourceMappingURL=DebitAdminWalletDTO.d.ts.map