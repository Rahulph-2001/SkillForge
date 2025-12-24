import { z } from 'zod';

/**
 * Request DTO Schema for crediting admin wallet
 */
export const CreditAdminWalletRequestSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3, 'Currency must be 3 characters'),
    source: z.string().min(1, 'Source is required'),
    referenceId: z.string().min(1, 'Reference ID is required'),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type CreditAdminWalletRequestDTO = z.infer<typeof CreditAdminWalletRequestSchema>;

