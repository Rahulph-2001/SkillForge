import { z } from 'zod';
/**
 * Zod schema for Skill Details DTO
 */
export declare const SkillDetailsDTOSchema: z.ZodObject<{
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
        avatarUrl: z.ZodNullable<z.ZodString>;
        rating: z.ZodNumber;
        reviewCount: z.ZodNumber;
    }, z.core.$strip>;
    availability: z.ZodNullable<z.ZodObject<{
        weeklySchedule: z.ZodRecord<z.ZodString, z.ZodObject<{
            enabled: z.ZodBoolean;
            slots: z.ZodArray<z.ZodObject<{
                start: z.ZodString;
                end: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        blockedDates: z.ZodArray<z.ZodObject<{
            date: z.ZodCoercedDate<unknown>;
            reason: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        timezone: z.ZodString;
        bookedSlots: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            date: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SkillDetailsDTO = z.infer<typeof SkillDetailsDTOSchema>;
//# sourceMappingURL=SkillDetailsResponseDTO.d.ts.map