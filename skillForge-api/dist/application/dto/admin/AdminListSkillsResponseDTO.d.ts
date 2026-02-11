import { z } from 'zod';
/**
 * Zod schema for Admin List Skills Response DTO
 */
export declare const AdminListSkillsResponseDTOSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNextPage: z.ZodBoolean;
    hasPreviousPage: z.ZodBoolean;
}, z.core.$strip>;
export type AdminListSkillsResponseDTO = z.infer<typeof AdminListSkillsResponseDTOSchema>;
//# sourceMappingURL=AdminListSkillsResponseDTO.d.ts.map