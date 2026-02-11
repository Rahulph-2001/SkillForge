import { z } from 'zod';
/**
 * Zod schema for Browse Skill DTO
 */
export declare const BrowseSkillDTOSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    level: z.ZodString;
    durationHours: z.ZodNumber;
    creditsPerHour: z.ZodNumber;
    imageUrl: z.ZodNullable<z.ZodString>;
    tags: z.ZodArray<z.ZodString>;
    rating: z.ZodNumber;
    totalSessions: z.ZodNumber;
    provider: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reviewCount: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    availableDays: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type BrowseSkillDTO = z.infer<typeof BrowseSkillDTOSchema>;
/**
 * Zod schema for Browse Skills Response DTO
 */
export declare const BrowseSkillsResponseDTOSchema: z.ZodObject<{
    skills: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        category: z.ZodString;
        level: z.ZodString;
        durationHours: z.ZodNumber;
        creditsPerHour: z.ZodNumber;
        imageUrl: z.ZodNullable<z.ZodString>;
        tags: z.ZodArray<z.ZodString>;
        rating: z.ZodNumber;
        totalSessions: z.ZodNumber;
        provider: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            email: z.ZodString;
            avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            reviewCount: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        availableDays: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type BrowseSkillsResponseDTO = z.infer<typeof BrowseSkillsResponseDTOSchema>;
//# sourceMappingURL=BrowseSkillsResponseDTO.d.ts.map