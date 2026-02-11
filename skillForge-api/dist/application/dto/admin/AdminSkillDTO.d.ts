import { z } from 'zod';
/**
 * Extended Pending Skill DTO with admin-specific fields
 */
export declare const AdminSkillDTOSchema: z.ZodObject<{
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
    isBlocked: z.ZodBoolean;
    blockedReason: z.ZodNullable<z.ZodString>;
    blockedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    totalSessions: z.ZodNumber;
    rating: z.ZodNumber;
    rejectionReason: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type AdminSkillDTO = z.infer<typeof AdminSkillDTOSchema>;
//# sourceMappingURL=AdminSkillDTO.d.ts.map