import { z } from 'zod';
export declare const CreateCreditPackageSchema: z.ZodObject<{
    credits: z.ZodNumber;
    price: z.ZodNumber;
    isPopular: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateCreditPackageDTO = z.infer<typeof CreateCreditPackageSchema>;
export declare const UpdateCreditPackageSchema: z.ZodObject<{
    credits: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    isPopular: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateCreditPackageDTO = z.infer<typeof UpdateCreditPackageSchema>;
export declare const CreditPackageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    credits: z.ZodNumber;
    price: z.ZodNumber;
    isPopular: z.ZodBoolean;
    isActive: z.ZodBoolean;
    discount: z.ZodNumber;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type CreditPackageResponseDTO = z.infer<typeof CreditPackageResponseSchema>;
//# sourceMappingURL=CreditPackageDTO.d.ts.map