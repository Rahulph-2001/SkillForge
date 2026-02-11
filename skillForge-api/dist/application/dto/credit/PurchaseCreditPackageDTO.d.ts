import { z } from 'zod';
export declare const PurchaseCreditPackageRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    packageId: z.ZodString;
    paymentIntentId: z.ZodString;
}, z.core.$strip>;
export type PurchaseCreditPackageRequestDTO = z.infer<typeof PurchaseCreditPackageRequestSchema>;
export declare const PurchaseCreditPackageResponseSchema: z.ZodObject<{
    transactionId: z.ZodString;
    creditsAdded: z.ZodNumber;
    newCreditBalance: z.ZodNumber;
    amountPaid: z.ZodNumber;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type PurchaseCreditPackageResponseDTO = z.infer<typeof PurchaseCreditPackageResponseSchema>;
//# sourceMappingURL=PurchaseCreditPackageDTO.d.ts.map