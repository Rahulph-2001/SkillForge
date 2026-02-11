import { z } from 'zod';
export declare const UserCreditPackageSchema: z.ZodObject<{
    id: z.ZodString;
    credits: z.ZodNumber;
    price: z.ZodNumber;
    isPopular: z.ZodBoolean;
    discount: z.ZodNumber;
    finalPrice: z.ZodNumber;
    savingsAmount: z.ZodNumber;
}, z.core.$strip>;
export type UserCreditPackageDTO = z.infer<typeof UserCreditPackageSchema>;
export declare const GetUserCreditPackagesResponseSchema: z.ZodObject<{
    packages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        credits: z.ZodNumber;
        price: z.ZodNumber;
        isPopular: z.ZodBoolean;
        discount: z.ZodNumber;
        finalPrice: z.ZodNumber;
        savingsAmount: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GetUserCreditPackagesResponseDTO = z.infer<typeof GetUserCreditPackagesResponseSchema>;
//# sourceMappingURL=GetUserCreditPackagesDTO.d.ts.map