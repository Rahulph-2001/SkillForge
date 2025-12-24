import { z } from 'zod';
export declare const UpdateSkillTemplateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    creditsMin: z.ZodOptional<z.ZodNumber>;
    creditsMax: z.ZodOptional<z.ZodNumber>;
    mcqCount: z.ZodOptional<z.ZodNumber>;
    passRange: z.ZodOptional<z.ZodNumber>;
    levels: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        Active: "Active";
        Inactive: "Inactive";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateSkillTemplateDTO = z.infer<typeof UpdateSkillTemplateSchema>;
//# sourceMappingURL=UpdateSkillTemplateDTO.d.ts.map