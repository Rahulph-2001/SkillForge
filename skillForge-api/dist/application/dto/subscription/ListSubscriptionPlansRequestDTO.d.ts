import { z } from 'zod';
export declare const ListSubscriptionPlansRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ListSubscriptionPlansRequestDTO = z.infer<typeof ListSubscriptionPlansRequestSchema>;
//# sourceMappingURL=ListSubscriptionPlansRequestDTO.d.ts.map