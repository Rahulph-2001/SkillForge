import { z } from 'zod';
export declare const CreateSkillTemplateSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    creditsMin: z.ZodNumber;
    creditsMax: z.ZodNumber;
    mcqCount: z.ZodNumber;
    passRange: z.ZodDefault<z.ZodNumber>;
    levels: z.ZodArray<z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        Active: "Active";
        Inactive: "Inactive";
    }>>>;
}, z.core.$strip>;
export type CreateSkillTemplateDTO = z.infer<typeof CreateSkillTemplateSchema>;
//# sourceMappingURL=CreateSkillTemplateDTO.d.ts.map