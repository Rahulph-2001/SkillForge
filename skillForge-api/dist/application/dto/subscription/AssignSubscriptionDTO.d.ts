import { z } from 'zod';
import { BillingInterval } from '../../../domain/enums/SubscriptionEnums';
export declare const AssignSubscriptionSchema: z.ZodObject<{
    userId: z.ZodString;
    planId: z.ZodString;
    billingInterval: z.ZodDefault<z.ZodEnum<typeof BillingInterval>>;
    startTrial: z.ZodDefault<z.ZodBoolean>;
    stripeCustomerId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AssignSubscriptionDTO = z.infer<typeof AssignSubscriptionSchema>;
//# sourceMappingURL=AssignSubscriptionDTO.d.ts.map