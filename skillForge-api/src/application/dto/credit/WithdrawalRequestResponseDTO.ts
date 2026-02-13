import { z } from 'zod';
import { WithdrawalStatus } from '../../../domain/entities/WithdrawalRequest';

export const WithdrawalRequestResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    amount: z.number(),
    currency: z.string(),
    status: z.nativeEnum(WithdrawalStatus),
    bankDetails: z.record(z.string(), z.any()),
    adminNote: z.string().nullable(),
    processedBy: z.string().nullable(),
    processedAt: z.coerce.date().nullable(),
    transactionId: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    // Optional user details for admin view
    user: z.object({
        name: z.string(),
        email: z.string(),
        avatarUrl: z.string().nullable(),
    }).optional(),
});

export type WithdrawalRequestResponseDTO = z.infer<typeof WithdrawalRequestResponseSchema>;
