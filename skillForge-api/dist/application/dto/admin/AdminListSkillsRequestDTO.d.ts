import { z } from 'zod';
/**
 * Zod schema for Admin List Skills Request DTO
 */
export declare const AdminListSkillsRequestSchema: z.ZodObject<{
    adminUserId: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
        "in-review": "in-review";
    }>>;
    isBlocked: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type AdminListSkillsRequestDTO = z.infer<typeof AdminListSkillsRequestSchema>;
//# sourceMappingURL=AdminListSkillsRequestDTO.d.ts.map