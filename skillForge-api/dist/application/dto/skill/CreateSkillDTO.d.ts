import { z } from 'zod';
export declare const CreateSkillSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    level: z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>;
    durationHours: z.ZodNumber;
    creditsHour: z.ZodNumber;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    templateId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateSkillDTO = z.infer<typeof CreateSkillSchema>;
//# sourceMappingURL=CreateSkillDTO.d.ts.map