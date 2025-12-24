import { z } from 'zod';
import { PaymentPurpose, Currency } from '../../../domain/enums/PaymentEnums';
export declare const CreatePaymentIntentDTOSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodEnum<typeof Currency>>;
    purpose: z.ZodEnum<typeof PaymentPurpose>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type CreatePaymentIntentDTO = z.infer<typeof CreatePaymentIntentDTOSchema>;
//# sourceMappingURL=CreatePaymentIntentDTO.d.ts.map