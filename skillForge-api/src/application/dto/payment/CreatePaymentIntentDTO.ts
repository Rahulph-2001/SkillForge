
import { z } from 'zod';
import { PaymentPurpose, Currency } from '../../../domain/enums/PaymentEnums';

export const CreatePaymentIntentDTOSchema = z.object({
    amount: z.number().min(1, 'Amount must be at least 1'),
    currency: z.nativeEnum(Currency).default(Currency.INR),
    purpose: z.nativeEnum(PaymentPurpose),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type CreatePaymentIntentDTO = z.infer<typeof CreatePaymentIntentDTOSchema>;