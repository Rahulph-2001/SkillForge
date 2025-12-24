// src/application/dto/payment/PaymentResponseDTO.ts
import { z } from 'zod';
import { PaymentProvider, PaymentStatus, PaymentPurpose, Currency } from '../../../domain/enums/PaymentEnums';

export const PaymentResponseDTOSchema = z.object({
    id: z.string().uuid('Invalid payment ID'),
    userId: z.string().uuid('Invalid user ID'),
    provider: z.nativeEnum(PaymentProvider),
    providerPaymentId: z.string().optional(),
    providerCustomerId: z.string().optional(),
    amount: z.number().min(0, 'Amount must be non-negative'),
    currency: z.nativeEnum(Currency),
    purpose: z.nativeEnum(PaymentPurpose),
    status: z.nativeEnum(PaymentStatus),
    metadata: z.record(z.string(), z.any()).optional(),
    failureReason: z.string().optional(),
    refundedAmount: z.number().min(0).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type PaymentResponseDTO = z.infer<typeof PaymentResponseDTOSchema>;