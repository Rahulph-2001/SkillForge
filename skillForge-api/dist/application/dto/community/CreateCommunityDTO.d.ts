import { z } from 'zod';
export declare const CreateCommunitySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    creditsCost: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    creditsPeriod: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateCommunityDTO = z.infer<typeof CreateCommunitySchema>;
//# sourceMappingURL=CreateCommunityDTO.d.ts.map