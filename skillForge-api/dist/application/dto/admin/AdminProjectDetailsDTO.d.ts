import { z } from 'zod';
export declare const AdminProjectDetailsRequestDTOSchema: z.ZodObject<{
    projectId: z.ZodString;
}, z.core.$strip>;
export type AdminProjectDetailsRequestDTO = z.infer<typeof AdminProjectDetailsRequestDTOSchema>;
export declare const AdminProjectDetailsDTOSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    budget: z.ZodNumber;
    duration: z.ZodString;
    deadline: z.ZodNullable<z.ZodString>;
    status: z.ZodString;
    applicationsCount: z.ZodNumber;
    isSuspended: z.ZodBoolean;
    suspendedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    suspendReason: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    creator: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
        rating: z.ZodNumber;
    }, z.core.$strip>;
    contributor: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        avatarUrl: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    escrow: z.ZodNullable<z.ZodObject<{
        amountHeld: z.ZodNumber;
        status: z.ZodString;
        releaseTo: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AdminProjectDetailsDTO = z.infer<typeof AdminProjectDetailsDTOSchema>;
//# sourceMappingURL=AdminProjectDetailsDTO.d.ts.map