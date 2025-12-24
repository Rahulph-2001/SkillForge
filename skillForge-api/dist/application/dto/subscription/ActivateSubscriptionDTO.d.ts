import { z } from 'zod';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';
/**
 * Request DTO Schema for subscription activation
 */
export declare const ActivateSubscriptionRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    planId: z.ZodString;
    paymentId: z.ZodString;
    billingInterval: z.ZodDefault<z.ZodEnum<typeof BillingInterval>>;
}, z.core.$strip>;
export type ActivateSubscriptionRequestDTO = z.infer<typeof ActivateSubscriptionRequestSchema>;
//# sourceMappingURL=ActivateSubscriptionDTO.d.ts.map