import { z } from 'zod';

export const CreatePaymentIntentResponseDTOSchema = z.object({
    clientSecret: z.string().min(1, 'Client secret is required'),
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
    paymentId: z.string().uuid('Invalid payment ID'),
});

export type CreatePaymentIntentResponseDTO = z.infer<typeof CreatePaymentIntentResponseDTOSchema>;