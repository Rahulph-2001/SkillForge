import { z } from 'zod';
/**
 * Zod schema for pagination result metadata
 */
declare const PaginationMetadataSchema: z.ZodObject<{
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNextPage: z.ZodBoolean;
    hasPreviousPage: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Zod schema for community statistics
 */
declare const CommunityStatsSchema: z.ZodObject<{
    totalCommunities: z.ZodNumber;
    totalMembers: z.ZodNumber;
    avgMembershipCost: z.ZodNumber;
}, z.core.$strip>;
/**
 * Zod schema for List Communities Response DTO (Admin)
 */
export declare const ListCommunitiesResponseSchema: z.ZodObject<{
    communities: z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        total: z.ZodNumber;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNextPage: z.ZodBoolean;
        hasPreviousPage: z.ZodBoolean;
    }, z.core.$strip>;
    stats: z.ZodObject<{
        totalCommunities: z.ZodNumber;
        totalMembers: z.ZodNumber;
        avgMembershipCost: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ListCommunitiesResponseDTO = z.infer<typeof ListCommunitiesResponseSchema>;
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;
export type CommunityStats = z.infer<typeof CommunityStatsSchema>;
export {};
//# sourceMappingURL=ListCommunitiesResponseDTO.d.ts.map