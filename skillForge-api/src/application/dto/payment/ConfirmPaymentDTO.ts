import { z } from 'zod';
export const ConfirmPaymentDTOSchema = z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
});
export type ConfirmPaymentDTO = z.infer<typeof ConfirmPaymentDTOSchema>;