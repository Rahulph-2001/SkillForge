import { z } from 'zod';
export declare const UpdateCommunitySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    creditsCost: z.ZodOptional<z.ZodNumber>;
    creditsPeriod: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    videoUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateCommunityDTO = z.infer<typeof UpdateCommunitySchema>;
//# sourceMappingURL=UpdateCommunityDTO.d.ts.map