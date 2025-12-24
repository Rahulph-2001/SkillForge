import { z } from 'zod';
import { PaymentProvider, PaymentStatus, PaymentPurpose, Currency } from '../../../domain/enums/PaymentEnums';
export declare const PaymentResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    provider: z.ZodEnum<typeof PaymentProvider>;
    providerPaymentId: z.ZodOptional<z.ZodString>;
    providerCustomerId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    currency: z.ZodEnum<typeof Currency>;
    purpose: z.ZodEnum<typeof PaymentPurpose>;
    status: z.ZodEnum<typeof PaymentStatus>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    failureReason: z.ZodOptional<z.ZodString>;
    refundedAmount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type PaymentResponseDTO = z.infer<typeof PaymentResponseDTOSchema>;
//# sourceMappingURL=PaymentResponseDTO.d.ts.map