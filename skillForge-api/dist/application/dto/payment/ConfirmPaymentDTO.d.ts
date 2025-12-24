import { z } from 'zod';
export declare const ConfirmPaymentDTOSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
}, z.core.$strip>;
export type ConfirmPaymentDTO = z.infer<typeof ConfirmPaymentDTOSchema>;
//# sourceMappingURL=ConfirmPaymentDTO.d.ts.map