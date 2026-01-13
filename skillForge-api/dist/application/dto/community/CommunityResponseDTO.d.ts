import { z } from 'zod';
/**
 * Zod schema for Community Response DTO
 */
export declare const CommunityResponseDTOSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodString;
    imageUrl: z.ZodNullable<z.ZodString>;
    videoUrl: z.ZodNullable<z.ZodString>;
    adminId: z.ZodString;
    adminName: z.ZodOptional<z.ZodString>;
    adminAvatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    creditsCost: z.ZodNumber;
    creditsPeriod: z.ZodString;
    membersCount: z.ZodNumber;
    isActive: z.ZodBoolean;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    isJoined: z.ZodOptional<z.ZodBoolean>;
    isAdmin: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CommunityResponseDTO = z.infer<typeof CommunityResponseDTOSchema>;
//# sourceMappingURL=CommunityResponseDTO.d.ts.map