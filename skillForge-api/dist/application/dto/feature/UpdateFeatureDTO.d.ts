import { z } from 'zod';
export declare const UpdateFeatureSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    limitValue: z.ZodOptional<z.ZodNumber>;
    isEnabled: z.ZodOptional<z.ZodBoolean>;
    isHighlighted: z.ZodOptional<z.ZodBoolean>;
    displayOrder: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type UpdateFeatureDTO = z.infer<typeof UpdateFeatureSchema>;
//# sourceMappingURL=UpdateFeatureDTO.d.ts.map