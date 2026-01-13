import { z } from 'zod';
export declare const CreateAdminWalletRequestSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
    source: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type CreateAdminWalletRequestDTO = z.infer<typeof CreateAdminWalletRequestSchema>;
//# sourceMappingURL=CreateAdminWalletDTO.d.ts.map