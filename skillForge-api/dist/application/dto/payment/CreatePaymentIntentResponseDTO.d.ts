import { z } from 'zod';
export declare const CreatePaymentIntentResponseDTOSchema: z.ZodObject<{
    clientSecret: z.ZodString;
    paymentIntentId: z.ZodString;
    paymentId: z.ZodString;
}, z.core.$strip>;
export type CreatePaymentIntentResponseDTO = z.infer<typeof CreatePaymentIntentResponseDTOSchema>;
//# sourceMappingURL=CreatePaymentIntentResponseDTO.d.ts.map