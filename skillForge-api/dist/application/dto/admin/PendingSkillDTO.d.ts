import { z } from 'zod';
/**
 * Zod schema for Pending Skill DTO
 */
export declare const PendingSkillDTOSchema: z.ZodObject<{
    id: z.ZodString;
    providerId: z.ZodString;
    providerName: z.ZodString;
    providerEmail: z.ZodString;
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
    verificationStatus: z.ZodNullable<z.ZodString>;
    mcqScore: z.ZodNullable<z.ZodNumber>;
    mcqTotalQuestions: z.ZodNullable<z.ZodNumber>;
    mcqPassingScore: z.ZodNullable<z.ZodNumber>;
    verifiedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type PendingSkillDTO = z.infer<typeof PendingSkillDTOSchema>;
//# sourceMappingURL=PendingSkillDTO.d.ts.map