import { z } from 'zod';
export declare const BrowseSkillsRequestSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
        Expert: "Expert";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    minCredits: z.ZodOptional<z.ZodNumber>;
    maxCredits: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        rating: "rating";
        createdAt: "createdAt";
        credits: "credits";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
    excludeProviderId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BrowseSkillsRequestDTO = z.infer<typeof BrowseSkillsRequestSchema>;
//# sourceMappingURL=BrowseSkillsRequestDTO.d.ts.map