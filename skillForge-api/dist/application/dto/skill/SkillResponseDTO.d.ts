import { z } from 'zod';
/**
 * Zod schema for Skill Response DTO
 */
export declare const SkillResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    level: z.ZodString;
    durationHours: z.ZodNumber;
    creditsPerHour: z.ZodNumber;
    tags: z.ZodArray<z.ZodString>;
    imageUrl: z.ZodNullable<z.ZodString>;
    templateId: z.ZodNullable<z.ZodString>;
    status: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type SkillResponseDTO = z.infer<typeof SkillResponseDTOSchema>;
//# sourceMappingURL=SkillResponseDTO.d.ts.map